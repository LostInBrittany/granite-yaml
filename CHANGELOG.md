# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-06-06

Complete rewrite as vanilla custom elements, with js-yaml as only dependency.

### Changed

- **Breaking:** both elements are rewritten as plain ES module custom
  elements, replacing Polymer 3 — no polyfills and no Polymer dependency
- **Breaking:** `granite-yaml-remote-parser` uses the `fetch` API instead of
  `iron-ajax`; the `iron-ajax`-specific properties (`params`, `method`,
  `body`, `contentType`, `sync`, `verbose`, `bubbles`, `debounceDuration`,
  `lastRequest`, `lastResponse`, `lastError`, `activeRequests`) are removed,
  and `generateRequest()` is replaced by `fetchYaml()`, which returns a
  Promise of the parsed object
- **Breaking:** [js-yaml](https://github.com/nodeca/js-yaml) upgraded from
  3.x to 4.x; parsing is now always safe, so the `unsafe` property and
  attribute are removed
- **Breaking:** the legacy `granite-yaml.html` entry point is removed —
  import the element modules directly

### Added

- `yaml-error` event, fired when parsing or fetching fails (errors no longer
  escape as uncaught exceptions)
- `parseYaml(yaml, { multiDocument })` helper exported from
  `granite-yaml-parser.js` for direct use without an element
- `granite-yaml-remote-parser`: read-only `loading` property, `timeout`
  support via `AbortSignal`, and automatic cancelation of in-flight requests
  when a new one starts
- Demos work without any build step, on GitHub Pages too, thanks to an import
  map resolving `js-yaml` from a CDN
- `npm run start` launches the demo with `@web/dev-server`
- `LICENSE.md` (MIT) and this changelog

### Fixed

- The safe parsing branch actually called the unsafe `load` for
  single-document sources on js-yaml 3.x, making the `unsafe` flag a no-op
  (moot now that js-yaml 4.x is safe by default)
- The package manifest declared Apache-2.0 while the source headers and
  licence file said MIT — the whole project is now consistently MIT

## [2.0.1] - 2018-08-07

### Fixed

- Demo fixes after the Polymer 3 migration

## [2.0.0] - 2018-08-07

### Changed

- **Breaking:** migrated to Polymer 3, distributed on npm as
  `@granite-elements/granite-yaml` instead of Bower

## [1.1.0] - 2017-09-11

### Changed

- The parsed object is public

## [1.0.0] - 2017-09-11

### Added

- Initial release: Polymer 2.x web components to parse YAML into JS objects,
  `granite-yaml-parser` and `granite-yaml-remote-parser`

[3.0.0]: https://github.com/LostInBrittany/granite-yaml/compare/2.0.1...3.0.0
[2.0.1]: https://github.com/LostInBrittany/granite-yaml/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/LostInBrittany/granite-yaml/compare/1.1.0...2.0.0
[1.1.0]: https://github.com/LostInBrittany/granite-yaml/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/LostInBrittany/granite-yaml/releases/tag/1.0.0
