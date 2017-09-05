"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Plugin = function Plugin(plugin, key) {
  (0, _classCallCheck3.default)(this, Plugin);

  if (plugin.name != null && typeof plugin.name !== "string") {
    throw new Error("Plugin .name must be a string, null, or undefined");
  }
  if (plugin.manipulateOptions != null && typeof plugin.manipulateOptions !== "function") {
    throw new Error("Plugin .manipulateOptions must be a function, null, or undefined");
  }
  if (plugin.post != null && typeof plugin.post !== "function") {
    throw new Error("Plugin .post must be a function, null, or undefined");
  }
  if (plugin.pre != null && typeof plugin.pre !== "function") {
    throw new Error("Plugin .pre must be a function, null, or undefined");
  }
  if (plugin.visitor != null && (0, _typeof3.default)(plugin.visitor) !== "object") {
    throw new Error("Plugin .visitor must be an object, null, or undefined");
  }

  this.key = plugin.name || key;

  this.manipulateOptions = plugin.manipulateOptions;
  this.post = plugin.post;
  this.pre = plugin.pre;
  this.visitor = plugin.visitor;
};

exports.default = Plugin;
module.exports = exports["default"];