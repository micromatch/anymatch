'use strict';

import picomatch from 'picomatch';
import normalizePath from 'normalize-path';


/**
 * @typedef {import("picomatch").PicomatchOptions} PicomatchOptions
 * @typedef {(testString: string) => boolean} AnymatchFn
 * @typedef {string|RegExp|AnymatchFn} AnymatchPattern
 * @typedef {AnymatchPattern|AnymatchPattern[]} AnymatchMatcher
 * @typedef {{returnIndex?: boolean}} returnIndexOptions
 * @typedef {(testString: string, ri: boolean) => anymatchFn|boolean|number} anymatchFn
 */

const BANG = '!';

/**
 * @type {returnIndexOptions}
 */
const DEFAULT_OPTIONS = {returnIndex: false};
/**
 * @template T
 * @param {T|T[]} item 
 * @returns {T[]}
 */
const arrify = (item) => Array.isArray(item) ? item : [item];


/**
 * @param {AnymatchPattern} matcher 
 * @param {object} options 
 * @returns {AnymatchFn}
 */
const createPattern = (matcher, options) => {
  if (typeof matcher === 'function') {
    return matcher;
  }
  if (typeof matcher === 'string') {
    const glob = picomatch(matcher, options);
    return (string) => matcher === string || glob(string);
  }
  if (matcher instanceof RegExp) {
    return (string) => matcher.test(string);
  }
  return () => false;
};

/**
 * @param {Function[]} patterns 
 * @param {Function[]} negPatterns 
 * @param {string|string[]} args 
 * @param {boolean} returnIndex 
 * @returns {boolean|number}
 */
const matchPatterns = (patterns, negPatterns, args, returnIndex) => {
  const isList = Array.isArray(args);
  const _path = isList ? args[0] : args;
  if (!isList && typeof _path !== 'string') {
    throw new TypeError('anymatch: second argument must be a string: got ' +
      Object.prototype.toString.call(_path))
  }
  const path = normalizePath(_path, false);

  for (let index = 0; index < negPatterns.length; index++) {
    const nglob = negPatterns[index];
    if (nglob(path)) {
      return returnIndex ? -1 : false;
    }
  }

  const applied = isList && [path].concat(args.slice(1));
  for (let index = 0; index < patterns.length; index++) {
    const pattern = patterns[index];
    if (isList ? pattern(...applied) : pattern(path)) {
      return returnIndex ? index : true;
    }
  }

  return returnIndex ? -1 : false;
};


/**
 * @param {AnymatchMatcher} matchers 
 * @param {string|string[]} testString 
 * @param {PicomatchOptions | returnIndexOptions | boolean} options 
 * @returns {boolean|number|anymatchFn}
 */
export const anymatch = (matchers, testString, options = DEFAULT_OPTIONS) => {
  if (matchers == null) {
    throw new TypeError('anymatch: specify first argument');
  }
  /**
   * @type {PicomatchOptions & returnIndexOptions}
   */
  const opts = typeof options === 'boolean' ? {returnIndex: options} : options;
  /**
   * @type {boolean}
   */
  const returnIndex = opts.returnIndex || false;

  // Early cache for matchers.
  const mtchers = arrify(matchers);
  /**
   * @type {string[]}
   */
  const stringBangedMatchers = /**@type {string[]} */ (mtchers
  .filter(item => typeof item === 'string' && item.charAt(0) === BANG))
  const negatedGlobs = stringBangedMatchers
    .map(item => item.slice(1))
    .map(item => picomatch(item, opts));
  const patterns = mtchers
    .filter(item => typeof item !== 'string' || (typeof item === 'string' && item.charAt(0) !== BANG))
    .map(matcher => createPattern(matcher, opts));

  if (testString == null) {
    return (testString, ri = false) => {
      const returnIndex = typeof ri === 'boolean' ? ri : false;
      return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
    }
  }

  return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
};

export default anymatch