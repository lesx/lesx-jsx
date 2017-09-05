"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvePlugin = resolvePlugin;
exports.resolvePreset = resolvePreset;
exports.loadPlugin = loadPlugin;
exports.loadPreset = loadPreset;
exports.loadParser = loadParser;
exports.loadGenerator = loadGenerator;

var _resolve = require("resolve");

var _resolve2 = _interopRequireDefault(_resolve);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This file handles all logic for converting string-based configuration references into loaded objects.
 */

var EXACT_RE = /^module:/;
var BABEL_PLUGIN_PREFIX_RE = /^(?!@|module:|[^/\/]+[/\/]|babel-plugin-)/;
var BABEL_PRESET_PREFIX_RE = /^(?!@|module:|[^/\/]+[/\/]|babel-preset-)/;
var BABEL_PLUGIN_ORG_RE = /^(@babel[/\/])(?!plugin-|[^/\/]+[/\/])/;
var BABEL_PRESET_ORG_RE = /^(@babel[/\/])(?!preset-|[^/\/]+[/\/])/;
var OTHER_PLUGIN_ORG_RE = /^(@(?!babel[/\/])[^/\/]+[/\/])(?!babel-plugin-|[^/\/]+[/\/])/;
var OTHER_PRESET_ORG_RE = /^(@(?!babel[/\/])[^/\/]+[/\/])(?!babel-preset-|[^/\/]+[/\/])/;

function resolvePlugin(name, dirname) {
  return resolveStandardizedName("plugin", name, dirname);
}

function resolvePreset(name, dirname) {
  return resolveStandardizedName("preset", name, dirname);
}

function loadPlugin(name, dirname) {
  var filepath = resolvePlugin(name, dirname);
  if (!filepath) {
    throw new Error("Plugin " + name + " not found relative to " + dirname);
  }

  return {
    filepath: filepath,
    value: requireModule(filepath)
  };
}

function loadPreset(name, dirname) {
  var filepath = resolvePreset(name, dirname);
  if (!filepath) {
    throw new Error("Preset " + name + " not found relative to " + dirname);
  }

  return {
    filepath: filepath,
    value: requireModule(filepath)
  };
}

function loadParser(name, dirname) {
  var filepath = _resolve2.default.sync(name, { basedir: dirname });

  var mod = requireModule(filepath);

  if (!mod) {
    throw new Error("Parser " + name + " relative to " + dirname + " does not export an object");
  }
  if (typeof mod.parse !== "function") {
    throw new Error("Parser " + name + " relative to " + dirname + " does not export a .parse function");
  }

  return {
    filepath: filepath,
    value: mod.parse
  };
}

function loadGenerator(name, dirname) {
  var filepath = _resolve2.default.sync(name, { basedir: dirname });

  var mod = requireModule(filepath);

  if (!mod) {
    throw new Error("Generator " + name + " relative to " + dirname + " does not export an object");
  }
  if (typeof mod.print !== "function") {
    throw new Error("Generator " + name + " relative to " + dirname + " does not export a .print function");
  }

  return {
    filepath: filepath,
    value: mod.print
  };
}

function standardizeName(type, name) {
  // Let absolute and relative paths through.
  if (_path2.default.isAbsolute(name)) return name;

  var isPreset = type === "preset";

  return name
  // foo -> babel-preset-foo
  .replace(isPreset ? BABEL_PRESET_PREFIX_RE : BABEL_PLUGIN_PREFIX_RE, "babel-" + type + "-")
  // @babel/es2015 -> @babel/preset-es2015
  .replace(isPreset ? BABEL_PRESET_ORG_RE : BABEL_PLUGIN_ORG_RE, "$1" + type + "-")
  // @foo/mypreset -> @foo/babel-preset-mypreset
  .replace(isPreset ? OTHER_PRESET_ORG_RE : OTHER_PLUGIN_ORG_RE, "$1babel-" + type + "-")
  // module:mypreset -> mypreset
  .replace(EXACT_RE, "");
}

function resolveStandardizedName(type, name) {
  var dirname = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : process.cwd();

  var standardizedName = standardizeName(type, name);

  try {
    return _resolve2.default.sync(standardizedName, { basedir: dirname });
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") throw e;

    if (standardizedName !== name) {
      var resolvedOriginal = false;
      try {
        _resolve2.default.sync(name, { basedir: dirname });
        resolvedOriginal = true;
      } catch (e2) {}

      if (resolvedOriginal) {
        // eslint-disable-next-line max-len
        e.message += "\n- If you want to resolve \"" + name + "\", use \"module:" + name + "\"";
      }
    }

    var resolvedBabel = false;
    try {
      _resolve2.default.sync(standardizeName(type, "@babel/" + name), {
        basedir: dirname
      });
      resolvedBabel = true;
    } catch (e2) {}

    if (resolvedBabel) {
      // eslint-disable-next-line max-len
      e.message += "\n- Did you mean \"@babel/" + name + "\"?";
    }

    var resolvedOppositeType = false;
    var oppositeType = type === "preset" ? "plugin" : "preset";
    try {
      _resolve2.default.sync(standardizeName(oppositeType, name), { basedir: dirname });
      resolvedOppositeType = true;
    } catch (e2) {}

    if (resolvedOppositeType) {
      // eslint-disable-next-line max-len
      e.message += "\n- Did you accidentally pass a " + type + " as a " + oppositeType + "?";
    }

    throw e;
  }
}

function requireModule(name) {
  // $FlowIssue
  return require(name);
}