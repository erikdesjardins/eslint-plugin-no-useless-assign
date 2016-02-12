/**
 * @fileoverview Prevent redundant assignment.
 * @author Erik Desjardins
 * @copyright 2016 Erik Desjardins. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

var rule = require('../rules/no-redundant-assign');
var RuleTester = require("eslint").RuleTester;

var errorMessage = 'Redundant assignment.';

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
		{ code: 'let foo; () => { foo = bar; return foo; };', ecmaFeatures: { arrowFunctions: true, blockBindings: true } },
		// not the last var before return
		'var foo, bar; return foo;',
		// not the last let before return
		{ code: 'let foo, bar; return foo;', ecmaFeatures: { blockBindings: true } },
		// not the last const before return
		{ code: 'const foo = 1, bar = 2; return foo;', ecmaFeatures: { blockBindings: true } },
		// multiple var declarations
		'var foo; var bar; return foo;',
		// mixed var declarations
		{ code: 'const foo = 1; let bar; return foo;', ecmaFeatures: { blockBindings: true } }
	],
	invalid: [
		// redundant var
		{
			code: 'var foo; return foo;',
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 5
			}]
		},
		// redundant var, within block
		{
			code: 'function() { if (bar) { var foo; return foo; } }',
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 29
			}]
		},
		// redundant let
		{
			code: 'let foo; return foo;',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 5
			}]
		},
		// redundant let, within block
		{
			code: 'function() { if (bar) { let foo; return foo; } }',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 29
			}]
		},
		// redundant const
		{
			code: 'const foo = bar; return foo;',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 7
			}]
		},
		// redundant const, within block
		{
			code: 'function() { if (bar) { const foo = bar; return foo; } }',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 31
			}]
		},
		// reassign to var in scope
		{
			code: 'var foo; bar(); foo = baz; return foo;',
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 17
			}]
		},
		// reassign to var in scope, within block
		{
			code: 'var foo; bar(); if (1) { foo = baz; return foo; }',
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 26
			}]
		},
		// reassign to let in scope
		{
			code: 'let foo; bar(); foo = baz; return foo;',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 17
			}]
		},
		// reassign to let in scope, within block
		{
			code: 'let foo; bar(); if (1) { foo = baz; return foo; }',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: errorMessage,
				type: 'Identifier',
				line: 1,
				column: 26
			}]
		}
	]
});
