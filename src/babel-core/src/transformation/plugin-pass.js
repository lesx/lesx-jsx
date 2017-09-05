"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _file5 = require("./file");

var _file6 = _interopRequireDefault(_file5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PluginPass = function (_Store) {
  (0, _inherits3.default)(PluginPass, _Store);

  function PluginPass(file, key) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, PluginPass);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PluginPass.__proto__ || (0, _getPrototypeOf2.default)(PluginPass)).call(this));

    _this.key = key;
    _this.file = file;
    _this.opts = options;
    return _this;
  }

  (0, _createClass3.default)(PluginPass, [{
    key: "addHelper",
    value: function addHelper() {
      var _file;

      return (_file = this.file).addHelper.apply(_file, arguments);
    }
  }, {
    key: "addImport",
    value: function addImport() {
      var _file2;

      return (_file2 = this.file).addImport.apply(_file2, arguments);
    }
  }, {
    key: "getModuleName",
    value: function getModuleName() {
      var _file3;

      return (_file3 = this.file).getModuleName.apply(_file3, arguments);
    }
  }, {
    key: "buildCodeFrameError",
    value: function buildCodeFrameError() {
      var _file4;

      return (_file4 = this.file).buildCodeFrameError.apply(_file4, arguments);
    }
  }]);
  return PluginPass;
}(_store2.default);

exports.default = PluginPass;
module.exports = exports["default"];