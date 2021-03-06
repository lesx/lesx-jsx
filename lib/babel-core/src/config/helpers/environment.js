"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnv = getEnv;
function getEnv() {
  var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "development";

  return process.env.BABEL_ENV || process.env.NODE_ENV || defaultValue;
}