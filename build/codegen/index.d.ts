import { Config, CollectedGraphQLDocument } from '../lib';
export default function compile(config: Config): Promise<void>;
export declare function runPipeline(config: Config, docs: CollectedGraphQLDocument[]): Promise<void>;
export declare type DiscoveredDoc = {
    filepath: string;
    document: string;
};
