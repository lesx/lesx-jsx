"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _require = require("babel-core"),
    transform = _require.transform;

exports.default = function (code) {
	return transform(code, {
		plugins: ["jsx-control-statements", ["transform-react-jsx", {
			pragma: "React.createElement", // default pragma is React.createElement
			useBuiltIns: true
		}]]
	}).code;
};

module.exports = exports["default"];