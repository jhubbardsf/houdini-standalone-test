import type { StatementKind } from 'ast-types/gen/kinds';
import * as graphql from 'graphql';
import { Config } from '../../../lib';
export declare function addReferencedInputTypes(config: Config, filepath: string, body: StatementKind[], visitedTypes: Set<string>, missingScalars: Set<string>, rootType: graphql.TypeNode): void;
