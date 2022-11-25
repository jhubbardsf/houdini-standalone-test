import type { Config } from './config';
export declare type Transform<_TransformType> = null | ((config: Config, documents: _TransformType) => Promise<void>);
export declare function runPipeline<_TransformType>(config: Config, pipeline: Transform<_TransformType>[], target: _TransformType): Promise<void>;
