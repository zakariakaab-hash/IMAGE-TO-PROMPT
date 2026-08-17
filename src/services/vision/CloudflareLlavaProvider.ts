import type { GeneratedPromptResponse, GenerationOptions } from '../../types.ts';
import type { VisionProvider } from './types.ts';

export class CloudflareLlavaProvider implements VisionProvider {
  public name = 'Cloudflare Workers AI (LLaVA)';
  public modelIdentifier = '@cf/llava-hf/llava-1.5-7b-hf';

  /**
   * Calls the Cloudflare Worker `/api/generate` endpoint using standard Web Fetch & FormData APIs.
   */
  public async analyzeImage(
    image: File | Blob | string,
    options: GenerationOptions
  ): Promise<GeneratedPromptResponse> {
    let response: Response;

    if (image instanceof File || image instanceof Blob) {
      const formData = new FormData();
      formData.append('image', image);
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
      throw new Error(errorData.error || `Worker responded with HTTP status ${response.status}`);
    }

    const result = (await response.json()) as GeneratedPromptResponse;
    return result;
  }
}
