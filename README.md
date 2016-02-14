# eslint-plugin-no-useless-assign [![Build Status](https://travis-ci.org/erikdesjardins/eslint-plugin-no-useless-assign.svg?branch=master)](https://travis-ci.org/erikdesjardins/eslint-plugin-no-useless-assign)

Prevent useless assignment of the form:

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

`npm i --save-dev eslint-plugin-no-useless-assign`

```json
{
	"plugins": [
		"no-useless-assign"
	],
	"rules": {
		"no-useless-assign/no-useless-assign": 2
	}
}
```
