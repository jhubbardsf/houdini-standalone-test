import * as graphql from 'graphql';
import { Config } from '../../../lib';
import { MutationOperation } from '../../../runtime/lib/types';
export declare function operationsByPath(config: Config, filepath: string, definition: graphql.OperationDefinitionNode, filterTypes: FilterMap): {
    [path: string]: MutationOperation[];
};
export declare type FilterMap = {
    [listName: string]: {
        [filterName: string]: 'String' | 'Float' | 'Int' | 'Boolean';
    };
};
