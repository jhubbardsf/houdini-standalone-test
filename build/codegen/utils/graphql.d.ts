import * as graphql from 'graphql';
import { Config } from '../../lib';
export declare function unwrapType(config: Config, type: any, wrappers?: TypeWrapper[]): {
    type: graphql.GraphQLNamedType;
    wrappers: TypeWrapper[];
};
export declare function wrapType({ type, wrappers, }: {
    type: graphql.GraphQLNamedType;
    wrappers: TypeWrapper[];
}): graphql.TypeNode;
export declare enum TypeWrapper {
    Nullable = "Nullable",
    List = "List",
    NonNull = "NonNull"
}
