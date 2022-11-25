/// <reference types="node" />
/// <reference types="glob" />
import fsExtra from 'fs-extra';
export declare function readFile(filepath: string): Promise<string | null>;
export declare function readFileSync(filepath: string): string | null;
export declare function writeFile(filepath: string, data: string): Promise<void>;
export declare function access(filepath: string): Promise<void | import("memfs/lib/Stats").Stats<number>>;
export declare function mkdirp(filepath: string): Promise<void>;
export declare function mkdirpSync(filepath: string): Promise<void>;
export declare function mkdir(filepath: string): Promise<void>;
export declare function rmdir(filepath: string): Promise<unknown>;
export declare function stat(filepath: string): Promise<import("memfs/lib/Stats").Stats<number> | fsExtra.Stats>;
export declare function existsSync(dirPath: string): boolean;
export declare function readdir(filepath: string): Promise<string[]>;
export declare function remove(filepath: string): Promise<void>;
declare type MockFilesystem = {
    [key: string]: string | MockFilesystem;
};
export declare function mock(target: MockFilesystem[string], filepath?: string): Promise<void>;
export declare function recursiveCopy(source: string, target: string, transforms?: Record<string, (content: string) => string>, notRoot?: boolean): Promise<void>;
export declare function glob(pattern: string): Promise<string[]>;
export declare namespace glob {
    var hasMagic: typeof import("glob").hasMagic;
}
export {};
