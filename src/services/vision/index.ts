import type { GeneratedPromptResponse, GenerationOptions } from '../../types.ts';
import { CloudflareLlavaProvider } from './CloudflareLlavaProvider.ts';
import type { VisionProvider } from './types.ts';

export * from './types.ts';
export * from './CloudflareLlavaProvider.ts';
export * from './promptEngine.ts';
export * from './promptTemplates.ts';

// Default vision provider configured for Cloudflare Workers AI
const defaultProvider: VisionProvider = new CloudflareLlavaProvider();

/**
 * High-level vision analysis function used across UI components.
 * Calls the active vision provider without coupling UI to a specific model.
 */
export async function analyzeImage(
  image: File | Blob | string,
  options: GenerationOptions,
  customProvider?: VisionProvider
): Promise<GeneratedPromptResponse> {
  const provider = customProvider || defaultProvider;
  return provider.analyzeImage(image, options);
}
