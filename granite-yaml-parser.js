/*
@license MIT
Copyright (c) 2016 Horacio "LostInBrittany" Gonzalez

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { load, loadAll } from 'js-yaml';

/**
 * Parses a YAML text into a JS object, using [js-yaml](https://github.com/nodeca/js-yaml).
 *
 * @param {String} yaml - The YAML text to parse
 * @param {Object} [options]
 * @param {Boolean} [options.multiDocument=false] - If `true`, parses a multi-document
 *   source and returns `{ documents: [...] }`
 * @return {*} The parsed JS object
 */
export function parseYaml(yaml, { multiDocument = false } = {}) {
  if (multiDocument) {
    return { documents: loadAll(yaml) };
  }
  return load(yaml);
}

/**
 * `granite-yaml-parser` is a non-visual web component that parses a YAML text
 * into a JS object, using [js-yaml](https://github.com/nodeca/js-yaml).
 *
 * ```html
 * <granite-yaml-parser yaml="aNumber: 42"></granite-yaml-parser>
 * ```
 *
 * Whenever the `yaml` attribute or property changes, the text is parsed and
 * a `yaml-parsed` event is fired. The result is also available at any moment
 * via the read-only `obj` property.
 *
 * Parsing is safe by default (js-yaml v4 `load`), so untrusted sources cannot
 * inject arbitrary code.
 *
 * @element granite-yaml-parser
 * @attr {String} yaml - The YAML text to parse
 * @attr {Boolean} multi-document - If present, parsing deals with multi-document sources and `obj` is `{ documents: [...] }`
 * @attr {Boolean} debug - If present, debug logs are sent to the console
 * @fires yaml-parsed - Fired when a YAML text has been parsed. `detail` is `{ yaml, obj }`.
 * @fires yaml-error - Fired when parsing fails. `detail` is `{ yaml, error }`.
 */
export class GraniteYamlParser extends HTMLElement {

  static get observedAttributes() {
    return ['yaml', 'multi-document'];
  }

  constructor() {
    super();
    this._yaml = '';
    this._obj = undefined;
  }

  connectedCallback() {
    // Capture properties set before the element was upgraded
    this._upgradeProperty('yaml');
    this._upgradeProperty('multiDocument');
    this._upgradeProperty('debug');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === 'yaml') {
      this.yaml = newValue === null ? '' : newValue;
    } else if (name === 'multi-document' && this._yaml) {
      this._parse();
    }
  }

  /**
   * The YAML text to parse. Setting it triggers parsing.
   * @type {String}
   */
  get yaml() {
    return this._yaml;
  }
  set yaml(value) {
    this._yaml = value === null || value === undefined ? '' : String(value);
    this._parse();
  }

  /**
   * The JS object resulting from parsing `yaml` (read-only).
   * @type {*}
   */
  get obj() {
    return this._obj;
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

  // ***********************************************************************
  // Internal helpers
  // ***********************************************************************

  _parse() {
    if (this.debug) { console.log('[granite-yaml-parser] _parse - YAML', this._yaml); }

    try {
      this._obj = parseYaml(this._yaml, { multiDocument: this.multiDocument });
    } catch (error) {
      if (this.debug) { console.error('[granite-yaml-parser] _parse - Error', error); }
      this.dispatchEvent(new CustomEvent('yaml-error', {
        detail: { yaml: this._yaml, error },
        bubbles: true,
        composed: true,
      }));
      return;
    }

    if (this.debug) { console.log('[granite-yaml-parser] _parse - Object', this._obj); }

    this.dispatchEvent(new CustomEvent('yaml-parsed', {
      detail: { yaml: this._yaml, obj: this._obj },
      bubbles: true,
      composed: true,
    }));
  }

  _upgradeProperty(property) {
    if (Object.prototype.hasOwnProperty.call(this, property)) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }
}

if (!customElements.get('granite-yaml-parser')) {
  customElements.define('granite-yaml-parser', GraniteYamlParser);
}
