/**
 * @fileoverview Prevent useless assignment.
 * @author Erik Desjardins
 * @copyright 2016 Erik Desjardins. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

var rule = require('../rules/no-useless-assign');
var RuleTester = require("eslint").RuleTester;

var varMessage = 'Redundant variable.';
var assignMessage = 'Useless assignment.';

var ruleTester = new RuleTester();
ruleTester.run('no-useless-assign', rule, {
	valid: [
		// return for control flow
		'(function() { return; });',
		// return for control flow within shorthand if
		'(function() { if (foo) return; else return; });',
		// constant
		'(function() { return 5; });',
		// variable
		'(function() { return foo; });',
		// variable within shorthand if
		'(function() { if (foo) return foo; else return foo; });',
		// declared variable within shorthand if
		'(function() { var foo; if (foo) return foo; });',
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
		// switch case
		'(function() { switch (foo) { case bar: return baz; } });',
		// assignment to global
		'(function() { foo = bar; return foo; });',
		// assignment to global, function declaration
		'function a() { foo = bar; return foo; }',
		// assignment to global, arrow function
		{ code: '(() => { foo = bar; return foo; });', parserOptions: { ecmaVersion: 2018 } },
		// assignment of out-of-scope var
		'(function() { var foo; (function() { foo = bar; return foo; }); });',
		// assignment of out-of-scope var, function declaration
		'function a() { var foo; function b() { foo = bar; return foo; } }',
		// assignment of out-of-scope var, arrow function
		{ code: '(function() { var foo; (() => { foo = bar; return foo; }); });', parserOptions: { ecmaVersion: 2018 } },
		// assignment of out-of-scope let
		{ code: '(function() { let foo; (function() { foo = bar; return foo; }); });', parserOptions: { ecmaVersion: 2018 } },
		// assignment of out-of-scope let, function declaration
		{ code: 'function a() { let foo; function b() { foo = bar; return foo; } }', parserOptions: { ecmaVersion: 2018 } },
		// assignment of out-of-scope let, arrow function
		{ code: '(function() { let foo; (() => { foo = bar; return foo; }); });', parserOptions: { ecmaVersion: 2018 } },
		// not the last var before return
		'(function() { var foo, bar; return foo; });',
		// not the last var before return, switch case
		'(function() { switch (foo) { case baz: var foo, bar; return foo; } });',
		// not the last let before return
		{ code: '(function() { let foo, bar; return foo; });', parserOptions: { ecmaVersion: 2018 } },
		// not the last const before return
		{ code: '(function() { const foo = 1, bar = 2; return foo; });', parserOptions: { ecmaVersion: 2018 } },
		// multiple var declarations
		'(function() { var foo; var bar; return foo; });',
		// mixed var declarations
		{ code: '(function() { const foo = 1; let bar; return foo; });', parserOptions: { ecmaVersion: 2018 } },
		// global, many statements deep
		'(function() { if (foo) {} else { if (foo) with (foo) { for (foo; foo; foo) { while (foo) { do { foo = bar; return foo; } while (foo); } } } } });',
		// global, within try-catch
		'(function() { try { foo = bar; return foo; } catch (e) { foo = bar; return foo; } });',
		// shorthand plus-equals, etc.
		'(function() { var foo; foo += 1; return foo; });',
		// _just_ out-of-scope
		'(function() { var foo; function a() { var bar; function b() { bar = baz; return bar; } foo = baz; return foo; } });',
		// params out-of-scope
		'(function(foo) { (function() { foo = bar; return foo; }); });',
		// arrow function params out-of-scope
		{ code: '(foo => { (() => { foo = bar; return foo; }); });', parserOptions: { ecmaVersion: 2018 } },
		// generator params out-of-scope
		{ code: '(function*(foo) { (function*() { foo = bar; return foo; }); });', parserOptions: { ecmaVersion: 2018 } },
		// class method params out-of-scope
		{ code: '(class { foo(bar) { (function() { bar = baz; return bar; }); } });', parserOptions: { ecmaVersion: 2018 } },
		// object method params out-of-scope
		{ code: '({ foo(bar) { (function() { bar = baz; return bar; }); } });', parserOptions: { ecmaVersion: 2018 } },
	],
	invalid: [
		// useless var
		{
			code: '(function() { var foo; return foo; });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 19
			}]
		},
		// useless var, last in list
		{
			code: '(function() { var bar, foo; return foo; });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 24
			}]
		},
		// useless initialized var, last in list
		{
			code: '(function() { var bar, foo = baz; return foo; });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 24
			}]
		},
		// useless var, within block
		{
			code: '(function() { if (bar) { var foo; return foo; } });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 30
			}]
		},
		// useless var, within switch case
		{
			code: '(function() { switch (foo) { case baz: var foo; return foo; } });',
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 44
			}]
		},
		// useless let
		{
			code: '(function() { let foo; return foo; });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 19
			}]
		},
		// useless let, within block
		{
			code: '(function() { if (bar) { let foo; return foo; } });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 30
			}]
		},
		// useless const
		{
			code: '(function() { const foo = bar; return foo; });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: varMessage,
				type: 'VariableDeclarator',
				line: 1,
				column: 21
			}]
		},
		// useless const, within block
		{
			code: '(function() { if (bar) { const foo = bar; return foo; } });',
			parserOptions: { ecmaVersion: 2018 },
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
		// reassign to var in scope, within switch case
		{
			code: '(function() { var foo; switch (foo) { case baz: foo = bar; return foo; } });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 49
			}]
		},
		// reassign to var in scope, many statements deep
		{
			code: '(function() { var foo; if (foo) {} else { if (foo) with (foo) { for (foo; foo; foo) { while (foo) { do { foo = bar; return foo; } while (foo); } } } } });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 106
			}]
		},
		// reassign to var in scope, many statements deep (var halfway up)
		{
			code: '(function() { if (foo) {} else { if (foo) with (foo) { var foo; for (foo; foo; foo) { while (foo) { do { foo = bar; return foo; } while (foo); } } } } });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 106
			}]
		},
		// reassign to var in scope, within try-catch
		{
			code: '(function() { var foo; try { foo = bar; return foo; } catch (e) { foo = bar; return foo; } });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 30
			}, {
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 67
			}]
		},
		// reassign to var in scope, split across intermediate scope
		{
			code: '(function() { var foo; function a() { var bar; bar = baz; return bar; } foo = baz; return foo; });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 48
			}, {
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 73
			}]
		},
		// reassign to let in scope
		{
			code: '(function() { let foo; bar(); foo = baz; return foo; });',
			parserOptions: { ecmaVersion: 2018 },
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
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 42
			}]
		},
		// shadowed var, let
		{
			code: '(function() { var foo; let bar; (function() { var foo; foo = 5; return foo; }); (function() { let bar; bar = 5; return bar; }); });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 56
			}, {
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 104
			}]
		},
		// reassign to params
		{
			code: '(function(foo) { foo = bar; return foo; });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 18
			}]
		},
		// reassign to params, shadowing var out-of-scope
		{
			code: '(function() { var foo; (function(foo) { foo = bar; return foo; }); });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 41
			}]
		},
		// reassign to var, shadowing params out-of-scope
		{
			code: '(function(foo) { (function() { var foo; foo = bar; return foo; }); });',
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 41
			}]
		},
		// reassign to arrow function params
		{
			code: '(foo => { foo = bar; return foo; });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 11
			}]
		},
		// reassign to generator params
		{
			code: '(function*(foo) { foo = bar; return foo; });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 19
			}]
		},
		// reassign to class method params
		{
			code: '(class { foo(bar) { bar = baz; return bar; } });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 21
			}]
		},
		// reassign to object method params
		{
			code: '({ foo(bar) { bar = baz; return bar; } });',
			parserOptions: { ecmaVersion: 2018 },
			errors: [{
				message: assignMessage,
				type: 'Identifier',
				line: 1,
				column: 15
			}]
		},
	]
});
