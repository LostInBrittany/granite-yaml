# granite-yaml

> A set of web components to parse YAML files into JS objects, based on
> [js-yaml](https://github.com/nodeca/js-yaml)
>
> Vanilla custom elements, no framework needed

Available elements:

- `granite-yaml-parser`: parses a YAML text into a JS object
- `granite-yaml-remote-parser`: fetches a YAML file from an URL and parses it
  into a JS object

## Doc & demo

[https://lostinbrittany.github.io/granite-yaml](https://lostinbrittany.github.io/granite-yaml)

## Usage example

```html
<granite-yaml-parser yaml="aNumber: 42"></granite-yaml-parser>
```

```html
<granite-yaml-remote-parser url="./assets/aYamlFile.yml" auto></granite-yaml-remote-parser>
```

Both elements are non-visual: they parse the YAML and expose the result via
the read-only `obj` property and the `yaml-parsed` event.

## Install

Install the component using [npm](https://www.npmjs.com/):

```sh
npm install @granite-elements/granite-yaml
```

## Usage

1. Import the custom element:

    ```html
    <script type="module" src="node_modules/@granite-elements/granite-yaml/granite-yaml-parser.js"></script>
    ```

    Or from JavaScript:

    ```js
    import '@granite-elements/granite-yaml/granite-yaml-parser.js';
    ```

    The elements import `js-yaml` as a bare module specifier, so use a bundler
    or a dev server with node resolution — or an
    [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
    if you serve without a build step:

    ```html
    <script type="importmap">
      { "imports": { "js-yaml": "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.mjs" } }
    </script>
    ```

2. Start using it!

    ```html
    <granite-yaml-parser id="parser"></granite-yaml-parser>
    <script>
      const parser = document.getElementById('parser');
      parser.addEventListener('yaml-parsed', (evt) => {
        console.log(evt.detail.obj);
      });
      parser.yaml = 'aNumber: 42';
    </script>
    ```

You can also skip the elements and use the parsing helper directly:

```js
import { parseYaml } from '@granite-elements/granite-yaml/granite-yaml-parser.js';

const obj = parseYaml('aNumber: 42');
```

## API

### granite-yaml-parser

#### Attributes / properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `yaml` | `yaml` | `String` | `''` | The YAML text to parse. Setting it triggers parsing |
| `multi-document` | `multiDocument` | `Boolean` | `false` | If `true`, parsing deals with multi-document sources and `obj` is `{ documents: [...] }` |
| `debug` | `debug` | `Boolean` | `false` | If `true`, debug logs are sent to the console |
| — | `obj` | `Object` | — | The JS object resulting from parsing `yaml` (read-only) |

#### Events

| Event | Detail | Description |
|---|---|---|
| `yaml-parsed` | `{ yaml, obj }` | Fired when a YAML text has been parsed |
| `yaml-error` | `{ yaml, error }` | Fired when parsing fails |

### granite-yaml-remote-parser

#### Attributes / properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `url` | `url` | `String` | `''` | The URL of the remote YAML file |
| `auto` | `auto` | `Boolean` | `false` | If `true`, automatically performs a request when `url` changes |
| `headers` | `headers` | `Object` | `{}` | HTTP request headers to send, as a JSON object in the attribute |
| `with-credentials` | `withCredentials` | `Boolean` | `false` | If `true`, cookies are sent with cross-origin requests |
| `timeout` | `timeout` | `Number` | `0` | Request timeout in milliseconds (`0` means no timeout) |
| `multi-document` | `multiDocument` | `Boolean` | `false` | If `true`, parsing deals with multi-document sources and `obj` is `{ documents: [...] }` |
| `debug` | `debug` | `Boolean` | `false` | If `true`, debug logs are sent to the console |
| — | `obj` | `Object` | — | The JS object resulting from parsing the fetched YAML (read-only) |
| — | `loading` | `Boolean` | — | `true` while a request is in flight (read-only) |

#### Methods

| Method | Description |
|---|---|
| `fetchYaml()` | Fetches the YAML file at `url` and parses it. Returns a Promise of the parsed object. A new call aborts any request still in flight |

#### Events

| Event | Detail | Description |
|---|---|---|
| `yaml-parsed` | `{ url, yaml, obj }` | Fired when the YAML file has been fetched and parsed |
| `yaml-error` | `{ url, error }` | Fired when fetching or parsing fails |

## Migrating from 2.x (Polymer 3)

Version 3.0 is a rewrite as dependency-light vanilla custom elements
(js-yaml is the only runtime dependency).

- No more Polymer: load with `<script type="module">`, no polyfills needed
- `granite-yaml-remote-parser` uses `fetch` instead of `iron-ajax`;
  `generateRequest()` is replaced by `fetchYaml()`, and the `iron-ajax`
  passthrough properties are gone
- js-yaml 4.x parses safely by default, so the `unsafe` property is removed
- Errors fire a `yaml-error` event instead of throwing

## Running the demo locally

```sh
npm install
npm run start
```

This launches [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) and opens the demo in your browser.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT License](http://opensource.org/licenses/MIT)
