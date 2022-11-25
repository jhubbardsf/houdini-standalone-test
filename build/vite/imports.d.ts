import * as recast from 'recast';
import { Config } from '../lib/config';
import { Script } from '../lib/types';
import { TransformPage } from './houdini';
declare type Identifier = recast.types.namedTypes.Identifier;
export declare function ensure_imports(args: {
    config: Config;
    script: Script;
    import?: string;
    as?: never;
    sourceModule: string;
    importKind?: 'value' | 'type';
}): {
    ids: Identifier;
    added: number;
};
export declare function ensure_imports(args: {
    config: Config;
    script: Script;
    import?: string[];
    as?: string[];
    sourceModule: string;
    importKind?: 'value' | 'type';
}): {
    ids: Identifier[];
    added: number;
};
export declare function artifact_import({ config, script, artifact, local, }: {
    page: TransformPage;
    config: Config;
    script: Script;
    artifact: {
        name: string;
    };
    local?: string;
}): {
    id: recast.types.namedTypes.Identifier;
    added: number;
};
export {};
