// type

import sep from 'path';

type AnymatchFn = (testString: string) => boolean;
type AnymatchPattern = string|RegExp|AnymatchFn;
type AnymatchMatcher = AnymatchPattern|Array<AnymatchPattern>
declare function anymatch(matchers: AnymatchMatcher, testString: string|Array<any>): boolean;
declare function anymatch(matchers: AnymatchMatcher, testString: string|Array<any>, returnIndex: true): number;
declare function anymatch(matchers: AnymatchMatcher): (testString: string|Array<any>) => boolean;
declare function anymatch(matchers: AnymatchMatcher): (testString: string|Array<any>, returnIndex: true) => number;
export = anymatch;
