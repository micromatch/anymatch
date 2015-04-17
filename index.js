'use strict';

var micromatch = require('micromatch');
var arrify = require('arrify');

var platform = process.platform;

var anymatch = function(criteria, value, returnIndex, startIndex, endIndex) {
  criteria = arrify(criteria);
  value = arrify(value);
  if (arguments.length === 1) {
    return anymatch.bind(null, criteria.map(function(criterion) {
      if (typeof criterion !== 'string') {
        return criterion;
      }
      var matcher = micromatch.matcher(criterion);
      return function(string) {
        return matcher(string) ||
          platform === 'win32' && matcher(string.split('\\').join('/'));
      };
    }));
  }
  startIndex = startIndex || 0;
  var string = value[0];
  var altString;
  if (platform === 'win32' && typeof string === 'string') {
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
