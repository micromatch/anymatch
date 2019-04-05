// type

import sep from 'path';

// * @param {Array|Function|String|RegExp} matchers
// * @param {String=} testString
// * @param {Boolean=} returnIndex

type AnymatchPattern = String|RegExp|{(string:String): Boolean};
type AnymatchMatcher = AnymatchPattern|Array<AnymatchPattern>
function anymatch(matchers: AnymatchMatcher, testString: String): Boolean;
function anymatch(matchers: AnymatchMatcher, testString: String, returnIndex: Boolean): Number;
function anymatch(matchers: AnymatchMatcher): (testString: String) => Boolean;
function anymatch(matchers: AnymatchMatcher): (testString: String, returnIndex: Boolean) => Number;
export = anymatch;