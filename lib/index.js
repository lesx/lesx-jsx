"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _babelCore = require("babel-core");

var _jsxControlStatements = require("jsx-control-statements");

var _jsxControlStatements2 = _interopRequireDefault(_jsxControlStatements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (code) {
	var jsxCode = (0, _babelCore.transform)(code, {
		plugins: [_jsxControlStatements2.default, ["transform-react-jsx", {
			pragma: "React.createElement", // default pragma is React.createElement
			useBuiltIns: true
		}]]
	}).code || '';

	return jsxCode.trim();
};

module.exports = exports["default"];