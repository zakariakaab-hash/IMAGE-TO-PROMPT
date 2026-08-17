import type { GeneratedPromptResponse, GenerationOptions } from '../../types.ts';

export interface VisionProvider {
  name: string;
  modelIdentifier: string;
  analyzeImage(
    image: File | Blob | string,
    options: GenerationOptions
  ): Promise<GeneratedPromptResponse>;
}
