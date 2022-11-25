import graphql from 'graphql';
import * as recast from 'recast';
import { ArtifactKind, BaseCompiledDocument } from '../runtime/lib/types';
import type { Config } from './config';
declare type Program = recast.types.namedTypes.Program;
export declare type Maybe<T> = T | null | undefined;
export declare type Script = Program;
export declare type TransformDocument = {
    instance: Maybe<Script>;
    config: Config;
    dependencies: string[];
    filename: string;
};
export declare type CollectedGraphQLDocument = {
    kind: ArtifactKind;
    filename: string;
    name: string;
    document: graphql.DocumentNode;
    originalDocument: graphql.DocumentNode;
    generateArtifact: boolean;
    generateStore: boolean;
    originalString: string;
    refetch?: BaseCompiledDocument['refetch'];
};
export * from '../runtime/lib/types';
export * from '../runtime/lib/config';
