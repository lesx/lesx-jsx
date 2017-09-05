"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _weakMap = require("babel-runtime/core-js/weak-map");

var _weakMap2 = _interopRequireDefault(_weakMap);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

exports.makeStrongCache = makeStrongCache;
exports.makeWeakCache = makeWeakCache;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Given a function with a single argument, cache its results based on its argument and how it
 * configures its caching behavior. Cached values are stored strongly.
 */
function makeStrongCache(handler, autoPermacache) {
  return makeCachedFunction(new _map2.default(), handler, autoPermacache);
}

/**
 * Given a function with a single argument, cache its results based on its argument and how it
 * configures its caching behavior. Cached values are stored weakly and the function argument must be
 * an object type.
 */
function makeWeakCache(handler, autoPermacache) {
  return makeCachedFunction(new _weakMap2.default(), handler, autoPermacache);
}

function makeCachedFunction(callCache, handler) {
  var autoPermacache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  return function cachedFunction(arg) {
    var cachedValue = callCache.get(arg);

    if (cachedValue) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(cachedValue), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
              _value = _step$value[0],
              valid = _step$value[1];

          if (valid()) return _value;
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

    var _makeCacheConfig = makeCacheConfig(),
        cache = _makeCacheConfig.cache,
        result = _makeCacheConfig.result,
        deactivate = _makeCacheConfig.deactivate;

    var value = handler(arg, cache);

    if (autoPermacache && !result.configured) cache.forever();

    deactivate();

    if (!result.configured) {
      // eslint-disable-next-line max-len
      throw new Error(["Caching was left unconfigured. Babel's plugins, presets, and .babelrc.js files can be configured", "for various types of caching, using the first param of their handler functions:", "", "module.exports = function(api) {", "  // The API exposes the following:", "", "  // Cache the returned value forever and don't call this function again.", "  api.cache(true);", "", "  // Don't cache at all. Not recommended because it will be very slow.", "  api.cache(false);", "", "  // Cached based on the value of some function. If this function returns a value different from", "  // a previously-encountered value, the plugins will re-evaluate.", "  var env = api.cache(() => process.env.NODE_ENV);", "", "  // If testing for a specific env, we recommend specifics to avoid instantiating a plugin for", "  // any possible NODE_ENV value that might come up during plugin execution.", '  var isProd = api.cache(() => process.env.NODE_ENV === "production");', "", "  // .cache(fn) will perform a linear search though instances to find the matching plugin based", "  // based on previous instantiated plugins. If you want to recreate the plugin and discard the", "  // previous instance whenever something changes, you may use:", '  var isProd = api.cache.invalidate(() => process.env.NODE_ENV === "production");', "", "  // Note, we also expose the following more-verbose versions of the above examples:", "  api.cache.forever(); // api.cache(true)", "  api.cache.never();   // api.cache(false)", "  api.cache.using(fn); // api.cache(fn)", "", "  // Return the value that will be cached.", "  return { };", "};"].join("\n"));
    }

    if (!result.never) {
      if (result.forever) {
        cachedValue = [[value, function () {
          return true;
        }]];
      } else if (result.invalidate) {
        cachedValue = [[value, result.valid]];
      } else {
        cachedValue = cachedValue || [];
        cachedValue.push([value, result.valid]);
      }
      callCache.set(arg, cachedValue);
    }

    return value;
  };
}

function makeCacheConfig() {
  var pairs = [];

  var result = {
    configured: false,
    never: false,
    forever: false,
    invalidate: false,
    valid: function valid() {
      return pairs.every(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
            key = _ref2[0],
            fn = _ref2[1];

        return key === fn();
      });
    }
  };

  var active = true;
  var deactivate = function deactivate() {
    active = false;
  };

  var cache = (0, _assign2.default)(function cacheFn(val) {
    if (typeof val === "boolean") {
      if (val) cache.forever();else cache.never();
      return;
    }

    return cache.using(val);
  }, {
    forever: function forever() {
      if (!active) {
        throw new Error("Cannot change caching after evaluation has completed.");
      }
      if (result.never) {
        throw new Error("Caching has already been configured with .never()");
      }
      result.forever = true;
      result.configured = true;
    },
    never: function never() {
      if (!active) {
        throw new Error("Cannot change caching after evaluation has completed.");
      }
      if (result.forever) {
        throw new Error("Caching has already been configured with .forever()");
      }
      result.never = true;
      result.configured = true;
    },
    using: function using(handler) {
      if (!active) {
        throw new Error("Cannot change caching after evaluation has completed.");
      }
      if (result.never || result.forever) {
        throw new Error("Caching has already been configured with .never or .forever()");
      }
      result.configured = true;

      var key = handler();
      pairs.push([key, handler]);
      return key;
    },
    invalidate: function invalidate(handler) {
      if (!active) {
        throw new Error("Cannot change caching after evaluation has completed.");
      }
      if (result.never || result.forever) {
        throw new Error("Caching has already been configured with .never or .forever()");
      }
      result.invalidate = true;
      result.configured = true;

      var key = handler();
      pairs.push([key, handler]);
      return key;
    }
  });

  return { cache: cache, result: result, deactivate: deactivate };
}