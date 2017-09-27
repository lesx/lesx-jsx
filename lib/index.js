'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _babelCore = require('babel-core');

var _jsxControlStatements = require('jsx-control-statements');

var _jsxControlStatements2 = _interopRequireDefault(_jsxControlStatements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pragma = 'React.createElement';

exports.default = function (code) {
	var jsxCode = ((0, _babelCore.transform)(code, {
		plugins: [_jsxControlStatements2.default, ["transform-react-jsx", {
			pragma: pragma, // default pragma is React.createElement
			useBuiltIns: true
		}]]
	}).code || '').trim();

	var index = jsxCode.indexOf(pragma);

	if (index !== 0) {
		jsxCode = '\n\t\t\t' + jsxCode.slice(0, index) + '\n\n\t\t\treturn ' + jsxCode.slice(index) + '\n\t\t';
	}

	return jsxCode;
};

module.exports = exports['default'];