import type { GenerationOptions, VisionAnalysisResult } from '../../../src/types.ts';

export interface VisionProviderOptions {
  options: GenerationOptions;
}

export interface VisionAnalysisRaw {
  rawText: string;
  structured: VisionAnalysisResult;
  provider: string;
  model: string;
}

export interface VisionProvider {
  name: string;
  modelIdentifier: string;
  isAvailable(): Promise<boolean> | boolean;
  analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    options: GenerationOptions
  ): Promise<VisionAnalysisRaw>;
}
