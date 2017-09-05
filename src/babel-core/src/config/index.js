"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = loadConfig;

var _optionManager = require("./option-manager");

var _optionManager2 = _interopRequireDefault(_optionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Standard API for loading Babel configuration data. Not for public consumption.
 */
function loadConfig(opts) {
  if (opts != null && (typeof opts === "undefined" ? "undefined" : (0, _typeof3.default)(opts)) !== "object") {
    throw new Error("Babel options must be an object, null, or undefined");
  }

  return (0, _optionManager2.default)(opts || {});
}
module.exports = exports["default"];