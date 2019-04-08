// type

import sep from 'path';

type AnymatchFn = (string:string) => boolean;
type AnymatchPattern = string|RegExp|AnymatchFn;
type AnymatchMatcher = AnymatchPattern|Array<AnymatchPattern>
declare function anymatch(matchers: AnymatchMatcher, testString: string): boolean;
declare function anymatch(matchers: AnymatchMatcher, testString: string, returnIndex: boolean): number;
declare function anymatch(matchers: AnymatchMatcher): (testString: string) => boolean;
declare function anymatch(matchers: AnymatchMatcher): (testString: string, returnIndex: boolean) => number;
export = anymatch;