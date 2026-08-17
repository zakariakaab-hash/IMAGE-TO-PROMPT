import type { GeneratedPromptResponse, GenerationOptions } from '../../types.ts';
import { optimizeImageForAI } from '../../lib/imageOptimizer.ts';
import type { VisionProvider } from './types.ts';

export class CloudflareLlavaProvider implements VisionProvider {
  public name = 'Cloudflare Workers AI (LLaVA)';
  public modelIdentifier = '@cf/llava-hf/llava-1.5-7b-hf';

  /**
   * Calls the Cloudflare Worker `/api/generate` endpoint using standard Web Fetch & FormData APIs.
   * Automatically ensures image payload is optimized (< 1.2MB, <= 1536px) before network transmission.
   */
  public async analyzeImage(
    image: File | Blob | string,
    options: GenerationOptions
  ): Promise<GeneratedPromptResponse> {
    let response: Response;

    if (image instanceof File || image instanceof Blob) {
      let imageToUpload: File | Blob = image;

      // Ensure any direct callers also benefit from client optimization
      if (typeof window !== 'undefined' && image.size > 1.2 * 1024 * 1024) {
        try {
          const opt = await optimizeImageForAI(image, { maxDimension: 1536, maxBytes: 1.2 * 1024 * 1024 });
          imageToUpload = opt.file;
        } catch {
          // Fallback to original
        }
      }

      const formData = new FormData();
      formData.append('image', imageToUpload);
      formData.append('mode', options.mode);
      formData.append('targetModel', options.targetModel);
      formData.append('detailLevel', options.detailLevel);
      formData.append('includeNegative', String(options.includeNegative));
      formData.append('language', options.language);
      if (options.aspectRatioHint) {
        formData.append('aspectRatioHint', options.aspectRatioHint);
      }
      if (options.customInstructions) {
        formData.append('customInstructions', options.customInstructions);
      }

      response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
    } else if (typeof image === 'string') {
      // Base64 or URL data string
      response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: image,
          ...options,
        }),
      });
    } else {
      throw new Error('Unsupported image input format provided.');
    }

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as { error?: string };
      const rawError = errorData.error || `Worker responded with HTTP status ${response.status}`;
      
      // Friendly message for large payloads
      if (response.status === 413 || rawError.includes('3006') || rawError.toLowerCase().includes('too large')) {
        throw new Error('Image is too large for AI processing. Please upload a smaller image or try again.');
      }
      
      throw new Error(rawError);
    }

    const result = (await response.json()) as GeneratedPromptResponse;
    return result;
  }
}

