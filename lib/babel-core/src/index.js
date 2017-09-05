"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_EXTENSIONS = exports.transformFileSync = exports.transformFile = exports.transformFromAst = exports.analyse = exports.transform = exports.OptionManager = exports.template = exports.traverse = exports.types = exports.messages = exports.getEnv = exports.version = exports.resolvePreset = exports.resolvePlugin = exports.buildExternalHelpers = exports.File = undefined;

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _files = require("./config/loading/files");

Object.defineProperty(exports, "resolvePlugin", {
  enumerable: true,
  get: function get() {
    return _files.resolvePlugin;
  }
});
Object.defineProperty(exports, "resolvePreset", {
  enumerable: true,
  get: function get() {
    return _files.resolvePreset;
  }
});

// var _package = require("../package");

Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function get() {
    return '6.26.0';
  }
});

var _environment = require("./config/helpers/environment");

Object.defineProperty(exports, "getEnv", {
  enumerable: true,
  get: function get() {
    return _environment.getEnv;
  }
});
exports.loadOptions = loadOptions;
exports.Plugin = Plugin;

var _pipeline = require("./transformation/pipeline");

Object.defineProperty(exports, "transform", {
  enumerable: true,
  get: function get() {
    return _pipeline.transform;
  }
});
Object.defineProperty(exports, "analyse", {
  enumerable: true,
  get: function get() {
    return _pipeline.analyse;
  }
});
Object.defineProperty(exports, "transformFromAst", {
  enumerable: true,
  get: function get() {
    return _pipeline.transformFromAst;
  }
});
Object.defineProperty(exports, "transformFile", {
  enumerable: true,
  get: function get() {
    return _pipeline.transformFile;
  }
});
Object.defineProperty(exports, "transformFileSync", {
  enumerable: true,
  get: function get() {
    return _pipeline.transformFileSync;
  }
});

var _file = require("./transformation/file");

var _file2 = _interopRequireDefault(_file);

var _buildExternalHelpers2 = require("./tools/build-external-helpers");

var _buildExternalHelpers3 = _interopRequireDefault(_buildExternalHelpers2);

var _babelMessages = require("babel-messages");

var _messages = _interopRequireWildcard(_babelMessages);

var _babelTypes = require("babel-types");

var _types = _interopRequireWildcard(_babelTypes);

var _babelTraverse = require("babel-traverse");

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _babelTemplate = require("babel-template");

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.File = _file2.default;
exports.buildExternalHelpers = _buildExternalHelpers3.default;
exports.messages = _messages;
exports.types = _types;
exports.traverse = _babelTraverse2.default;
exports.template = _babelTemplate2.default;
function loadOptions(opts) {
  var config = (0, _config2.default)(opts);

  return config ? config.options : null;
}

// For easier backward-compatibility, provide an API like the one we exposed in Babel 6.

var OptionManager = exports.OptionManager = function () {
  function OptionManager() {
    (0, _classCallCheck3.default)(this, OptionManager);
  }

  (0, _createClass3.default)(OptionManager, [{
    key: "init",
    value: function init(opts) {
      return loadOptions(opts);
    }
  }]);
  return OptionManager;
}();

function Plugin(alias) {
  throw new Error("The (" + alias + ") Babel 5 plugin is being run with Babel 6.");
}

/**
 * Recommended set of compilable extensions. Not used in babel-core directly, but meant as
 * as an easy source for tooling making use of babel-core.
 */
var DEFAULT_EXTENSIONS = exports.DEFAULT_EXTENSIONS = (0, _freeze2.default)([".js", ".jsx", ".es6", ".es", ".mjs"]);