var anymatch = require('..');

var matchers = [
	'path/to/file.js',
	'path/anyjs/**/*.js',
	/foo.js$/,
	function (string) {
		return string.indexOf('bar') !== -1 && string.length > 10
	}
];

console.log( anymatch(matchers, 'path/to/file.js') ); // true
console.log( anymatch(matchers, 'path/anyjs/baz.js') ); // true
console.log( anymatch(matchers, 'path/to/foo.js') ); // true
console.log( anymatch(matchers, 'path/to/bar.js') ); // true
console.log( anymatch(matchers, 'bar.js') ); // false

// returnIndex = true
console.log( anymatch(matchers, 'foo.js', true) ); // 2
console.log( anymatch(matchers, 'path/anyjs/foo.js', true) ); // 1

// skip matchers
console.log( anymatch(matchers, 'path/to/file.js', false, 1) ); // false
console.log( anymatch(matchers, 'path/anyjs/foo.js', true, 2, 3) ); // 2
console.log( anymatch(matchers, 'path/to/bar.js', true, 0, 3) ); // -1


var matcher = anymatch.matcher(matchers);

console.log( matcher('path/to/file.js') ); // true
console.log( matcher('path/anyjs/baz.js', true) ); // 1
console.log( matcher('path/anyjs/baz.js', true, 2) ); // -1

console.log( ['foo.js', 'bar.js'].filter(matcher) ); // ['foo.js']
