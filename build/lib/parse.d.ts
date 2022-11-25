import type { Maybe, Script } from './types';
export declare type ParsedFile = Maybe<{
    script: Script;
    start: number;
    end: number;
}>;
export declare function parseJS(str: string): Promise<ParsedFile>;
export declare function parseJSON(str: string): any;
