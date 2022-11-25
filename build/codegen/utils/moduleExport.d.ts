import type { ExpressionKind } from 'ast-types/gen/kinds';
import * as recast from 'recast';
import { Config } from '../../lib';
export declare function moduleExport(config: Config, key: string, value: ExpressionKind): recast.types.namedTypes.ExpressionStatement | recast.types.namedTypes.ExportNamedDeclaration | recast.types.namedTypes.ExportDefaultDeclaration;
