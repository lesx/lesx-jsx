"use strict";

const _Object$defineProperty = require("babel-runtime/core-js/object/define-property").default;
const _Object$keys = require("babel-runtime/core-js/object/keys").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _configuration = require("./configuration");

_Object$keys(_configuration).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _configuration[key];
    }
  });
});

var _plugins = require("./plugins");

_Object$keys(_plugins).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _plugins[key];
    }
  });
});

// Kind of gross, but essentially asserting that the exports of this module are the same as the
// exports of index-browser, since this file may be replaced at bundle time with index-browser.
({});
