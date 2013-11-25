anymatch
======
Javascript module to match a string against a regular expression, glob, string,
or function that takes the string as an argument and returns a truthy or falsy
value. The matcher can also be an array of any or all of these. Useful for
allowing a very flexible user-defined config to define things like file paths.

Usage
-----
`npm install anymatch --save`

```js
var anymatch = require('anymatch');

var matchers = [
	'path/to/file.js',
	'path/anyjs/**/*.js',
	/foo.js$/,
	function (string) {
		return string.indexOf('bar') !== -1 && string.length > 10
	}
];

anymatch(matchers, 'path/to/file.js'); // true
anymatch(matchers, 'path/anyjs/baz.js'); // true
anymatch(matchers, 'path/to/foo.js'); // true
anymatch(matchers, 'path/to/bar.js'); // true
anymatch(matchers, 'bar.js'); // false
```

You can also use the `checker` method to get a function that has already been
bound to your matchers.

```js
var matcher = anymatch.matcher(matchers);

matcher('path/to/file.js'); // true
```

License
-------
[MIT](https://raw.github.com/es128/anymatch/master/LICENSE)
