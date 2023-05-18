export function anymatch(matchers: AnymatchMatcher, testString: string | string[], options?: PicomatchOptions | returnIndexOptions | boolean): boolean | number | anymatchFn;
export default anymatch;
export type PicomatchOptions = import("picomatch").PicomatchOptions;
export type AnymatchFn = (testString: string) => boolean;
export type AnymatchPattern = string | RegExp | AnymatchFn;
export type AnymatchMatcher = AnymatchPattern | AnymatchPattern[];
export type returnIndexOptions = {
    returnIndex?: boolean;
};
export type anymatchFn = (testString: string, ri: boolean) => anymatchFn | boolean | number;
