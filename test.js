'use strict';

var anymatch = require('./');
var assert = require('assert');
var path = require('path');

describe('anymatch', function() {
  var matchers = [
    'path/to/file.js',
    'path/anyjs/**/*.js',
    /foo.js$/,
    function(string) {
      return string.indexOf('bar') !== -1 && string.length > 10;
    }
  ];
  it('should resolve string matchers', function() {
    assert(anymatch(matchers, 'path/to/file.js'));
    assert(anymatch(matchers[0], 'path/to/file.js'));
    assert(!anymatch(matchers[0], 'bar.js'));
  });
  it('should resolve glob matchers', function() {
    assert(anymatch(matchers, 'path/anyjs/baz.js'));
    assert(anymatch(matchers[1], 'path/anyjs/baz.js'));
    assert(!anymatch(matchers[1], 'bar.js'));
  });
  it('should resolve regexp matchers', function() {
    assert(anymatch(matchers, 'path/to/foo.js'));
    assert(anymatch(matchers[2], 'path/to/foo.js'));
    assert(!anymatch(matchers[2], 'bar.js'));
  });
  it('should resolve function matchers', function() {
    assert(anymatch(matchers, 'path/to/bar.js'));
    assert(anymatch(matchers[3], 'path/to/bar.js'));
    assert(!anymatch(matchers[3], 'bar.js'));
  });
  it('should return false for unmatched strings', function() {
    assert(!anymatch(matchers, 'bar.js'));
  });
  it('should ignore improperly typed matchers', function() {
    var emptyObj = {};
    assert(!anymatch(emptyObj, emptyObj));
    assert(!anymatch(Infinity, Infinity));
  });

  describe('with returnIndex = true', function() {
    it('should return the array index of first positive matcher', function() {
      var result = anymatch(matchers, 'foo.js', true);
      assert.equal(result, 2);
    });
    it('should return 0 if provided non-array matcher', function() {
      var result = anymatch(matchers[2], 'foo.js', true);
      assert.equal(result, 0);
    });
    it('should return -1 if no match', function() {
      var result = anymatch(matchers, 'bar.js', true);
      assert.equal(result, -1);
    });
  });

  describe('curried matching function', function() {
    var matchFn = anymatch(matchers);
    it('should resolve matchers', function() {
      assert(matchFn('path/to/file.js'));
      assert(matchFn('path/anyjs/baz.js'));
      assert(matchFn('path/to/foo.js'));
      assert(matchFn('path/to/bar.js'));
      assert(!matchFn('bar.js'));
    });
    it('should be usable as an Array.prototype.filter callback', function() {
      var arr = [
        'path/to/file.js',
        'path/anyjs/baz.js',
        'path/to/foo.js',
        'path/to/bar.js',
        'bar.js',
        'foo.js'
      ];
      var expected = arr.slice();
      expected.splice(arr.indexOf('bar.js'), 1);
      assert.deepEqual(arr.filter(matchFn), expected);
    });
    it('should bind individual criterion', function() {
      assert(anymatch(matchers[0])('path/to/file.js'));
      assert(!anymatch(matchers[0])('path/to/other.js'));
      assert(anymatch(matchers[1])('path/anyjs/baz.js'));
      assert(!anymatch(matchers[1])('path/to/baz.js'));
      assert(anymatch(matchers[2])('path/to/foo.js'));
      assert(!anymatch(matchers[2])('path/to/foo.js.bak'));
      assert(anymatch(matchers[3])('path/to/bar.js'));
      assert(!anymatch(matchers[3])('bar.js'));
    });
  });

  describe('using matcher subsets', function() {
    it('should skip matchers before the startIndex', function() {
      assert(anymatch(matchers, 'path/to/file.js', false));
      assert(!anymatch(matchers, 'path/to/file.js', false, 1));
    });
    it('should skip matchers after and including the endIndex', function() {
      assert(anymatch(matchers, 'path/to/bars.js', false));
      assert(!anymatch(matchers, 'path/to/bars.js', false, 0, 3));
      assert(!anymatch(matchers, 'foo.js', false, 0, 1));
    });
  });

  describe('extra args', function() {
    it('should allow string to be passed as first member of an array', function() {
      assert(anymatch(matchers, ['path/to/bar.js']));
    });
    it('should pass extra args to function matchers', function() {
      matchers.push(function(string, arg1, arg2) { return arg1 || arg2; });
      assert(!anymatch(matchers, 'bar.js'), 1);
      assert(!anymatch(matchers, ['bar.js', 0]), 2);
      assert(anymatch(matchers, ['bar.js', true]), 3);
      assert(anymatch(matchers, ['bar.js', 0, true]), 4);
      // with returnIndex
      assert.equal(anymatch(matchers, ['bar.js', 1], true), 4, 5);
      // curried versions
      var matchFn1 = anymatch(matchers);
      var matchFn2 = anymatch(matchers[4]);
      assert(!matchFn1(['bar.js', 0]), 6);
      assert(!matchFn2(['bar.js', 0]), 7);
      assert(matchFn1(['bar.js', true]), 8);
      assert(matchFn2(['bar.js', true]), 9);
      assert(matchFn1(['bar.js', 0, true]), 10);
      assert(matchFn2(['bar.js', 0, true]), 11);
      // curried with returnIndex
      assert.equal(matchFn1(['bar.js', 1], true), 4, 12);
      assert.equal(matchFn2(['bar.js', 1], true), 0, 13);
      assert.equal(matchFn1(['bar.js', 0], true), -1, 14);
      assert.equal(matchFn2(['bar.js', 0], true), -1, 15);
      matchers.pop();
    });
  });

  describe('glob negation', function() {
    after(matchers.splice.bind(matchers, 4, 2));
    it('should respect negated globs included in a matcher array', function() {
      assert(anymatch(matchers, 'path/anyjs/no/no.js'), 'matches existing glob');
      matchers.push('!path/anyjs/no/*.js');
      assert(!anymatch(matchers, 'path/anyjs/no/no.js'), 'should be negated');
      assert(!anymatch(matchers)('path/anyjs/no/no.js'), 'should be negated (curried)');
    });
    it('should not break returnIndex option', function() {
      assert.equal(anymatch(matchers, 'path/anyjs/yes.js', true), 1);
      assert.equal(anymatch(matchers)('path/anyjs/yes.js', true), 1);
      assert.equal(anymatch(matchers, 'path/anyjs/no/no.js', true), -1);
      assert.equal(anymatch(matchers)('path/anyjs/no/no.js', true), -1);
    });
    it('should allow negated globs to negate non-glob matchers', function() {
      assert.equal(anymatch(matchers, 'path/to/bar.js', true), 3);
      matchers.push('!path/to/bar.*');
      assert(!anymatch(matchers, 'path/to/bar.js'));
    });
  });

  describe('windows paths', function() {
    var origSep = path.sep;
    
    before(function() {
      path.sep = '\\';
    });

    after(function() {
      path.sep = origSep;
    });

    it('should resolve backslashes against string matchers', function() {
      assert(anymatch(matchers, 'path\\to\\file.js'));
      assert(anymatch(matchers)('path\\to\\file.js'));
    });
    it('should resolve backslashes against glob matchers', function() {
      assert(anymatch(matchers, 'path\\anyjs\\file.js'));
      assert(anymatch(matchers)('path\\anyjs\\file.js'));
    });
    it('should resolve backslashes against regex matchers', function() {
      assert(anymatch(/path\/to\/file\.js/, 'path\\to\\file.js'));
      assert(anymatch(/path\/to\/file\.js/)('path\\to\\file.js'));
    });
  });
});
