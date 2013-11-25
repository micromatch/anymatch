minimatch = require 'minimatch'

anymatch = (criteria, string) ->
	criteria = [criteria] if '[object Array]' isnt toString.call criteria
	criteria.some (criterion) -> switch toString.call criterion
		when '[object String]'
			string is criterion or minimatch string, criterion
		when '[object RegExp]'
			criterion.test string
		when '[object Function]'
			criterion string
		else false

anymatch.matcher = (criteria) -> anymatch.bind null, criteria

module.exports = anymatch
