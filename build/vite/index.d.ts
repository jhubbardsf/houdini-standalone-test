import type { Plugin } from 'vite';
import { PluginConfig } from '../lib';
export * from './ast';
export * from './imports';
export * from './schema';
export * from './houdini';
export default function (opts?: PluginConfig): Plugin[];
