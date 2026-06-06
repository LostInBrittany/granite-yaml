/*
@license MIT
Copyright (c) 2016 Horacio "LostInBrittany" Gonzalez

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { parseYaml } from './granite-yaml-parser.js';

/**
 * `granite-yaml-remote-parser` is a non-visual web component that fetches
 * a YAML file from an URL and parses it into a JS object, using
 * [js-yaml](https://github.com/nodeca/js-yaml) and the `fetch` API.
 *
 * ```html
 * <granite-yaml-remote-parser url="./assets/aYamlFile.yml" auto></granite-yaml-remote-parser>
 * ```
 *
 * With `auto` set, the element performs a request whenever its `url` changes.
 * Without `auto`, call `fetchYaml()` to trigger the request.
 *
 * When the file has been fetched and parsed, a `yaml-parsed` event is fired
 * and the result is available via the read-only `obj` property.
 *
 * @element granite-yaml-remote-parser
 * @attr {String} url - The URL of the remote YAML file
 * @attr {Boolean} auto - If present, automatically performs a request when `url` changes
 * @attr {String} headers - HTTP request headers to send, as a JSON object, e.g. `headers='{"X-Requested-With": "fetch"}'`
 * @attr {Boolean} with-credentials - If present, cookies are sent with cross-origin requests
 * @attr {Number} timeout - Request timeout in milliseconds (`0` means no timeout)
 * @attr {Boolean} multi-document - If present, parsing deals with multi-document sources and `obj` is `{ documents: [...] }`
 * @attr {Boolean} debug - If present, debug logs are sent to the console
 * @fires yaml-parsed - Fired when the YAML file has been fetched and parsed. `detail` is `{ url, yaml, obj }`.
 * @fires yaml-error - Fired when fetching or parsing fails. `detail` is `{ url, error }`.
 */
export class GraniteYamlRemoteParser extends HTMLElement {

  static get observedAttributes() {
    return ['url', 'auto'];
  }

  constructor() {
    super();
    this._obj = undefined;
    this._loading = false;
    this._abortController = null;
    this._fetchQueued = false;
  }

  connectedCallback() {
    // Capture properties set before the element was upgraded
    for (const property of ['url', 'auto', 'headers', 'withCredentials', 'timeout', 'multiDocument', 'debug']) {
      this._upgradeProperty(property);
    }
    if (this.auto && this.url) {
      this._queueFetch();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (this.auto && this.url) {
      this._queueFetch();
    }
  }

  /**
   * The URL of the remote YAML file. Reflected to the `url` attribute.
   * @type {String}
   */
  get url() {
    return this.getAttribute('url') || '';
  }
  set url(value) {
    this.setAttribute('url', value);
  }

  /**
   * If `true`, automatically performs a request when `url` changes.
   * Reflected to the `auto` attribute.
   * @type {Boolean}
   */
  get auto() {
    return this.hasAttribute('auto');
  }
  set auto(value) {
    this.toggleAttribute('auto', Boolean(value));
  }

  /**
   * HTTP request headers to send, as an object.
   * Reflected to the `headers` attribute as JSON.
   * @type {Object}
   */
  get headers() {
    const value = this.getAttribute('headers');
    if (!value) {
      return {};
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      if (this.debug) { console.error('[granite-yaml-remote-parser] Invalid `headers` attribute, expecting JSON', error); }
      return {};
    }
  }
  set headers(value) {
    this.setAttribute('headers', JSON.stringify(value || {}));
  }

  /**
   * If `true`, cookies are sent with cross-origin requests
   * (`credentials: 'include'`). Reflected to the `with-credentials` attribute.
   * @type {Boolean}
   */
  get withCredentials() {
    return this.hasAttribute('with-credentials');
  }
  set withCredentials(value) {
    this.toggleAttribute('with-credentials', Boolean(value));
  }

  /**
   * Request timeout in milliseconds. `0` means no timeout.
   * Reflected to the `timeout` attribute.
   * @type {Number}
   */
  get timeout() {
    return Number(this.getAttribute('timeout')) || 0;
  }
  set timeout(value) {
    this.setAttribute('timeout', value);
  }

  /**
   * If `true`, parsing deals with multi-document sources and `obj` is
   * `{ documents: [...] }`. Reflected to the `multi-document` attribute.
   * @type {Boolean}
   */
  get multiDocument() {
    return this.hasAttribute('multi-document');
  }
  set multiDocument(value) {
    this.toggleAttribute('multi-document', Boolean(value));
  }

  /**
   * If `true`, debug logs are sent to the console.
   * Reflected to the `debug` attribute.
   * @type {Boolean}
   */
  get debug() {
    return this.hasAttribute('debug');
  }
  set debug(value) {
    this.toggleAttribute('debug', Boolean(value));
  }

  /**
   * The JS object resulting from parsing the fetched YAML (read-only).
   * @type {*}
   */
  get obj() {
    return this._obj;
  }

  /**
   * `true` while a request is in flight (read-only).
   * @type {Boolean}
   */
  get loading() {
    return this._loading;
  }

  /**
   * Fetches the YAML file at `url` and parses it.
   * A new call aborts any request still in flight.
   *
   * @return {Promise<*>} The parsed JS object
   */
  async fetchYaml() {
    if (this._abortController) {
      this._abortController.abort();
    }
    this._abortController = new AbortController();
    let signal = this._abortController.signal;
    if (this.timeout > 0) {
      signal = AbortSignal.any([signal, AbortSignal.timeout(this.timeout)]);
    }

    const url = this.url;
    if (this.debug) { console.log('[granite-yaml-remote-parser] fetchYaml - URL', url); }

    this._loading = true;
    try {
      const response = await fetch(url, {
        headers: this.headers,
        credentials: this.withCredentials ? 'include' : 'same-origin',
        signal,
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} fetching ${url}`);
      }
      const yaml = await response.text();
      this._obj = parseYaml(yaml, { multiDocument: this.multiDocument });

      if (this.debug) { console.log('[granite-yaml-remote-parser] fetchYaml - Object', this._obj); }

      this.dispatchEvent(new CustomEvent('yaml-parsed', {
        detail: { url, yaml, obj: this._obj },
        bubbles: true,
        composed: true,
      }));
      return this._obj;
    } catch (error) {
      if (error.name === 'AbortError') {
        // Superseded by a newer request, stay silent
        return undefined;
      }
      if (this.debug) { console.error('[granite-yaml-remote-parser] fetchYaml - Error', error); }
      this.dispatchEvent(new CustomEvent('yaml-error', {
        detail: { url, error },
        bubbles: true,
        composed: true,
      }));
      return undefined;
    } finally {
      this._loading = false;
    }
  }

  // ***********************************************************************
  // Internal helpers
  // ***********************************************************************

  _queueFetch() {
    // Coalesce multiple synchronous attribute changes into a single request
    if (this._fetchQueued) {
      return;
    }
    this._fetchQueued = true;
    queueMicrotask(() => {
      this._fetchQueued = false;
      if (this.auto && this.url) {
        this.fetchYaml();
      }
    });
  }

  _upgradeProperty(property) {
    if (Object.prototype.hasOwnProperty.call(this, property)) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }
}

if (!customElements.get('granite-yaml-remote-parser')) {
  customElements.define('granite-yaml-remote-parser', GraniteYamlRemoteParser);
}
