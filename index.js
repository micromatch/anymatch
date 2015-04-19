'use strict';

var arrify = require('arrify');
var micromatch = require('micromatch');
var path = require('path');

var anymatch = function(criteria, value, returnIndex, startIndex, endIndex) {
  criteria = arrify(criteria);
  value = arrify(value);
  if (arguments.length === 1) {
    return anymatch.bind(null, criteria.map(function(criterion) {
      return typeof criterion === 'string' ?
        micromatch.matcher(criterion) : criterion;
    }));
  }
  startIndex = startIndex || 0;
  var string = value[0];
  var altString;
  if (path.sep === '\\' && typeof string === 'string') {
    altString = string.split('\\').join('/');
    altString = altString === string ? null : altString;
  }
  var matchIndex = -1;
  function testCriteria (criterion, index) {
    var result;
    switch (toString.call(criterion)) {
    case '[object String]':
      result = string === criterion || altString && altString === criterion;
      result = result || micromatch.isMatch(string, criterion);
      break;
    case '[object RegExp]':
      result = criterion.test(string) || altString && criterion.test(altString);
      break;
    case '[object Function]':
      result = criterion.apply(null, value);
      break;
    default:
      result = false;
    }
    if (result) { matchIndex = index + startIndex; }
    return result;
  }
  var matched = criteria.slice(startIndex, endIndex).some(testCriteria);
  return returnIndex === true ? matchIndex : matched;
};

module.exports = anymatch;
