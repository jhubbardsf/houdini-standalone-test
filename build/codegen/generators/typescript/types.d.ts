import type { TSTypeKind } from 'ast-types/gen/kinds';
import * as graphql from 'graphql';
import * as recast from 'recast';
import { Config } from '../../../lib';
export declare function readonlyProperty(prop: recast.types.namedTypes.TSPropertySignature, enable?: boolean): recast.types.namedTypes.TSPropertySignature;
export declare function nullableField(inner: TSTypeKind, input?: boolean): recast.types.namedTypes.TSUnionType;
export declare function scalarPropertyValue(config: Config, missingScalars: Set<string>, target: graphql.GraphQLNamedType): TSTypeKind;
export declare function enumDeclaration(type: graphql.GraphQLEnumType): recast.types.namedTypes.TSEnumDeclaration;
