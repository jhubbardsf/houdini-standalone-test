import { Config, CollectedGraphQLDocument } from '../../lib';
export default function paginate(config: Config, documents: CollectedGraphQLDocument[]): Promise<void>;
export declare const pageInfoSelection: {
    kind: "Field";
    name: {
        kind: "Name";
        value: string;
    };
    selectionSet: {
        kind: "SelectionSet";
        selections: ({
            kind: "Field";
            name: {
                kind: "Name";
                value: string;
            };
            selectionSet?: undefined;
        } | {
            kind: "Field";
            name: {
                kind: "Name";
                value: string;
            };
            selectionSet: {
                kind: "SelectionSet";
                selections: {
                    kind: "Field";
                    name: {
                        kind: "Name";
                        value: string;
                    };
                }[];
            };
        })[];
    };
}[];
