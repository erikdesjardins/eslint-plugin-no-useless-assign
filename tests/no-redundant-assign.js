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
	],
	invalid: [
	]
});
