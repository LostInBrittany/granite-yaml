[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/LostInBrittany/granite-yaml)

# granite-yaml

> Based on Polymer 2.x

A set of Custom Elements to deal with YAML files.

Available elements:

- granite-yaml-parser: A parser of YAML to JS object, based on JS-YAML 


## Usage example

<!---
```
<custom-element-demo>
  <template">
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../polymer/polymer.html">
    <link rel="import" href="granite-yaml-parser.html">
    <script>    
      document.querySelector('granite-yaml-parser').addEventListener('yaml-parsed', (evt) => {
        console.log('YAML parsed demo 1', evt.detail);
        binding.stringify_obj = JSON.stringify(evt.detail.obj);
      });
      let binding = document.getElementById('binding');
      binding.yaml=`        
aString: 'This is a string'
aNumber: 42
anotherString:
  |
  This is a multiline
  string
yetAnotherString:
  >
  This is another multiline
  string
      `;
    </script>
    [[stringify_obj]]
    <dom-bind id="binding">
      <template>
        <next-code-block></next-code-block>
      </template>
    </dom-bind>
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



## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.



## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[Apache Licence, Version 2.0](https://opensource.org/licenses/Apache-2.0)
