import * as graphql from 'graphql';
import { Config, CollectedGraphQLDocument } from '../../../lib';
import type { MutationOperation, SubscriptionSelection } from '../../../runtime/lib/types';
export default function selection({ config, filepath, rootType, selections, operations, path, includeFragments, document, markEdges, }: {
    config: Config;
    filepath: string;
    rootType: string;
    selections: readonly graphql.SelectionNode[];
    operations: {
        [path: string]: MutationOperation[];
    };
    path?: string[];
    includeFragments: boolean;
    document: CollectedGraphQLDocument;
    markEdges?: string;
}): SubscriptionSelection;
