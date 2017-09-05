"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _weakMap = require("babel-runtime/core-js/weak-map");

var _weakMap2 = _interopRequireDefault(_weakMap);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

exports.default = manageOptions;

var _index = require("../index");

var context = _interopRequireWildcard(_index);

var _plugin = require("./plugin");

var _plugin2 = _interopRequireDefault(_plugin);

var _babelMessages = require("babel-messages");

var messages = _interopRequireWildcard(_babelMessages);

var _defaults = require("lodash/defaults");

var _defaults2 = _interopRequireDefault(_defaults);

var _merge = require("lodash/merge");

var _merge2 = _interopRequireDefault(_merge);

var _removed = require("./removed");

var _removed2 = _interopRequireDefault(_removed);

var _buildConfigChain = require("./build-config-chain");

var _buildConfigChain2 = _interopRequireDefault(_buildConfigChain);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _babelTraverse = require("babel-traverse");

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _clone = require("lodash/clone");

var _clone2 = _interopRequireDefault(_clone);

var _files = require("./loading/files");

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

var optionNames = new _set2.default(["filename", "filenameRelative", "inputSourceMap", "env", "mode", "retainLines", "highlightCode", "suppressDeprecationMessages", "presets", "plugins", "ignore", "only", "code", "metadata", "ast", "extends", "comments", "shouldPrintComment", "wrapPluginVisitorMethod", "compact", "minified", "sourceMaps", "sourceMapTarget", "sourceFileName", "sourceRoot", "babelrc", "sourceType", "auxiliaryCommentBefore", "auxiliaryCommentAfter", "resolveModuleSource", "getModuleId", "moduleRoot", "moduleIds", "moduleId", "passPerPreset",
// Deprecate top level parserOpts
"parserOpts",
// Deprecate top level generatorOpts
"generatorOpts"]);

var ALLOWED_PLUGIN_KEYS = new _set2.default(["name", "manipulateOptions", "pre", "post", "visitor", "inherits"]);

function manageOptions(opts) {
  return new OptionManager().init(opts);
}

var OptionManager = function () {
  function OptionManager() {
    (0, _classCallCheck3.default)(this, OptionManager);

    this.options = createInitialOptions();
    this.passes = [[]];
  }

  (0, _createClass3.default)(OptionManager, [{
    key: "mergeOptions",

    /**
     * This is called when we want to merge the input `opts` into the
     * base options.
     *
     *  - `alias` is used to output pretty traces back to the original source.
     *  - `loc` is used to point to the original config.
     *  - `dirname` is used to resolve plugins relative to it.
     */

    value: function mergeOptions(config, pass) {
      var _this = this;

      var result = loadConfig(config);

      var plugins = result.plugins.map(function (descriptor) {
        return loadPluginDescriptor(descriptor);
      });
      var presets = result.presets.map(function (descriptor) {
        return loadPresetDescriptor(descriptor);
      });

      if (config.options.passPerPreset != null && typeof config.options.passPerPreset !== "boolean") {
        throw new Error(".passPerPreset must be a boolean or undefined");
      }
      var passPerPreset = config.options.passPerPreset;
      pass = pass || this.passes[0];

      // resolve presets
      if (presets.length > 0) {
        var presetPasses = null;
        if (passPerPreset) {
          var _passes;

          presetPasses = presets.map(function () {
            return [];
          });
          // The passes are created in the same order as the preset list, but are inserted before any
          // existing additional passes.
          (_passes = this.passes).splice.apply(_passes, [1, 0].concat((0, _toConsumableArray3.default)(presetPasses)));
        }

        presets.forEach(function (presetConfig, i) {
          _this.mergeOptions(presetConfig, presetPasses ? presetPasses[i] : pass);
        });
      }

      // resolve plugins
      if (plugins.length > 0) {
        var _pass;

        (_pass = pass).unshift.apply(_pass, (0, _toConsumableArray3.default)(plugins));
      }

      (0, _merge2.default)(this.options, result.options);
    }
  }, {
    key: "init",
    value: function init(opts) {
      var configChain = (0, _buildConfigChain2.default)(opts);
      if (!configChain) return null;

      try {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(configChain), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var config = _step.value;

            this.mergeOptions(config);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } catch (e) {
        // There are a few case where thrown errors will try to annotate themselves multiple times, so
        // to keep things simple we just bail out if re-wrapping the message.
        if (!/^\[BABEL\]/.test(e.message)) {
          var filename = typeof opts.filename === "string" ? opts.filename : null;
          e.message = "[BABEL] " + (filename || "unknown") + ": " + e.message;
        }

        throw e;
      }

      opts = this.options;

      // Tack the passes onto the object itself so that, if this object is passed back to Babel a second time,
      // it will be in the right structure to not change behavior.
      opts.plugins = this.passes[0];
      opts.presets = this.passes.slice(1).filter(function (plugins) {
        return plugins.length > 0;
      }).map(function (plugins) {
        return { plugins: plugins };
      });

      if (opts.inputSourceMap) {
        opts.sourceMaps = true;
      }

      if (opts.moduleId) {
        opts.moduleIds = true;
      }

      (0, _defaults2.default)(opts, {
        moduleRoot: opts.sourceRoot
      });

      (0, _defaults2.default)(opts, {
        sourceRoot: opts.moduleRoot
      });

      (0, _defaults2.default)(opts, {
        filenameRelative: opts.filename
      });

      var basenameRelative = _path2.default.basename(opts.filenameRelative);

      (0, _defaults2.default)(opts, {
        sourceFileName: basenameRelative,
        sourceMapTarget: basenameRelative
      });

      return {
        options: opts,
        passes: this.passes
      };
    }
  }]);
  return OptionManager;
}();

