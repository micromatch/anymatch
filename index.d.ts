import {PicomatchOptions} from "picomatch";

type AnymatchFn = (testString: string) => boolean;
type AnymatchPattern = string|RegExp|AnymatchFn;
type AnymatchMatcher = AnymatchPattern|AnymatchPattern[]
type AnymatchTester = {
  (testString: string|any[], returnIndex: true): number;
  (testString: string|any[]): boolean;
}
type AnymatchOptions = {returnIndex?: boolean} & PicomatchOptions

declare const anymatch: {
  (matchers: AnymatchMatcher): AnymatchTester;
  (matchers: AnymatchMatcher, testString: null, returnIndex: true | AnymatchOptions): AnymatchTester;
  (matchers: AnymatchMatcher, testString: string|any[], returnIndex: true): number;
  (matchers: AnymatchMatcher, testString: string|any[], options: {returnIndex: true} & PicomatchOptions): number;
  (matchers: AnymatchMatcher, testString: string|any[], options: {returnIndex?: false} & PicomatchOptions): boolean;
  (matchers: AnymatchMatcher, testString: string|any[]): boolean;
}

export {AnymatchMatcher as Matcher}
export {AnymatchTester as Tester}
export default anymatch
