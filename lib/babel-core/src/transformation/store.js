"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Store = function () {
  function Store() {
    (0, _classCallCheck3.default)(this, Store);

    this._map = new _map2.default();
    this._map.dynamicData = {};
  }

  (0, _createClass3.default)(Store, [{
    key: "setDynamic",
    value: function setDynamic(key, fn) {
      this._map.dynamicData[key] = fn;
    }
  }, {
    key: "set",
    value: function set(key, val) {
      this._map.set(key, val);
    }
  }, {
    key: "get",
    value: function get(key) {
      if (this._map.has(key)) {
        return this._map.get(key);
      } else {
        if (Object.prototype.hasOwnProperty.call(this._map.dynamicData, key)) {
          var val = this._map.dynamicData[key]();
          this._map.set(key, val);
          return val;
        }
      }
    }
  }]);
  return Store;
}();

exports.default = Store;
module.exports = exports["default"];