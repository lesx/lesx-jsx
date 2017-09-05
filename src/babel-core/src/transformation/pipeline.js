"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyse = analyse;
exports.transform = transform;
exports.transformFromAst = transformFromAst;
exports.transformFile = transformFile;
exports.transformFileSync = transformFileSync;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

var _file = require("./file");

var _file2 = _interopRequireDefault(_file);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global BabelFileResult, BabelFileMetadata */
function analyse(code) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var visitor = arguments[2];

  opts.code = false;
  if (visitor) {
    opts.plugins = opts.plugins || [];
    opts.plugins.push({ visitor: visitor });
  }
  return transform(code, opts).metadata;
}

function transform(code, opts) {
  var config = (0, _config2.default)(opts);
  if (config === null) return null;

  var file = new _file2.default(config);
  return file.wrap(code, function () {
    file.addCode(code);
    file.parseCode(code);
    return file.transform();
  });
}

function transformFromAst(ast, code, opts) {
  var config = (0, _config2.default)(opts);
  if (config === null) return null;

  if (ast && ast.type === "Program") {
    ast = t.file(ast, [], []);
  } else if (!ast || ast.type !== "File") {
    throw new Error("Not a valid ast?");
  }

  var file = new _file2.default(config);
  return file.wrap(code, function () {
    file.addCode(code);
    file.addAst(ast);
    return file.transform();
  });
}

function transformFile(filename, opts, callback) {
  if (typeof opts === "function") {
    callback = opts;
    opts = {};
  }

  opts.filename = filename;
  var config = (0, _config2.default)(opts);
  if (config === null) return callback(null, null);

  _fs2.default.readFile(filename, function (err, code) {
    var result = void 0;

    if (!err) {
      try {
        var file = new _file2.default(config);
        result = file.wrap(code, function () {
          file.addCode(code);
          file.parseCode(code);
          return file.transform();
        });
      } catch (_err) {
        err = _err;
      }
    }

    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}

function transformFileSync(filename) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  opts.filename = filename;
  var config = (0, _config2.default)(opts);
  if (config === null) return null;

  var code = _fs2.default.readFileSync(filename, "utf8");
  var file = new _file2.default(config);

  return file.wrap(code, function () {
    file.addCode(code);
    file.parseCode(code);
    return file.transform();
  });
}