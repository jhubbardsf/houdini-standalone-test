import type { ExpressionKind } from 'ast-types/gen/kinds';
import * as graphql from 'graphql';
export declare function serializeValue(value: any): ExpressionKind;
export declare function deepMerge(filepath: string, ...targets: {}[]): {};
export declare function convertValue(val: graphql.ValueNode): {
    kind: string | undefined;
    value: string | number | boolean | undefined;
};
