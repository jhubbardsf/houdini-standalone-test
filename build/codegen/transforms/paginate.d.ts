import * as graphql from 'graphql';
import { Config, CollectedGraphQLDocument } from '../../lib';
export default function paginate(config: Config, documents: CollectedGraphQLDocument[]): Promise<void>;
export declare const pageInfoSelection: {
    kind: graphql.Kind;
    name: {
        kind: graphql.Kind;
        value: string;
    };
    selectionSet: {
        kind: graphql.Kind;
        selections: ({
            kind: graphql.Kind;
            name: {
                kind: graphql.Kind;
                value: string;
            };
            selectionSet?: undefined;
        } | {
            kind: graphql.Kind;
            name: {
                kind: graphql.Kind;
                value: string;
            };
            selectionSet: {
                kind: graphql.Kind;
                selections: {
                    kind: graphql.Kind;
                    name: {
                        kind: graphql.Kind;
                        value: string;
                    };
                }[];
            };
        })[];
    };
}[];
