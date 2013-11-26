minimatch = require 'minimatch'

anymatch = (criteria, string, returnIndex) ->
	criteria = [criteria] if '[object Array]' isnt toString.call criteria
	matchIndex = -1
	matched = criteria.some (criterion, index) ->
		result = switch toString.call criterion
			when '[object String]'
				string is criterion or minimatch string, criterion
			when '[object RegExp]'
				criterion.test string
			when '[object Function]'
				criterion string
			else false
		matchIndex = index if result
		result
	if returnIndex is true then matchIndex else matched

anymatch.matcher = (criteria) -> anymatch.bind null, criteria

module.exports = anymatch
