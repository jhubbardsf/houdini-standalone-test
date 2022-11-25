import * as recast from 'recast';
import { Config } from './config';
declare type Statement = recast.types.namedTypes.Statement;
export declare function ensureArtifactImport({ config, artifact, body, local, withExtension, }: {
    config: Config;
    artifact: {
        name: string;
    };
    body: Statement[];
    local?: string;
    withExtension?: boolean;
}): string;
export declare function ensureImports<_Count extends string[] | string>({ config, body, import: importID, sourceModule, importKind, }: {
    config: Config;
    body: Statement[];
    import: _Count;
    sourceModule: string;
    importKind?: 'value' | 'type';
}): _Count;
export {};
