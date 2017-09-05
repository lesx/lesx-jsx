"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.File = undefined;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

exports.debug = debug;

var _babelHelpers = require("babel-helpers");

var _babelHelpers2 = _interopRequireDefault(_babelHelpers);

var _metadata = require("./metadata");

var metadataVisitor = _interopRequireWildcard(_metadata);

var _convertSourceMap = require("convert-source-map");

var _convertSourceMap2 = _interopRequireDefault(_convertSourceMap);

var _pluginPass = require("../plugin-pass");

var _pluginPass2 = _interopRequireDefault(_pluginPass);

var _babelTraverse = require("babel-traverse");

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _sourceMap = require("source-map");

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _babelGenerator = require("babel-generator");

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var _babelCodeFrame = require("babel-code-frame");

var _store = require("../store");

var _store2 = _interopRequireDefault(_store);

var _lesxParser = require("lesx-parser").babylon;

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _config = require("../../config");

var _config2 = _interopRequireDefault(_config);

var _blockHoist = require("../internal-plugins/block-hoist");

var _blockHoist2 = _interopRequireDefault(_blockHoist);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelDebug = (0, _debug2.default)("babel:file"); /* global BabelFileResult, BabelParserOptions, BabelFileMetadata */

function debug(opts, msg) {
  babelDebug((opts.filename || "unknown") + ": " + msg);
}

var shebangRegex = /^#!.*/;

var INTERNAL_PLUGINS = void 0;

var errorVisitor = {
  enter: function enter(path, state) {
    var loc = path.node.loc;
    if (loc) {
      state.loc = loc;
      path.stop();
    }
  }
};

