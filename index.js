/**
 * @fileoverview Prevent redundant assignment.
 * @author Erik Desjardins
 * @copyright 2016 Erik Desjardins. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

module.exports = {
	rules: {
		'no-redundant-assign': require('./rules/no-redundant-assign')
	}
};
