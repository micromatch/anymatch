'use strict';

const micromatch = require('micromatch');
const normalizePath = require('normalize-path');
const {sep} = require('path'); // required for tests.

/**
 * @typedef {String|RegExp|{(string:String): Boolean}} AnymatchPattern
 * @typedef {AnymatchPattern|Array<AnymatchPattern>} AnymatchMatcher
 */

const BANG = '!';
const arrify = (item) => Array.isArray(item) ? item : [item];

const createPattern = (matcher) => (string) => {
  if (typeof matcher === 'function') {
    return matcher(string);
  }
  if (typeof matcher === 'string') {
    return matcher === string || micromatch.isMatch(string, matcher);
  }
  if (matcher instanceof RegExp) {
    return matcher.test(string);
  }
  return false;
};

/**
 * @param {AnymatchMatcher} matchers
 * @param {String} testString
 * @param {Boolean=} returnIndex
 * @returns {Boolean|Number|Function}
 */
const anymatch = (matchers, testString, returnIndex=false) => {
  if (matchers == null) {
    throw new TypeError('anymatch: specify first argument');
  }
  if (testString == null) {
    return (testString, ri=false) => {
      const returnIndex = typeof ri === 'boolean' ? ri : false;
      return anymatch(matchers, testString, returnIndex);
    }
  }
  if (typeof testString !== 'string') {
    throw new TypeError('anymatch: second argument must be a string: got ' +
      Object.prototype.toString.call(testString))
  }

  const unixified = normalizePath(testString);
  const arrified = arrify(matchers);
  const negatedGlobs = arrified
    .filter(item => typeof item === 'string' && item.charAt(0) === BANG)
    .map(item => item.slice(1));

  // console.log('anymatch', {matchers, testString, containsNegatedGlob, negatedGlobs});

  if (negatedGlobs.length > 0) {
    if (micromatch.some(unixified, negatedGlobs)) {
      return returnIndex ? -1 : false;
    }
  }

  const patterns = arrified.map(createPattern);
  for (let index=0; index < patterns.length; index++) {
    const pattern = patterns[index];
    if (pattern(unixified)) {
      return returnIndex ? index : true;
    }
  }

  return returnIndex ? -1 : false;
};

module.exports = anymatch;
