/**
 * @fileoverview Prevent redundant assignment.
 * @author Erik Desjardins
 * @copyright 2016 Erik Desjardins. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

var rule = require('../rules/no-redundant-assign');
var RuleTester = require("eslint").RuleTester;

var varMessage = 'Redundant variable.';
var assignMessage = 'Redundant assignment.';

var ruleTester = new RuleTester();
ruleTester.run('no-redundant-assign', rule, {
	valid: [
		// return for control flow
		'(function() { return; });',
		// constant
		'(function() { return 5; });',
		// variable
		'(function() { return foo; });',
		// function invocation
		'(function() { return foo.bar(); });',
		// property of preceding variable
		'(function() { var foo; return foo.bar; });',
		// function invocation of preceding variable
		'(function() { var foo; return foo(); });',
		// function invocation on preceding variable
		'(function() { var foo; return foo.bar() });',
		// expression involving preceding variable
		'(function() { var foo; return foo + bar; });',
		// function invocation with preceding variable as argument
		'(function() { var foo; return bar(foo); });',
		// assignment to global
		'(function() { foo = bar; return foo; });',
		// assignment to global, function declaration
		'function a() { foo = bar; return foo; }',
		// assignment to global, arrow function
		{ code: '(() => { foo = bar; return foo; });', ecmaFeatures: { arrowFunctions: true } },
		// assignment of out-of-scope var
		'(function() { var foo; (function() { foo = bar; return foo; }); });',
		// assignment of out-of-scope var, function declaration
		'function a() { var foo; function b() { foo = bar; return foo; } }',
		// assignment of out-of-scope var, arrow function
		{ code: '(function() { var foo; (() => { foo = bar; return foo; }); });', ecmaFeatures: { arrowFunctions: true } },
		// assignment of out-of-scope let
		{ code: '(function() { let foo; (function() { foo = bar; return foo; }); });', ecmaFeatures: { blockBindings: true } },
		// assignment of out-of-scope let, function declaration
		{ code: 'function a() { let foo; function b() { foo = bar; return foo; } }', ecmaFeatures: { blockBindings: true } },
		// assignment of out-of-scope let, arrow function
		{ code: '(function() { let foo; (() => { foo = bar; return foo; }); });', ecmaFeatures: { arrowFunctions: true, blockBindings: true } },
		// not the last var before return
		'(function() { var foo, bar; return foo; });',
		// not the last let before return
		{ code: '(function() { let foo, bar; return foo; });', ecmaFeatures: { blockBindings: true } },
		// not the last const before return
		{ code: '(function() { const foo = 1, bar = 2; return foo; });', ecmaFeatures: { blockBindings: true } },
		// multiple var declarations
		'(function() { var foo; var bar; return foo; });',
		// mixed var declarations
		{ code: '(function() { const foo = 1; let bar; return foo; });', ecmaFeatures: { blockBindings: true } }
	],
	invalid: [
		// redundant var
		{
			code: '(function() { var foo; return foo; });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 19
			}]
		},
		// redundant var, last in list
		{
			code: '(function() { var bar, foo; return foo; });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 24
			}]
		},
		// redundant initialized var, last in list
		{
			code: '(function() { var bar, foo = baz; return foo; });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 24
			}]
		},
		// redundant var, within block
		{
			code: '(function() { if (bar) { var foo; return foo; } });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 30
			}]
		},
		// redundant let
		{
			code: '(function() { let foo; return foo; });',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 19
			}]
		},
		// redundant let, within block
		{
			code: '(function() { if (bar) { let foo; return foo; } });',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 30
			}]
		},
		// redundant const
		{
			code: '(function() { const foo = bar; return foo; });',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 21
			}]
		},
		// redundant const, within block
		{
			code: '(function() { if (bar) { const foo = bar; return foo; } });',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 32
			}]
		},
		// reassign to var in scope
		{
			code: '(function() { var foo; bar(); foo = baz; return foo; });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 31
			}]
		},
		// reassign to var in scope, within block
		{
			code: '(function() { var foo; bar(); if (baz) { foo = baz; return foo; } });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 42
			}]
		},
		// reassign to let in scope
		{
			code: '(function() { let foo; bar(); foo = baz; return foo; });',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 31
			}]
		},
		// reassign to let in scope, within block
		{
			code: '(function() { let foo; bar(); if (baz) { foo = baz; return foo; } });',
			ecmaFeatures: { blockBindings: true },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 42
			}]
		}
	]
});
