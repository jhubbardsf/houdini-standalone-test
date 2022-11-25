import type { TSTypeKind, StatementKind } from 'ast-types/gen/kinds';
import * as graphql from 'graphql';
import { Config } from '../../../lib';
export declare const fragmentKey = "$fragments";
export declare function inlineType({ config, filepath, rootType, selections, root, allowReadonly, body, visitedTypes, missingScalars, includeFragments, allOptional, }: {
    config: Config;
    filepath: string;
    rootType: graphql.GraphQLNamedType;
    selections: readonly graphql.SelectionNode[] | undefined;
    root: boolean;
    allowReadonly: boolean;
    body: StatementKind[];
    visitedTypes: Set<string>;
    missingScalars: Set<string>;
    includeFragments: boolean;
    allOptional?: boolean;
}): TSTypeKind;
export declare function selectionTypeInfo(schema: graphql.GraphQLSchema, filepath: string, rootType: graphql.GraphQLObjectType<any, any>, selection: graphql.SelectionNode): {
    field: graphql.GraphQLField<any, any>;
    type: graphql.GraphQLNamedType;
};
