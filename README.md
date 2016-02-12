# eslint-plugin-no-redundant-assign [![Build Status](https://travis-ci.org/erikdesjardins/eslint-plugin-no-redundant-assign.svg?branch=master)](https://travis-ci.org/erikdesjardins/eslint-plugin-no-redundant-assign)

Prevent redundant assignment of the form:

```js
var foo = bar;
return foo;
```

```js
var foo;
// ...
foo = bar;
return foo;
```

`npm i --save-dev eslint-plugin-no-redundant-assign`

```json
{
	"plugins": [
		"no-redundant-assign"
	],
	"rules": {
		"no-redundant-assign/no-redundant-assign": 2
	}
}
```
