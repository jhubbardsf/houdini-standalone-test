import * as graphql from 'graphql';
import { Config, CollectedGraphQLDocument } from '../../lib';
export default function addListFragments(config: Config, documents: CollectedGraphQLDocument[]): Promise<void>;
export declare function connectionSelection(config: Config, field: graphql.GraphQLField<any, any>, type: graphql.GraphQLObjectType, selection: graphql.SelectionSetNode | undefined): {
    selection: graphql.SelectionSetNode | undefined;
    type: graphql.GraphQLObjectType;
    connection: boolean;
    error: string | null;
};
