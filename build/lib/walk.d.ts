import { BaseNode } from 'estree-walker';
import * as graphql from 'graphql';
import { CompiledDocumentKind } from '../runtime/lib/types';
import { Config } from './config';
import { Script } from './types';
export declare type EmbeddedGraphqlDocument = {
    parsedDocument: graphql.DocumentNode;
    artifact: {
        name: string;
        kind: CompiledDocumentKind;
    };
    node: BaseNode & {
        remove: () => void;
        replaceWith: (node: BaseNode) => void;
    };
    tagContent: string;
    parent: BaseNode;
};
declare type GraphqlTagWalker = {
    where?: (tag: graphql.DocumentNode) => boolean;
    dependency?: (fp: string) => void;
    tag: (tag: EmbeddedGraphqlDocument) => void | Promise<void>;
};
export declare function find_graphql(config: Config, parsedScript: Script, walker: GraphqlTagWalker): Promise<void>;
export {};
