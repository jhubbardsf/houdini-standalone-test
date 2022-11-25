import * as graphql from 'graphql';
import { Config, CollectedGraphQLDocument } from '../../lib';
export default function typeCheck(config: Config, docs: CollectedGraphQLDocument[]): Promise<void>;
export declare function getAndVerifyNodeInterface(config: Config): graphql.GraphQLInterfaceType | null;
