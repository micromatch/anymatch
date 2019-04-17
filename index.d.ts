// type

import sep from 'path';

type AnymatchFn = (testString: string) => boolean;
type AnymatchPattern = string|RegExp|AnymatchFn;
type AnymatchMatcher = AnymatchPattern|AnymatchPattern[]
declare function anymatch(matchers: AnymatchMatcher, testString: string|any[]): boolean;
declare function anymatch(matchers: AnymatchMatcher, testString: string|any[], returnIndex: true): number;
declare function anymatch(matchers: AnymatchMatcher): (testString: string|any[]) => boolean;
declare function anymatch(matchers: AnymatchMatcher): (testString: string|any[], returnIndex: true) => number;
export = anymatch;
