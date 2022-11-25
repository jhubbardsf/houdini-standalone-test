import type { TSTypeKind } from 'ast-types/gen/kinds';
import * as graphql from 'graphql';
import { Config } from '../../../lib';
export declare function tsTypeReference(config: Config, missingScalars: Set<string>, definition: {
    type: graphql.TypeNode;
}): TSTypeKind;
