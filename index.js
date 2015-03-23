'use strict';

var micromatch = require('micromatch');
var arrify = require('arrify');

var anymatch = function(criteria, value, returnIndex, startIndex, endIndex) {
  criteria = arrify(criteria);
  value = arrify(value);
  if (arguments.length === 1) {
    return criteria.length === 1 ?
      micromatch.matcher(criteria[0]) :
      anymatch.bind(null, criteria.map(function(criterion) {
        return micromatch.matcher(criterion);
      }));
  }
  startIndex = startIndex || 0;
  var string = value[0];
  var matchIndex = -1;
  function testCriteria (criterion, index) {
    var result;
    switch (toString.call(criterion)) {
    case '[object String]':
      result = string === criterion || micromatch.isMatch(string, criterion);
      break;
    case '[object RegExp]':
      result = criterion.test(string);
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
