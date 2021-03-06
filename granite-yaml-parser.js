/**
@license MIT
Copyright (c) 2016 Horacio "LostInBrittany" Gonzalez

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import 'js-yaml/dist/js-yaml';
/* global jsyaml */
/**
 * `granite-yaml-parser`
 * A parser of YAML to JS object, based on JS-YAML.
 *
 * @customElement
 * @polymer
 * @demo demo/demo-granite-yaml-parser.html
 */
class GraniteYamlParser extends PolymerElement {
  static get is() { return 'granite-yaml-parser'; }

  /**
    * Fired when a YAML text have been decoded.
    *
    * @event yaml-parsed
    */

  static get properties() {
    return {
      /**
       * The YAML text to parse
       */
      yaml: {
        type: String,
        value: '',
        observer: '_onYamlChange',
      },
      /**
       * The JS object resulting from parsing `yaml`
       */
      obj: {
        type: Object,
        notify: true,
        readOnly: true,
      },
      /**
       * If `true` YS-YAML uses `load` instead of `safeLoad`.
       * Use with care with untrusted sources.
       */
      unsafe: {
        type: Boolean,
        value: false,
      },
      /**
      * If true parsing deals with multi-document sources
      */
      multiDocument: {
          type: Boolean,
          value: false,
      },
      /**
      * If true debug logs are sent to the console
      */
      debug: {
          type: Boolean,
          value: false,
      },
    };
  }

  _onYamlChange() {
    if (this.debug) { console.log('[granite-yaml-parser] _onYamlChange - YAML', this.yaml); }

    if (this.unsafe) {
      if (this.multiDocument) {
        this._setObj({documents: jsyaml.loadAll(this.yaml)});
      } else {
        this._setObj(jsyaml.load(this.yaml));
      }
    } else {
      if (this.multiDocument) {
        this._setObj({documents: jsyaml.safeLoadAll(this.yaml)});
      } else {
        this._setObj(jsyaml.load(this.yaml));
      }
    }

    this.dispatchEvent(new CustomEvent('yaml-parsed', {detail: {yaml: this.yaml, obj: this.obj}}));

    if (this.debug) { console.log('[granite-yaml-parser] _onYamlChange - Object', this.obj); }
  }
}

window.customElements.define(GraniteYamlParser.is, GraniteYamlParser);
