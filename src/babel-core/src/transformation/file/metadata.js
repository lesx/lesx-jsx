"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImportDeclaration = exports.ModuleDeclaration = undefined;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.ExportDeclaration = ExportDeclaration;
exports.Scope = Scope;

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModuleDeclaration = exports.ModuleDeclaration = {
  enter: function enter(path, file) {
    var node = path.node;

    if (node.source) {
      node.source.value = file.resolveModuleSource(node.source.value);
    }
  }
};

var ImportDeclaration = exports.ImportDeclaration = {
  exit: function exit(path, file) {
    var node = path.node;


    var specifiers = [];
    var imported = [];
    file.metadata.modules.imports.push({
      source: node.source.value,
      imported: imported,
      specifiers: specifiers
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(path.get("specifiers")), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var specifier = _step.value;

        var local = specifier.node.local.name;

        if (specifier.isImportDefaultSpecifier()) {
          imported.push("default");
          specifiers.push({
            kind: "named",
            imported: "default",
            local: local
          });
        }

        if (specifier.isImportSpecifier()) {
          var importedName = specifier.node.imported.name;
          imported.push(importedName);
          specifiers.push({
            kind: "named",
            imported: importedName,
            local: local
          });
        }

        if (specifier.isImportNamespaceSpecifier()) {
          imported.push("*");
          specifiers.push({
            kind: "namespace",
            local: local
          });
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
  }
};

function ExportDeclaration(path, file) {
  var node = path.node;


  var source = node.source ? node.source.value : null;
  var exports = file.metadata.modules.exports;

  // export function foo() {}
  // export let foo = "bar";
  var declar = path.get("declaration");
  if (declar.isStatement()) {
    var bindings = declar.getBindingIdentifiers();

    for (var name in bindings) {
      exports.exported.push(name);
      exports.specifiers.push({
        kind: "local",
        local: name,
        exported: path.isExportDefaultDeclaration() ? "default" : name
      });
    }
  }

  if (path.isExportNamedDeclaration() && node.specifiers) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(node.specifiers), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var specifier = _step2.value;

        var exported = specifier.exported.name;
        exports.exported.push(exported);

        // export foo from "bar";
        if (t.isExportDefaultSpecifier(specifier)) {
          exports.specifiers.push({
            kind: "external",
            local: exported,
            exported: exported,
            source: source
          });
        }

        // export * as foo from "bar";
        if (t.isExportNamespaceSpecifier(specifier)) {
          exports.specifiers.push({
            kind: "external-namespace",
            exported: exported,
            source: source
          });
        }

        var local = specifier.local;
        if (!local) continue;

        // export { foo } from "bar";
        // export { foo as bar } from "bar";
        if (source) {
          exports.specifiers.push({
            kind: "external",
            local: local.name,
            exported: exported,
            source: source
          });
        }

        // export { foo };
        // export { foo as bar };
        if (!source) {
          exports.specifiers.push({
            kind: "local",
            local: local.name,
            exported: exported
          });
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

  // export * from "bar";
  if (path.isExportAllDeclaration()) {
    exports.specifiers.push({
      kind: "external-all",
      source: source
    });
  }
}

function Scope(path) {
  path.skip();
}