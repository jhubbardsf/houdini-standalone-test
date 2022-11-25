import { Config, CollectedGraphQLDocument } from '../lib';
import { ConfigFile } from '../runtime/lib/config';
export declare function testConfigFile(config?: Partial<ConfigFile>): ConfigFile;
export declare function testConfig(config?: Partial<ConfigFile>): Config;
declare type Partial<T> = {
    [P in keyof T]?: T[P];
};
export declare function pipelineTest(config: Config, documents: string[], shouldPass: boolean, testBody?: ((result: Error | Error[]) => void) | ((docs: CollectedGraphQLDocument[]) => void)): () => Promise<void>;
export declare function mockCollectedDoc(query: string): CollectedGraphQLDocument;
export declare function clearMock(): void;
export {};
