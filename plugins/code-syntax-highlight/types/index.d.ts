import type { PluginContext, PluginInfo } from '@toast-ui/editor';
import Prism from 'prismjs';

type PrismJs = typeof Prism & {
  manual: boolean;
};

type CustomAttributes = {
  pre?: Record<string, string>;
  code?: Record<string, string>;
};

declare global {
  interface Window {
    Prism: PrismJs;
  }
}

export type PluginOptions = {
  highlighter?: PrismJs;
  customAttributes?: CustomAttributes;
};

export default function codeSyntaxHighlightPlugin(
  context: PluginContext,
  options: PluginOptions
): PluginInfo;
