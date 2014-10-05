'use strict'

minimatch = require 'minimatch'

anymatch = (criteria, string, returnIndex, startIndex = 0, endIndex) ->
	criteria = [criteria] unless Array.isArray criteria
	if arguments.length is 1
		return anymatch.bind null, criteria
	matchIndex = -1
	matched = criteria.slice(startIndex, endIndex).some (criterion, index) ->
		result = switch toString.call criterion
			when '[object String]'
				string is criterion or minimatch string, criterion
			when '[object RegExp]'
				criterion.test string
			when '[object Function]'
				criterion string
			else false
		matchIndex = index + startIndex if result
		result
	if returnIndex is true then matchIndex else matched

module.exports = anymatch
