import * as graphql from 'graphql';
import { Config } from '../../lib';
export declare function flattenSelections({ config, filepath, selections, fragmentDefinitions, }: {
    config: Config;
    filepath: string;
    selections: readonly graphql.SelectionNode[];
    fragmentDefinitions: {
        [name: string]: graphql.FragmentDefinitionNode;
    };
}): readonly graphql.SelectionNode[];
