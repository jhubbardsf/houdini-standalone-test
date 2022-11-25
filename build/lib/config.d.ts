import * as graphql from 'graphql';
import type { CustomPluginOptions, LoadResult, ObjectHook, PluginContext, ResolveIdResult } from 'rollup';
import { ConfigFile, CachePolicy } from '../runtime/lib';
import { TransformPage } from '../vite/houdini';
import { CollectedGraphQLDocument } from './types';
export declare class Config {
    filepath: string;
    rootDir: string;
    projectRoot: string;
    schema: graphql.GraphQLSchema;
    apiUrl?: string;
    schemaPath?: string;
    persistedQueryPath?: string;
    exclude: string[];
    scalars?: ConfigFile['scalars'];
    module: 'commonjs' | 'esm';
    cacheBufferSize?: number;
    defaultCachePolicy: CachePolicy;
    defaultPartial: boolean;
    definitionsFolder?: string;
    newSchema: string;
    newDocuments: string;
    defaultKeys: string[];
    typeConfig: ConfigFile['types'];
    configFile: ConfigFile;
    logLevel: LogLevel;
    disableMasking: boolean;
    configIsRoute: ((filepath: string) => boolean) | null;
    routesDir: string;
    schemaPollInterval: number | null;
    schemaPollHeaders: Record<string, string | ((env: any) => string)>;
    pluginMode: boolean;
    plugins: (Plugin & {
        name: string;
        include_runtime: boolean;
        version: string;
        directory: string;
    })[];
    constructor({ filepath, loadFrameworkConfig, ...configFile }: ConfigFile & {
        filepath: string;
        loadFrameworkConfig?: boolean;
    });
    get include(): string[];
    pluginConfig<ConfigType extends {}>(name: string): ConfigType;
    get pullHeaders(): any;
    sourceFiles(): Promise<string[]>;
    get artifactDirectory(): string;
    get artifactDirectoryName(): string;
    get artifactTypeDirectory(): string;
    get runtimeDirectory(): string;
    get definitionsDirectory(): string;
    get enumRuntimeDefinitionsPath(): string;
    get enumTypesDefinitionsPath(): string;
    get definitionsSchemaPath(): string;
    get definitionsDocumentsPath(): string;
    get typeIndexPath(): string;
    get typeRootDir(): string;
    get typeRootFile(): string;
    findModule(pkg?: string, currentLocation?: string): string;
    get runtimeSource(): string;
    artifactTypePath(document: graphql.DocumentNode): string;
    artifactPath(document: graphql.DocumentNode): string;
    artifactImportPath(name: string): string;
    keyFieldsForType(type: string): string[];
    computeID(type: string, data: any): string;
    documentName(document: graphql.DocumentNode): string;
    isSelectionScalar(type: string): boolean;
    createDirectories(): void;
    get compiledAssetsDir(): string;
    compiledAssetPath(filepath: string): string;
    includeFile(filepath: string, { root, ignore_plugins, }?: {
        root?: string;
        ignore_plugins?: boolean;
    }): boolean;
    pluginRuntimeDirectory(name: string): string;
    pluginDirectory(name: string): string;
    get houdiniDirective(): string;
    get listDirective(): string;
    get listPrependDirective(): string;
    get listAppendDirective(): string;
    get listParentDirective(): string;
    get listDirectiveParentIDArg(): string;
    get listNameArg(): string;
    get insertFragmentSuffix(): string;
    get removeFragmentSuffix(): string;
    get toggleFragmentSuffix(): string;
    get deleteDirectiveSuffix(): string;
    get whenDirective(): string;
    get whenNotDirective(): string;
    get argumentsDirective(): string;
    get withDirective(): string;
    get paginateDirective(): string;
    get paginateNameArg(): string;
    get cacheDirective(): string;
    get cachePartialArg(): string;
    get cachePolicyArg(): string;
    paginationQueryName(documentName: string): string;
    isDeleteDirective(name: string): boolean;
    listDeleteDirective(name: string): string;
    deleteDirectiveType(name: string): string;
    isInsertFragment(name: string): boolean;
    listInsertFragment(name: string): string;
    listToggleFragment(name: string): string;
    isRemoveFragment(name: string): boolean;
    isToggleFragment(name: string): boolean;
    listRemoveFragment(name: string): string;
    isInternalEnum(node: graphql.EnumTypeDefinitionNode): boolean;
    isInternalDirective({ name }: graphql.DirectiveNode): boolean;
    isListFragment(name: string): boolean;
    isListOperationDirective(name: string): boolean;
    isFragmentForList(listName: string, fragmentName: string): boolean;
    listOperationFromFragment(fragmentName: string): 'insert' | 'remove' | 'toggle';
    listNameFromDirective(directiveName: string): string;
    listNameFromFragment(fragmentName: string): string;
    extractDefinition(document: graphql.DocumentNode): graphql.ExecutableDefinitionNode;
    extractQueryDefinition(document: graphql.DocumentNode): graphql.OperationDefinitionNode;
    variableFunctionName(name: string): string;
}
export declare function readConfigFile(configPath?: string): Promise<ConfigFile>;
export declare function getConfig({ configPath, noSchema, ...extraConfig }?: PluginConfig & {
    noSchema?: boolean;
}): Promise<Config>;
export declare enum LogLevel {
    Full = "full",
    Summary = "summary",
    ShortSummary = "short-summary",
    Quiet = "quiet"
}
export declare type PluginFactory = (args?: PluginConfig) => Promise<Plugin>;
export declare type Plugin = {
    extensions?: string[];
    transform_runtime?: Record<string, (args: {
        config: Config;
        content: string;
    }) => string>;
    after_load?: (config: Config) => Promise<void> | void;
    extract_documents?: (filepath: string, content: string) => Promise<string[]> | string[];
    generate?: GenerateHook;
    transform_file?: (page: TransformPage) => Promise<{
        code: string;
    }> | {
        code: string;
    };
    index_file?: ModuleIndexTransform;
    validate?: (args: {
        config: Config;
        documents: CollectedGraphQLDocument[];
    }) => Promise<void> | void;
    vite?: {
        resolveId?: ObjectHook<(this: PluginContext, source: string, importer: string | undefined, options: {
            config: Config;
            custom?: CustomPluginOptions;
            ssr?: boolean;
            isEntry: boolean;
        }) => Promise<ResolveIdResult> | ResolveIdResult>;
        load?: ObjectHook<(this: PluginContext, id: string, options: {
            config: Config;
            ssr?: boolean;
        }) => Promise<LoadResult> | LoadResult>;
    };
    include?: (config: Config, filepath: string) => boolean | null | undefined;
};
declare type ModuleIndexTransform = (arg: {
    config: Config;
    content: string;
    export_default_as(args: {
        module: string;
        as: string;
    }): string;
    export_star_from(args: {
        module: string;
    }): string;
    plugin_root: string;
    typedef: boolean;
    documents: CollectedGraphQLDocument[];
}) => string;
export declare type GenerateHook = (args: GenerateHookInput) => Promise<void> | void;
export declare type GenerateHookInput = {
    config: Config;
    documents: CollectedGraphQLDocument[];
    plugin_root: string;
};
export declare type PluginConfig = {
    configPath?: string;
} & Partial<ConfigFile>;
export {};
