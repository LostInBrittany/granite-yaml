[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/LostInBrittany/granite-yaml)

# granite-yaml

A set of Custom Elements to deal with YAML files.

Available elements:

- granite-yaml-parser: A parser of YAML to JS object, based on JS-YAML. 
- granite-yaml-remote-parser: A parser of YAML that grabs a YAML file from an URL and parses it into JS object.


> Polymer 3.x. element
> The legacy Polymer 2.x version is available [here](https://www.webcomponents.org/element/LostInBrittany/granite-yaml/)

## Usage example

<!---
```
<custom-element-demo>
  <template>
    <script src="../../@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
    <script type="module" src="../../@granite-elements/granite-yaml.js"></script>
    <dom-bind id="binding">
      <template>
        <next-code-block></next-code-block>
      </template>
    </dom-bind>
    <script>    
      document.querySelector('granite-yaml-parser').addEventListener('yaml-parsed', (evt) => {
        console.log('YAML parsed inline demo', evt.detail);
        binding.stringify_obj = JSON.stringify(evt.detail.obj);
      });
      let binding = document.getElementById('binding');
      binding.yaml=`        
aString: 'This is a string'
aNumber: 42
anotherString: |
  This is a multiline
  string
yetAnotherString: >
  This is another multiline
  string
      `;
    </script>
  </template>
</custom-element-demo>
```
-->
```html
<granite-yaml-parser 
    yaml='[[yaml]]' 
    obj="{{obj}}" 
    debug></granite-yaml-parser>
```

## Install


Install the component using [npm](https://www.npmjs.com/):

```sh
$ npm i @granite-elements/ace-widget --save
```

Once installed, import it in your application:

import '@granite-elements/granite-yaml/granite-yaml-parser.js';



## Running demos and tests in browser

1. Fork the `granite-yaml` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) 
and the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) installed.

1. When in the `granite-yaml` directory, run `npm install` to install dependencies.

1. Serve the project using Polyumer CLI:

    `polymer serve --module-resolution node --component-dir node_modules`

1. Open the demo in the browser

    - http://127.0.0.1:8080/components/@greanite-elements/granite-yaml/demo



## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[Apache Licence, Version 2.0](https://opensource.org/licenses/Apache-2.0)
