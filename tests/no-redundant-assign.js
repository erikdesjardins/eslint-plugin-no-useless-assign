/**
 * @fileoverview Prevent redundant assignment.
 * @author Erik Desjardins
 * @copyright 2016 Erik Desjardins. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

var rule = require('../rules/no-redundant-assign');
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('no-redundant-assign', rule, {
	valid: [
		// constant
		'return 5;',
		// variable
		'return foo;',
		// function invocation
		'return foo.bar();',
		// property of preceding variable
		'var foo; return foo.bar;',
		// function invocation of preceding variable
		'var foo; return foo();',
		// function invocation on preceding variable
		'var foo; return foo.bar()',
		// expression involving preceding variable
		'var foo; return foo + bar;',
		// function invocation with preceding variable as argument
		'var foo; return bar(foo);',
		// assignment of out-of-scope var
		'var foo; function() { foo = bar; return foo; };',
		// assignment of out-of-scope var, arrow function
		{ code: 'var foo; () => { foo = bar; return foo; };', ecmaFeatures: { arrowFunctions: true } },
		// assignment of out-of-scope let
		{ code: 'let foo; function() { foo = bar; return foo; };', ecmaFeatures: { blockBindings: true } },
		// assignment of out-of-scope let, arrow function
		{ code: 'let foo; () => { foo = bar; return foo; };', ecmaFeatures: { arrowFunctions: true, blockBindings: true } }
	],
	invalid: [
	]
});
