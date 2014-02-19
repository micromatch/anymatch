anymatch = require '..'
assert = require 'assert'


describe 'anymatch', ->
	matchers = [
		'path/to/file.js'
		'path/anyjs/**/*.js'
		/foo.js$/
		(string) -> string.indexOf('bar') isnt -1 and string.length > 10
	]

	it 'should resolve string matchers', ->
		assert     anymatch matchers,    'path/to/file.js'
		assert     anymatch matchers[0], 'path/to/file.js'
		assert not anymatch matchers[0], 'bar.js'

	it 'should resolve glob matchers', ->
		assert     anymatch matchers,    'path/anyjs/baz.js'
		assert     anymatch matchers[1], 'path/anyjs/baz.js'
		assert not anymatch matchers[1], 'bar.js'

	it 'should resolve regexp matchers', ->
		assert     anymatch matchers,    'path/to/foo.js'
		assert     anymatch matchers[2], 'path/to/foo.js'
		assert not anymatch matchers[2], 'bar.js'

	it 'should resolve function matchers', ->
		assert     anymatch matchers,    'path/to/bar.js'
		assert     anymatch matchers[3], 'path/to/bar.js'
		assert not anymatch matchers[3], 'bar.js'

	it 'should return false for unmatched strings', ->
		assert not anymatch matchers,    'bar.js'

	it 'should ignore improperly typed matchers', ->
		emptyObj = {}
		assert not anymatch emptyObj,    emptyObj
		assert not anymatch Infinity,    Infinity

	describe 'with returnIndex = true', ->
		it 'should return the array index of first positive matcher', ->
			result = anymatch matchers, 'foo.js', true
			assert.equal result, 2

		it 'should return 0 if provided non-array matcher', ->
			result = anymatch matchers[2], 'foo.js', true
			assert.equal result, 0

		it 'should return -1 if no match', ->
			result = anymatch matchers, 'bar.js', true
			assert.equal result, -1

	describe 'bound matching function', ->
		matchFunc = anymatch.matcher matchers

		it 'should resolve matchers', ->
			assert     anymatch matchers, 'path/to/file.js'
			assert     anymatch matchers, 'path/anyjs/baz.js'
			assert     anymatch matchers, 'path/to/foo.js'
			assert     anymatch matchers, 'path/to/bar.js'
			assert not anymatch matchers, 'bar.js'

		it 'should be usable as an Array.prototype.filter callback', ->
			arr = [
				'path/to/file.js'
				'path/anyjs/baz.js'
				'path/to/foo.js'
				'path/to/bar.js'
				'bar.js'
				'foo.js'
			]
			(expected = do arr.slice).splice arr.indexOf('bar.js'), 1
			assert.deepEqual arr.filter(matchFunc), expected

	describe 'using matcher subsets', ->
		it 'should skip matchers before the startIndex', ->
			assert     anymatch matchers, 'path/to/file.js', false
			assert not anymatch matchers, 'path/to/file.js', false, 1

		it 'should skip matchers after and including the endIndex', ->
			assert     anymatch matchers, 'path/to/bars.js', false
			assert not anymatch matchers, 'path/to/bars.js', false, 0, 3
			assert not anymatch matchers, 'foo.js', false, 0, 1

