import type { Plugin as VitePlugin } from 'vite';
import { Config, PluginConfig } from '../lib';
export default function Plugin(opts?: PluginConfig): VitePlugin;
export interface TransformPage {
    config: Config;
    content: string;
    filepath: string;
    watch_file: (path: string) => void;
}
