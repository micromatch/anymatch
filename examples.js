const inspect = require('util').inspect;
const i = function (val) {return inspect(val, {colors: true})};

const origAnymatch = require('./').default;
console.log("const anymatch = require('anymatch');\n");

const matchers = [
  'path/to/file.js',
  'path/anyjs/**/*.js',
  /foo.js$/,
  (string => string.includes('bar') && string.length > 10)
];

console.log('const matchers =',
  i(matchers).replace('[Function]', matchers[3].toString() + ''), ';\n');

const anymatch = (...args) => {
  let arg1 = args[0] === matchers ? `matchers` : i(args[0]);
  let str = `anymatch(${arg1}, ${i(args[1])}`;
  if (args[2]) str += `, ${i(args[2])}`;
  str += `);`
  console.log(`${str} // ${i(origAnymatch(...args))}`)
};

anymatch(matchers, 'path/to/file.js'); // true
anymatch(matchers, 'path/anyjs/baz.js'); // true
anymatch(matchers, 'path/to/foo.js'); // true
anymatch(matchers, 'path/to/bar.js'); // true
anymatch(matchers, 'bar.js'); // false

// returnIndex = true
anymatch(matchers, 'foo.js', true); // 2
anymatch(matchers, 'path/anyjs/foo.js', true); // 1

// using globs to match directories and their children
anymatch('node_modules', 'node_modules'); // true
anymatch('node_modules', 'node_modules/somelib/index.js'); // false
anymatch('node_modules/**', 'node_modules/somelib/index.js'); // true
anymatch('node_modules/**', '/absolute/path/to/node_modules/somelib/index.js'); // false
anymatch('**/node_modules/**', '/absolute/path/to/node_modules/somelib/index.js'); // true

const matcher = origAnymatch(matchers);
matcher('path/to/file.js'); // true
matcher('path/anyjs/baz.js', true); // 1

// console.log(i(['foo.js', 'bar.js'].filter(matcher))); // ['foo.js']
console.log( '\nconst matcher = anymatch(matchers);' );
console.log("['foo.js', 'bar.js'].filter(matcher);",
    " //", i(['foo.js', 'bar.js'].filter(matcher) )); // ['foo.js']