/**
 * Load and validate the given config into a set of options, plugins, and presets.
 */
function loadConfig(config) {
  var options = normalizeOptions(config);

  if (config.options.plugins != null && !Array.isArray(config.options.plugins)) {
    throw new Error(".plugins should be an array, null, or undefined");
  }

  var plugins = (config.options.plugins || []).map(function (plugin, index) {
    var _normalizePair = normalizePair(plugin, _files.loadPlugin, config.dirname),
        filepath = _normalizePair.filepath,
        value = _normalizePair.value,
        options = _normalizePair.options;

    return {
      alias: filepath || config.loc + "$" + index,
      loc: filepath || config.loc,
      value: value,
      options: options,
      dirname: config.dirname
    };
  });

  if (config.options.presets != null && !Array.isArray(config.options.presets)) {
    throw new Error(".presets should be an array, null, or undefined");
  }

  var presets = (config.options.presets || []).map(function (preset, index) {
    var _normalizePair2 = normalizePair(preset, _files.loadPreset, config.dirname),
        filepath = _normalizePair2.filepath,
        value = _normalizePair2.value,
        options = _normalizePair2.options;

    return {
      alias: filepath || config.loc + "$" + index,
      loc: filepath || config.loc,
      value: value,
      options: options,
      dirname: config.dirname
    };
  });

  return { options: options, plugins: plugins, presets: presets };
}

/**
 * Load a generic plugin/preset from the given descriptor loaded from the config object.
 */
function loadDescriptor(descriptor, skipOptions) {
  if (typeof descriptor.value !== "function") {
    return { value: descriptor.value, descriptor: descriptor };
  }

  var value = descriptor.value,
      options = descriptor.options;

  var item = void 0;
  try {
    if (skipOptions) {
      item = value(context);
    } else {
      item = value(context, options, { dirname: descriptor.dirname });
    }
  } catch (e) {
    if (descriptor.alias) {
      e.message += " (While processing: " + (0, _stringify2.default)(descriptor.alias) + ")";
    }
    throw e;
  }

  if (!item || (typeof item === "undefined" ? "undefined" : (0, _typeof3.default)(item)) !== "object") {
    throw new Error("Plugin/Preset did not return an object.");
  }

  return { value: item, descriptor: descriptor };
}

/**
 * Instantiate a plugin for the given descriptor, returning the plugin/options pair.
 */
var PLUGIN_CACHE = new _weakMap2.default();
function loadPluginDescriptor(descriptor) {
  if (descriptor.value instanceof _plugin2.default) {
    return [descriptor.value, descriptor.options];
  }

  var result = PLUGIN_CACHE.get(descriptor.value);
  if (!result) {
    result = instantiatePlugin(loadDescriptor(descriptor, true /* skipOptions */));
    PLUGIN_CACHE.set(descriptor.value, result);
  }

  return [result, descriptor.options];
}

function instantiatePlugin(_ref) {
  var pluginObj = _ref.value,
      descriptor = _ref.descriptor;

  (0, _keys2.default)(pluginObj).forEach(function (key) {
    if (!ALLOWED_PLUGIN_KEYS.has(key)) {
      throw new Error(messages.get("pluginInvalidProperty", descriptor.alias, key));
    }
  });
  if (pluginObj.visitor && (pluginObj.visitor.enter || pluginObj.visitor.exit)) {
    throw new Error("Plugins aren't allowed to specify catch-all enter/exit handlers. " + "Please target individual nodes.");
  }

  var plugin = (0, _assign2.default)({}, pluginObj, {
    visitor: (0, _clone2.default)(pluginObj.visitor || {})
  });

  _babelTraverse2.default.explode(plugin.visitor);

  var inheritsDescriptor = void 0;
  var inherits = void 0;
  if (plugin.inherits) {
    inheritsDescriptor = {
      alias: descriptor.loc + "$inherits",
      loc: descriptor.loc,
      value: plugin.inherits,
      options: descriptor.options,
      dirname: descriptor.dirname
    };

    inherits = loadPluginDescriptor(inheritsDescriptor)[0];

    plugin.pre = chain(inherits.pre, plugin.pre);
    plugin.post = chain(inherits.post, plugin.post);
    plugin.manipulateOptions = chain(inherits.manipulateOptions, plugin.manipulateOptions);
    plugin.visitor = _babelTraverse2.default.visitors.merge([inherits.visitor, plugin.visitor]);
  }

  return new _plugin2.default(plugin, descriptor.alias);
}

