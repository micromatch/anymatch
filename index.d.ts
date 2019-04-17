// type

import sep from 'path';

type AnymatchFn = (testString: string) => boolean;
type AnymatchPattern = string|RegExp|AnymatchFn;
type AnymatchMatcher = AnymatchPattern|AnymatchPattern[]

declare const anymatch: {
  (matchers: AnymatchMatcher): {
    (testString: string|any[], returnIndex: true): number;
    (testString: string|any[]): boolean;
  };
  (matchers: AnymatchMatcher, testString: string|any[], returnIndex: true): number;
  (matchers: AnymatchMatcher, testString: string|any[]): boolean;
}
export = anymatch