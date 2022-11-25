import type { Config } from '../../lib/config';
import type { CollectedGraphQLDocument } from '../../lib/types';
export default function validatePlugins(config: Config, documents: CollectedGraphQLDocument[]): Promise<void>;
