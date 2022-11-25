import * as graphql from 'graphql';
export declare function getRootType(type: graphql.GraphQLType): graphql.GraphQLType;
export declare function hashDocument(document: string | graphql.DocumentNode): string;
declare type GraphQLParentType = graphql.GraphQLObjectType | graphql.GraphQLInputObjectType | graphql.GraphQLInterfaceType;
export declare function parentTypeFromAncestors(schema: graphql.GraphQLSchema, filepath: string, ancestors: readonly any[]): GraphQLParentType;
export declare function definitionFromAncestors(ancestors: readonly any[]): graphql.OperationDefinitionNode | graphql.FragmentDefinitionNode;
export declare function formatErrors(e: unknown, afterError?: (e: Error) => void): void;
export declare function operation_requires_variables(operation: graphql.OperationDefinitionNode): boolean;
export {};
