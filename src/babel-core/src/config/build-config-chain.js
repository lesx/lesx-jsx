"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = buildConfigChain;

var _environment = require("./helpers/environment");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _micromatch = require("micromatch");

var _micromatch2 = _interopRequireDefault(_micromatch);

var _files = require("./loading/files");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildConfigChain(opts) {
  if (typeof opts.filename !== "string" && opts.filename != null) {
    throw new Error(".filename must be a string, null, or undefined");
  }

  var filename = opts.filename ? _path2.default.resolve(opts.filename) : null;
  var builder = new ConfigChainBuilder(filename);

  try {
    builder.mergeConfig({
      type: "arguments",
      options: opts,
      alias: "base",
      dirname: process.cwd()
    });

    // resolve all .babelrc files
    if (opts.babelrc !== false && filename) {
      builder.findConfigs(filename);
    }
  } catch (e) {
    if (e.code !== "BABEL_IGNORED_FILE") throw e;

    return null;
  }

  return builder.configs.reverse();
}

var ConfigChainBuilder = function () {
  function ConfigChainBuilder(filename) {
    (0, _classCallCheck3.default)(this, ConfigChainBuilder);

    this.configs = [];
    this.filename = filename;
    this.possibleDirs = null;
  }

  /**
   * Tests if a filename should be ignored based on "ignore" and "only" options.
   */


  (0, _createClass3.default)(ConfigChainBuilder, [{
    key: "shouldIgnore",
    value: function shouldIgnore(ignore, only, dirname) {
      if (!this.filename) return false;

      if (ignore) {
        if (!Array.isArray(ignore)) {
          throw new Error(".ignore should be an array, " + (0, _stringify2.default)(ignore) + " given");
        }

        if (this.matchesPatterns(ignore, dirname)) return true;
      }

      if (only) {
        if (!Array.isArray(only)) {
          throw new Error(".only should be an array, " + (0, _stringify2.default)(only) + " given");
        }

        if (!this.matchesPatterns(only, dirname)) return true;
      }

      return false;
    }

    /**
     * Returns result of calling function with filename if pattern is a function.
     * Otherwise returns result of matching pattern Regex with filename.
     */

  }, {
    key: "matchesPatterns",
    value: function matchesPatterns(patterns, dirname) {
      var filename = this.filename;
      if (!filename) {
        throw new Error("Assertion failure: .filename should always exist here");
      }

      var res = [];
      var strings = [];
      var fns = [];

      patterns.forEach(function (pattern) {
        if (typeof pattern === "string") strings.push(pattern);else if (typeof pattern === "function") fns.push(pattern);else if (pattern instanceof RegExp) res.push(pattern);else {
          throw new Error("Patterns must be a string, function, or regular expression");
        }
      });

      if (res.some(function (re) {
        return re.test(filename);
      })) return true;
      if (fns.some(function (fn) {
        return fn(filename);
      })) return true;

      if (strings.length > 0) {
        var possibleDirs = this.possibleDirs;
        // Lazy-init so we don't initialize this for files that have no glob patterns.
        if (!possibleDirs) {
          possibleDirs = this.possibleDirs = [];

          possibleDirs.push(filename);

          var current = filename;
          while (true) {
            var previous = current;
            current = _path2.default.dirname(current);
            if (previous === current) break;

            possibleDirs.push(current);
          }
        }

        var absolutePatterns = strings.map(function (pattern) {
          // Preserve the "!" prefix so that micromatch can use it for negation.
          var negate = pattern[0] === "!";
          if (negate) pattern = pattern.slice(1);

          return (negate ? "!" : "") + _path2.default.resolve(dirname, pattern);
        });

        if ((0, _micromatch2.default)(possibleDirs, absolutePatterns, { nocase: true }).length > 0) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "findConfigs",
    value: function findConfigs(loc) {
      var _this = this;

      (0, _files.findConfigs)(_path2.default.dirname(loc)).forEach(function (_ref) {
        var filepath = _ref.filepath,
            dirname = _ref.dirname,
            options = _ref.options;

        _this.mergeConfig({
          type: "options",
          options: options,
          alias: filepath,
          dirname: dirname
        });
      });
    }
  }, {
    key: "mergeConfig",
    value: function mergeConfig(_ref2) {
      var type = _ref2.type,
          rawOpts = _ref2.options,
          alias = _ref2.alias,
          dirname = _ref2.dirname;

      // Bail out ASAP if this file is ignored so that we run as little logic as possible on ignored files.
      if (this.filename && this.shouldIgnore(rawOpts.ignore || null, rawOpts.only || null, dirname)) {
        // TODO(logan): This is a really cross way to bail out. Avoid this in rewrite.
        throw (0, _assign2.default)(new Error("This file has been ignored."), {
          code: "BABEL_IGNORED_FILE"
        });
      }

      var options = (0, _assign2.default)({}, rawOpts);
      delete options.env;
      delete options.extends;

      var envKey = (0, _environment.getEnv)();

      if (rawOpts.env != null && ((0, _typeof3.default)(rawOpts.env) !== "object" || Array.isArray(rawOpts.env))) {
        throw new Error(".env block must be an object, null, or undefined");
      }

      var envOpts = rawOpts.env && rawOpts.env[envKey];

      if (envOpts != null && ((typeof envOpts === "undefined" ? "undefined" : (0, _typeof3.default)(envOpts)) !== "object" || Array.isArray(envOpts))) {
        throw new Error(".env[...] block must be an object, null, or undefined");
      }

      if (envOpts) {
        this.mergeConfig({
          type: type,
          options: envOpts,
          alias: alias + ".env." + envKey,
          dirname: dirname
        });
      }

      this.configs.push({
        type: type,
        options: options,
        alias: alias,
        loc: alias,
        dirname: dirname
      });

      if (rawOpts.extends) {
        if (typeof rawOpts.extends !== "string") {
          throw new Error(".extends must be a string");
        }

        var extendsConfig = (0, _files.loadConfig)(rawOpts.extends, dirname);

        var existingConfig = this.configs.some(function (config) {
          return config.alias === extendsConfig.filepath;
        });
        if (!existingConfig) {
          this.mergeConfig({
            type: "options",
            alias: extendsConfig.filepath,
            options: extendsConfig.options,
            dirname: extendsConfig.dirname
          });
        }
      }
    }
  }]);
  return ConfigChainBuilder;
}();

module.exports = exports["default"];