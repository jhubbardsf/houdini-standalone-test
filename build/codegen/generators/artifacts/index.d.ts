import { Config, CollectedGraphQLDocument } from '../../../lib';
export default function artifactGenerator(stats: {
    total: string[];
    new: string[];
    changed: string[];
    deleted: string[];
}): (config: Config, docs: CollectedGraphQLDocument[]) => Promise<void>;
