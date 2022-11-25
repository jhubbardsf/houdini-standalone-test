import graphql from 'graphql';
import { Config, CollectedGraphQLDocument } from '../../lib';
export declare type FragmentDependency = {
    definition: graphql.FragmentDefinitionNode;
    requiredFragments: string[];
    document: CollectedGraphQLDocument;
};
export default function includeFragmentDefinitions(config: Config, documents: CollectedGraphQLDocument[]): Promise<void>;
export declare function collectFragments(config: Config, docs: CollectedGraphQLDocument[]): Record<string, FragmentDependency>;
