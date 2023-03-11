'use strict';

import picomatch, { PicomatchOptions } from 'picomatch';
import normalizePath from 'normalize-path';


declare type AnymatchFn = (testString: string) => boolean
declare type AnymatchPattern = string|RegExp|AnymatchFn
declare type AnymatchMatcher = AnymatchPattern|AnymatchPattern[]

const BANG = '!';
type returnIndexOptions = {returnIndex?: boolean}
const DEFAULT_OPTIONS: returnIndexOptions = {returnIndex: false};
const arrify = (item: unknown) => Array.isArray(item) ? item : [item];


const createPattern = (matcher: AnymatchPattern, options: object): AnymatchFn => {
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

const matchPatterns = (patterns: Array<Function>, negPatterns: Array<Function>, args: string|Array<unknown>, returnIndex: boolean): boolean|number => {
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


type anymatchFn = (testString: string, ri: boolean) => anymatchFn|boolean|number

export const anymatch = (matchers: AnymatchMatcher, testString: Array<unknown>|string, options: PicomatchOptions | returnIndexOptions | boolean  = DEFAULT_OPTIONS): boolean|number|anymatchFn => {
  if (matchers == null) {
    throw new TypeError('anymatch: specify first argument');
  }
  const opts : PicomatchOptions & returnIndexOptions = typeof options === 'boolean' ? {returnIndex: options} : options as PicomatchOptions & returnIndexOptions;
  const returnIndex: boolean = opts.returnIndex || false;

  // Early cache for matchers.
  const mtchers = arrify(matchers);
  const negatedGlobs = mtchers
    .filter(item => typeof item === 'string' && item.charAt(0) === BANG)
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
exports = anymatch