var File = function (_Store) {
  (0, _inherits3.default)(File, _Store);

  function File(_ref) {
    var options = _ref.options,
        passes = _ref.passes;
    (0, _classCallCheck3.default)(this, File);

    if (!INTERNAL_PLUGINS) {
      // Lazy-init the internal plugin to remove the init-time circular dependency between plugins being
      // passed babel-core's export object, which loads this file, and this 'loadConfig' loading plugins.
      INTERNAL_PLUGINS = (0, _config2.default)({
        babelrc: false,
        plugins: [_blockHoist2.default]
      }).passes[0];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (File.__proto__ || (0, _getPrototypeOf2.default)(File)).call(this));

    _this.pluginPasses = passes;
    _this.opts = options;

    _this.parserOpts = {
      sourceType: _this.opts.sourceType,
      sourceFileName: _this.opts.filename,
      plugins: []
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(passes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var pluginPairs = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (0, _getIterator3.default)(pluginPairs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = (0, _slicedToArray3.default)(_step2.value, 1),
                plugin = _step2$value[0];

            if (plugin.manipulateOptions) {
              plugin.manipulateOptions(_this.opts, _this.parserOpts, _this);
            }
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

    _this.metadata = {
      usedHelpers: [],
      marked: [],
      modules: {
        imports: [],
        exports: {
          exported: [],
          specifiers: []
        }
      }
    };

    _this.dynamicImportTypes = {};
    _this.dynamicImportIds = {};
    _this.dynamicImports = [];
    _this.declarations = {};
    _this.usedHelpers = {};

    _this.path = null;
    _this.ast = {};

    _this.code = "";
    _this.shebang = "";

    _this.hub = new _babelTraverse.Hub(_this);
    return _this;
  }

  (0, _createClass3.default)(File, [{
    key: "getMetadata",
    value: function getMetadata() {
      var has = false;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(this.ast.program.body), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var node = _step3.value;

          if (t.isModuleDeclaration(node)) {
            has = true;
            break;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (has) {
        this.path.traverse(metadataVisitor, this);
      }
    }
  }, {
    key: "getModuleName",
    value: function getModuleName() {
      var opts = this.opts;
      if (!opts.moduleIds) {
        return null;
      }

      // moduleId is n/a if a `getModuleId()` is provided
      if (opts.moduleId != null && !opts.getModuleId) {
        return opts.moduleId;
      }

      var filenameRelative = opts.filenameRelative;
      var moduleName = "";

      if (opts.moduleRoot != null) {
        moduleName = opts.moduleRoot + "/";
      }

      if (!opts.filenameRelative) {
        return moduleName + opts.filename.replace(/^\//, "");
      }

      if (opts.sourceRoot != null) {
        // remove sourceRoot from filename
        var sourceRootRegEx = new RegExp("^" + opts.sourceRoot + "/?");
        filenameRelative = filenameRelative.replace(sourceRootRegEx, "");
      }

      // remove extension
      filenameRelative = filenameRelative.replace(/\.(\w*?)$/, "");

      moduleName += filenameRelative;

      // normalize path separators
      moduleName = moduleName.replace(/\\/g, "/");

      if (opts.getModuleId) {
        // If return is falsy, assume they want us to use our generated default name
        return opts.getModuleId(moduleName) || moduleName;
      } else {
        return moduleName;
      }
    }
  }, {
    key: "resolveModuleSource",
    value: function resolveModuleSource(source) {
      var resolveModuleSource = this.opts.resolveModuleSource;
      if (resolveModuleSource) {
        source = resolveModuleSource(source, this.opts.filename);
      }
      return source;
    }
  }, {
    key: "addImport",
    value: function addImport(source) {
      var _this2 = this;

      var imported = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : imported;

      var prependDeclaration = function prependDeclaration(specifiers) {
        var declar = t.importDeclaration(specifiers, t.stringLiteral(source));
        declar._blockHoist = 3;

        _this2.path.unshiftContainer("body", declar);
      };

      // import "module-name";
      if (!imported) {
        prependDeclaration([]);
        return null;
      }

      var alias = source + ":" + imported;
      var id = this.dynamicImportIds[alias];

      if (!id) {
        source = this.resolveModuleSource(source);
        id = this.dynamicImportIds[alias] = this.scope.generateUidIdentifier(name);

        var specifiers = [];

        if (imported === "*") {
          specifiers.push(t.importNamespaceSpecifier(id));
        } else if (imported === "default") {
          specifiers.push(t.importDefaultSpecifier(id));
        } else {
          specifiers.push(t.importSpecifier(id, t.identifier(imported)));
        }

        prependDeclaration(specifiers);
      }

      return id;
    }
  }, {
    key: "addHelper",
    value: function addHelper(name) {
      var declar = this.declarations[name];
      if (declar) return declar;

      if (!this.usedHelpers[name]) {
        this.metadata.usedHelpers.push(name);
        this.usedHelpers[name] = true;
      }

      var generator = this.get("helperGenerator");
      var runtime = this.get("helpersNamespace");
      if (generator) {
        var res = generator(name);
        if (res) return res;
      } else if (runtime) {
        return t.memberExpression(runtime, t.identifier(name));
      }

      var ref = (0, _babelHelpers2.default)(name);
      var uid = this.declarations[name] = this.scope.generateUidIdentifier(name);

      if (t.isFunctionExpression(ref) && !ref.id) {
        ref.body._compact = true;
        ref.id = uid;
        ref.type = "FunctionDeclaration";
        this.path.unshiftContainer("body", ref);
      } else {
        ref._compact = true;
        this.scope.push({
          id: uid,
          init: ref,
          unique: true
        });
      }

      return uid;
    }
  }, {
    key: "addTemplateObject",
    value: function addTemplateObject(helperName, strings, raw) {
      // Generate a unique name based on the string literals so we dedupe
      // identical strings used in the program.
      var stringIds = raw.elements.map(function (string) {
        return string.value;
      });
      var name = helperName + "_" + raw.elements.length + "_" + stringIds.join(",");

      var declar = this.declarations[name];
      if (declar) return declar;

      var uid = this.declarations[name] = this.scope.generateUidIdentifier("templateObject");

      var helperId = this.addHelper(helperName);
      var init = t.callExpression(helperId, [strings, raw]);
      init._compact = true;
      this.scope.push({
        id: uid,
        init: init,
        _blockHoist: 1.9 // This ensures that we don't fail if not using function expression helpers
      });
      return uid;
    }
  }, {
    key: "buildCodeFrameError",
    value: function buildCodeFrameError(node, msg) {
      var Error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : SyntaxError;

      var loc = node && (node.loc || node._loc);

      var err = new Error(msg);

      if (loc) {
        err.loc = loc.start;
      } else {
        (0, _babelTraverse2.default)(node, errorVisitor, this.scope, err);

        err.message += " (This is an error on an internal node. Probably an internal error";

        if (err.loc) {
          err.message += ". Location has been estimated.";
        }

        err.message += ")";
      }

      return err;
    }
  }, {
    key: "mergeSourceMap",
    value: function mergeSourceMap(map) {
      var inputMap = this.opts.inputSourceMap;

      if (inputMap) {
        var inputMapConsumer = new _sourceMap2.default.SourceMapConsumer(inputMap);
        var outputMapConsumer = new _sourceMap2.default.SourceMapConsumer(map);

        var mergedGenerator = new _sourceMap2.default.SourceMapGenerator({
          file: inputMapConsumer.file,
          sourceRoot: inputMapConsumer.sourceRoot
        });

        // This assumes the output map always has a single source, since Babel always compiles a
        // single source file to a single output file.
        var source = outputMapConsumer.sources[0];

        inputMapConsumer.eachMapping(function (mapping) {
          var generatedPosition = outputMapConsumer.generatedPositionFor({
            line: mapping.generatedLine,
            column: mapping.generatedColumn,
            source: source
          });
          if (generatedPosition.column != null) {
            mergedGenerator.addMapping({
              source: mapping.source,

              original: mapping.source == null ? null : {
                line: mapping.originalLine,
                column: mapping.originalColumn
              },

              generated: generatedPosition
            });
          }
        });

        var mergedMap = mergedGenerator.toJSON();
        inputMap.mappings = mergedMap.mappings;
        return inputMap;
      } else {
        return map;
      }
    }
  }, {
    key: "parse",
    value: function parse(code) {
      var parseCode = _lesxParser.parse;
      var parserOpts = this.opts.parserOpts;

      if (parserOpts) {
        parserOpts = (0, _assign2.default)({}, this.parserOpts, parserOpts);

        if (parserOpts.parser) {
          parseCode = parserOpts.parser;

          parserOpts.parser = {
            parse: function parse(source) {
              return (0, _lesxParser.parse)(source, parserOpts);
            }
          };
        }
      }

      debug(this.opts, "Parse start");
      var ast = parseCode(code, parserOpts || this.parserOpts);
      debug(this.opts, "Parse stop");
      return ast;
    }
  }, {
    key: "_addAst",
    value: function _addAst(ast) {
      this.path = _babelTraverse.NodePath.get({
        hub: this.hub,
        parentPath: null,
        parent: ast,
        container: ast,
        key: "program"
      }).setContext();
      this.scope = this.path.scope;
      this.ast = ast;
      this.getMetadata();
    }
  }, {
    key: "addAst",
    value: function addAst(ast) {
      debug(this.opts, "Start set AST");
      this._addAst(ast);
      debug(this.opts, "End set AST");
    }
  }, {
    key: "transform",
    value: function transform() {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(this.pluginPasses), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var pluginPairs = _step4.value;

          var passPairs = [];
          var passes = [];
          var visitors = [];

          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = (0, _getIterator3.default)(pluginPairs.concat(INTERNAL_PLUGINS)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var _step5$value = (0, _slicedToArray3.default)(_step5.value, 2),
                  plugin = _step5$value[0],
                  pluginOpts = _step5$value[1];

              var pass = new _pluginPass2.default(this, plugin.key, pluginOpts);

              passPairs.push([plugin, pass]);
              passes.push(pass);
              visitors.push(plugin.visitor);
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = (0, _getIterator3.default)(passPairs), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var _step6$value = (0, _slicedToArray3.default)(_step6.value, 2),
                  plugin = _step6$value[0],
                  _pass = _step6$value[1];

              var fn = plugin.pre;
              if (fn) fn.call(_pass, this);
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          debug(this.opts, "Start transform traverse");

          // merge all plugin visitors into a single visitor
          var visitor = _babelTraverse2.default.visitors.merge(visitors, passes, this.opts.wrapPluginVisitorMethod);
          (0, _babelTraverse2.default)(this.ast, visitor, this.scope);

          debug(this.opts, "End transform traverse");

          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = (0, _getIterator3.default)(passPairs), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var _step7$value = (0, _slicedToArray3.default)(_step7.value, 2),
                  plugin = _step7$value[0],
                  _pass2 = _step7$value[1];

              var _fn = plugin.post;
              if (_fn) _fn.call(_pass2, this);
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return this.generate();
    }
  }, {
    key: "wrap",
    value: function wrap(code, callback) {
      code = code + "";

      try {
        return callback();
      } catch (err) {
        if (err._babel) {
          throw err;
        } else {
          err._babel = true;
        }

        var message = err.message = this.opts.filename + ": " + err.message;

        var loc = err.loc;
        if (loc) {
          var location = {
            start: {
              line: loc.line,
              column: loc.column + 1
            }
          };
          err.codeFrame = (0, _babelCodeFrame.codeFrameColumns)(code, location, this.opts);
          message += "\n" + err.codeFrame;
        }

        if (process.browser) {
          // chrome has it's own pretty stringifier which doesn't use the stack property
          // https://github.com/babel/babel/issues/2175
          err.message = message;
        }

        if (err.stack) {
          var newStack = err.stack.replace(err.message, message);
          err.stack = newStack;
        }

        throw err;
      }
    }
  }, {
    key: "addCode",
    value: function addCode(code) {
      code = (code || "") + "";
      code = this.parseInputSourceMap(code);
      this.code = code;
    }
  }, {
    key: "parseCode",
    value: function parseCode() {
      this.parseShebang();
      var ast = this.parse(this.code);
      this.addAst(ast);
    }
  }, {
    key: "parseInputSourceMap",
    value: function parseInputSourceMap(code) {
      var opts = this.opts;

      if (opts.inputSourceMap !== false) {
        var inputMap = _convertSourceMap2.default.fromSource(code);
        if (inputMap) {
          opts.inputSourceMap = inputMap.toObject();
          code = _convertSourceMap2.default.removeComments(code);
        }
      }

      return code;
    }
  }, {
    key: "parseShebang",
    value: function parseShebang() {
      var shebangMatch = shebangRegex.exec(this.code);
      if (shebangMatch) {
        this.shebang = shebangMatch[0];
        this.code = this.code.replace(shebangRegex, "");
      }
    }
  }, {
    key: "makeResult",
    value: function makeResult(_ref2) {
      var code = _ref2.code,
          map = _ref2.map,
          ast = _ref2.ast,
          ignored = _ref2.ignored;

      var result = {
        metadata: null,
        options: this.opts,
        ignored: !!ignored,
        code: null,
        ast: null,
        map: map || null
      };

      if (this.opts.code) {
        result.code = code;
      }

      if (this.opts.ast) {
        result.ast = ast;
      }

      if (this.opts.metadata) {
        result.metadata = this.metadata;
      }

      return result;
    }
  }, {
    key: "generate",
    value: function generate() {
      var opts = this.opts;
      var ast = this.ast;

      var result = { ast: ast };
      if (!opts.code) return this.makeResult(result);

      var gen = _babelGenerator2.default;
      if (opts.generatorOpts && opts.generatorOpts.generator) {
        gen = opts.generatorOpts.generator;
      }

      debug(this.opts, "Generation start");

      var _result = gen(ast, opts.generatorOpts ? (0, _assign2.default)(opts, opts.generatorOpts) : opts, this.code);
      result.code = _result.code;
      result.map = _result.map;

      debug(this.opts, "Generation end");

      if (this.shebang) {
        // add back shebang
        result.code = this.shebang + "\n" + result.code;
      }

      if (result.map) {
        result.map = this.mergeSourceMap(result.map);
      }

      if (opts.sourceMaps === "inline" || opts.sourceMaps === "both") {
        result.code += "\n" + _convertSourceMap2.default.fromObject(result.map).toComment();
      }

      if (opts.sourceMaps === "inline") {
        result.map = null;
      }

      return this.makeResult(result);
    }
  }]);
  return File;
}(_store2.default);

exports.default = File;
exports.File = File;
