/// <reference types="node" />
import path from 'path';
export declare const sep = "/";
export declare function resolve(...parts: string[]): string;
export declare function join(...parts: string[]): string;
export declare function extname(target: string): string;
export declare function relative(from: string, to: string): string;
export declare function basename(target: string): string;
export declare function dirname(target: string): string;
export declare function isAbsolute(target: string): boolean;
export declare function parse(target: string): path.ParsedPath;
export declare const posixify: (str: string) => string;
export declare function importPath(target: string): string;
