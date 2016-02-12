/**
 * @fileoverview Prevent redundant assignment.
 * @author Erik Desjardins
 * @copyright 2016 Erik Desjardins. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

module.exports = function(context) {
	var sourceCode = context.getSourceCode();

	function nodeBefore(node) {
		// BlockStatement
		var siblings = node.parent.body;
		for (var i = 0; i < siblings.length - 1; ++i) {
			if (siblings[i + 1] === node) {
				return siblings[i];
			}
		}
		return null;
	}

	function checkForRedundantVar(declar, name) {
		var lastVar = declar.declarations[declar.declarations.length - 1];

		if (lastVar.id.name === name) {
			context.report({
				node: lastVar,
				message: 'Redundant variable.'
			});
		}
	}

	function checkForRedundantAssignment(assignment, name) {
		var left = assignment.expression.left;

		if (left.type !== 'Identifier') {
			return;
		}

		if (left.name !== name) {
			return;
		}

		for (var parent = assignment.parent, hasOurVar = false; !hasOurVar; parent = parent.parent) {
			if (
				parent.type === 'FunctionDeclaration' ||
				parent.type === 'FunctionExpression' ||
				parent.type === 'ArrowFunctionExpression'
			) {
				// variable is not in this function scope, return
				return;
			}

			hasOurVar = (parent.body || []).some(function(node) {
				return context.getDeclaredVariables(node).some(function(varDecl) {
					return varDecl.name === name;
				});
			});
		}

		context.report({
			node: left,
			message: 'Redundant assignment.'
		});
	}

	function checkReturnStatement(node) {
		if (!node.argument) {
			return;
		}

		if (node.argument.type !== 'Identifier') {
			return;
		}

		var name = node.argument.name;
		var prevNode = nodeBefore(node);

		if (!prevNode) {
			return;
		}

		if (prevNode.type === 'VariableDeclaration') {
			checkForRedundantVar(prevNode, name);
		} else if (prevNode.type === 'ExpressionStatement' && prevNode.expression.type === 'AssignmentExpression') {
			checkForRedundantAssignment(prevNode, name);
		}
	}

	return {
		ReturnStatement: checkReturnStatement
	};
};
