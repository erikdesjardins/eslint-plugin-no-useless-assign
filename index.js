/**
 * @fileoverview Prevent useless assignment.
 * @author Erik Desjardins
 * @copyright 2016 Erik Desjardins. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

module.exports = {
	rules: {
		'no-useless-assign': require('./rules/no-useless-assign')
	}
};