/**
 * Generate a config object that will act as the root of a new nested config.
 */
function loadPresetDescriptor(descriptor) {
  return {
    type: "preset",
    options: loadDescriptor(descriptor).value,
    alias: descriptor.alias,
    loc: descriptor.loc,
    dirname: descriptor.dirname
  };
}

/**
 * Validate and return the options object for the config.
 */
function normalizeOptions(config) {
  var alias = config.alias || "foreign";
  var type = config.type;

  //
  if ((0, _typeof3.default)(config.options) !== "object" || Array.isArray(config.options)) {
    throw new TypeError("Invalid options type for " + alias);
  }

  //
  var options = (0, _assign2.default)({}, config.options);

  if (type !== "arguments") {
    if (options.filename !== undefined) {
      throw new Error(alias + ".filename is only allowed as a root argument");
    }

    if (options.babelrc !== undefined) {
      throw new Error(alias + ".babelrc is only allowed as a root argument");
    }
  }

  if (type === "preset") {
    if (options.only !== undefined) {
      throw new Error(alias + ".only is not supported in a preset");
    }
    if (options.ignore !== undefined) {
      throw new Error(alias + ".ignore is not supported in a preset");
    }
    if (options.extends !== undefined) {
      throw new Error(alias + ".extends is not supported in a preset");
    }
    if (options.env !== undefined) {
      throw new Error(alias + ".env is not supported in a preset");
    }
  }

  if (options.sourceMap !== undefined) {
    if (options.sourceMaps !== undefined) {
      throw new Error("Both " + alias + ".sourceMap and .sourceMaps have been set");
    }

    options.sourceMaps = options.sourceMap;
    delete options.sourceMap;
  }

  for (var key in options) {
    // check for an unknown option
    if (!optionNames.has(key)) {
      if (_removed2.default[key]) {
        throw new ReferenceError("Using removed Babel 5 option: " + alias + "." + key + " - " + _removed2.default[key].message);
      } else {
        // eslint-disable-next-line max-len
        var unknownOptErr = "Unknown option: " + alias + "." + key + ". Check out http://babeljs.io/docs/usage/options/ for more information about options.";

        throw new ReferenceError(unknownOptErr);
      }
    }
  }

  if (options.parserOpts && typeof options.parserOpts.parser === "string") {
    options.parserOpts = (0, _assign2.default)({}, options.parserOpts);
    options.parserOpts.parser = (0, _files.loadParser)(options.parserOpts.parser, config.dirname).value;
  }

  if (options.generatorOpts && typeof options.generatorOpts.generator === "string") {
    options.generatorOpts = (0, _assign2.default)({}, options.generatorOpts);
    options.generatorOpts.generator = (0, _files.loadGenerator)(options.generatorOpts.generator, config.dirname).value;
  }

  delete options.passPerPreset;
  delete options.plugins;
  delete options.presets;

  return options;
}

/**
 * Given a plugin/preset item, resolve it into a standard format.
 */
function normalizePair(pair, resolver, dirname) {
  var options = void 0;
  var value = pair;
  if (Array.isArray(pair)) {
    if (pair.length > 2) {
      throw new Error("Unexpected extra options " + (0, _stringify2.default)(pair.slice(2)) + ".");
    }

    var _pair = (0, _slicedToArray3.default)(pair, 2);

    value = _pair[0];
    options = _pair[1];
  }

  var filepath = null;
  if (typeof value === "string") {
    var _resolver = resolver(value, dirname);

    filepath = _resolver.filepath;
    value = _resolver.value;
  }

  if (!value) {
    throw new Error("Unexpected falsy value: " + String(value));
  }

  if ((typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value)) === "object" && value.__esModule) {
    if (value.default) {
      value = value.default;
    } else {
      throw new Error("Must export a default export when using ES6 modules.");
    }
  }

  if ((typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value)) !== "object" && typeof value !== "function") {
    throw new Error("Unsupported format: " + (typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value)) + ". Expected an object or a function.");
  }

  if (options != null && (typeof options === "undefined" ? "undefined" : (0, _typeof3.default)(options)) !== "object") {
    throw new Error("Plugin/Preset options must be an object, null, or undefined");
  }

  return { filepath: filepath, value: value, options: options };
}

function chain(a, b) {
  var fns = [a, b].filter(Boolean);
  if (fns.length <= 1) return fns[0];

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(fns), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var fn = _step2.value;

        fn.apply(this, args);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };
}

function createInitialOptions() {
  return {
    sourceType: "module",
    babelrc: true,
    filename: "unknown",
    code: true,
    metadata: true,
    ast: true,
    comments: true,
    compact: "auto",
    highlightCode: true
  };
}
module.exports = exports["default"];