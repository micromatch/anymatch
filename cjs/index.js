'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.anymatch = void 0;
var picomatch_1 = __importDefault(require("picomatch"));
var normalize_path_1 = __importDefault(require("normalize-path"));
var BANG = '!';
var DEFAULT_OPTIONS = { returnIndex: false };
var arrify = function (item) { return Array.isArray(item) ? item : [item]; };
var createPattern = function (matcher, options) {
    if (typeof matcher === 'function') {
        return matcher;
    }
    if (typeof matcher === 'string') {
        var glob_1 = (0, picomatch_1["default"])(matcher, options);
        return function (string) { return matcher === string || glob_1(string); };
    }
    if (matcher instanceof RegExp) {
        return function (string) { return matcher.test(string); };
    }
    return function () { return false; };
};
var matchPatterns = function (patterns, negPatterns, args, returnIndex) {
    var isList = Array.isArray(args);
    var _path = isList ? args[0] : args;
    if (!isList && typeof _path !== 'string') {
        throw new TypeError('anymatch: second argument must be a string: got ' +
            Object.prototype.toString.call(_path));
    }
    var path = (0, normalize_path_1["default"])(_path, false);
    for (var index = 0; index < negPatterns.length; index++) {
        var nglob = negPatterns[index];
        if (nglob(path)) {
            return returnIndex ? -1 : false;
        }
    }
    var applied = isList && [path].concat(args.slice(1));
    for (var index = 0; index < patterns.length; index++) {
        var pattern = patterns[index];
        if (isList ? pattern.apply(void 0, applied) : pattern(path)) {
            return returnIndex ? index : true;
        }
    }
    return returnIndex ? -1 : false;
};
var anymatch = function (matchers, testString, options) {
    if (options === void 0) { options = DEFAULT_OPTIONS; }
    if (matchers == null) {
        throw new TypeError('anymatch: specify first argument');
    }
    var opts = typeof options === 'boolean' ? { returnIndex: options } : options;
    var returnIndex = opts.returnIndex || false;
    var mtchers = arrify(matchers);
    var negatedGlobs = mtchers
        .filter(function (item) { return typeof item === 'string' && item.charAt(0) === BANG; })
        .map(function (item) { return item.slice(1); })
        .map(function (item) { return (0, picomatch_1["default"])(item, opts); });
    var patterns = mtchers
        .filter(function (item) { return typeof item !== 'string' || (typeof item === 'string' && item.charAt(0) !== BANG); })
        .map(function (matcher) { return createPattern(matcher, opts); });
    if (testString == null) {
        return function (testString, ri) {
            if (ri === void 0) { ri = false; }
            var returnIndex = typeof ri === 'boolean' ? ri : false;
            return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
        };
    }
    return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
};
exports.anymatch = anymatch;
exports["default"] = exports.anymatch;
//# sourceMappingURL=index.js.map