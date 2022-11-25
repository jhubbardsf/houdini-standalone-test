import * as graphql from 'graphql';
import { Config, CollectedGraphQLDocument } from '../../lib';
import { FragmentDependency } from './composeQueries';
export default function fragmentVariables(config: Config, documents: CollectedGraphQLDocument[]): Promise<void>;
declare type ValueMap = Record<string, graphql.ValueNode>;
export declare function inlineFragmentArgs({ config, filepath, fragmentDefinitions, document, generatedFragments, visitedFragments, scope, newName, }: {
    config: Config;
    filepath: string;
    fragmentDefinitions: Record<string, FragmentDependency>;
    document: graphql.ASTNode;
    generatedFragments: Record<string, graphql.FragmentDefinitionNode>;
    visitedFragments: Set<string>;
    scope: ValueMap | undefined | null;
    newName?: string;
}): any;
export declare function withArguments(config: Config, node: graphql.FragmentSpreadNode): graphql.ArgumentNode[];
export declare type FragmentArgument = {
    name: string;
    type: string;
    required: boolean;
    defaultValue: graphql.ValueNode | null;
};
export declare function fragmentArguments(config: Config, filepath: string, definition: graphql.FragmentDefinitionNode): FragmentArgument[];
export declare function collectWithArguments(config: Config, filepath: string, node: graphql.FragmentSpreadNode, scope?: ValueMap | null): {
    args: ValueMap | null;
    hash: string;
};
export {};
