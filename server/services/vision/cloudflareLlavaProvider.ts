import type { GenerationOptions, VisionAnalysisResult } from '../../../src/types.ts';
import { VISION_SYSTEM_ANALYSIS_PROMPT } from './promptTemplates.ts';
import type { VisionAnalysisRaw, VisionProvider } from './types.ts';

export class CloudflareLlavaProvider implements VisionProvider {
  public name = 'Cloudflare Workers AI (LLaVA)';
  public modelIdentifier = '@cf/llava-hf/llava-1.5-7b-hf';

  private accountId?: string;
  private apiToken?: string;
  private gatewayUrl?: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN;
    this.gatewayUrl = process.env.CLOUDFLARE_AI_GATEWAY;
  }

  public isAvailable(): boolean {
    return Boolean(this.accountId && this.apiToken);
  }

  public async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    options: GenerationOptions
  ): Promise<VisionAnalysisRaw> {
    if (!this.isAvailable()) {
      throw new Error(
        'Cloudflare Workers AI credentials missing. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN or use the default Gemini vision provider.'
      );
    }

    const endpoint = this.gatewayUrl
      ? `${this.gatewayUrl}/@cf/llava-hf/llava-1.5-7b-hf`
      : `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/@cf/llava-hf/llava-1.5-7b-hf`;

    // Convert buffer to unsigned 8-bit integer array for Cloudflare Workers AI LLaVA endpoint
    const imageArray = Array.from(new Uint8Array(imageBuffer));

    const promptText = `${VISION_SYSTEM_ANALYSIS_PROMPT}

USER REQUESTED MODE: ${options.mode.toUpperCase()}
TARGET IMAGE GENERATION MODEL: ${options.targetModel.toUpperCase()}
LANGUAGE: ${options.language.toUpperCase()}

Please deconstruct this image completely and return only the valid JSON.`;

    const payload = {
      image: imageArray,
      prompt: promptText,
      max_tokens: 1500,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(
        `Cloudflare Workers AI request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = (await response.json()) as {
      result?: { description?: string; response?: string };
      success?: boolean;
      errors?: Array<{ message: string }>;
    };

    const rawOutput =
      data.result?.description ||
      data.result?.response ||
      JSON.stringify(data.result || data);

    const structured = this.parseStructuredOutput(rawOutput);

    return {
      rawText: rawOutput,
      structured,
      provider: 'Cloudflare Workers AI',
      model: this.modelIdentifier,
    };
  }

  private parseStructuredOutput(text: string): VisionAnalysisResult {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          mainSubject: parsed.mainSubject || 'Main photographic subject',
          secondarySubjects: parsed.secondarySubjects || '',
          subjectAppearance: parsed.subjectAppearance || '',
          ageApproximation: parsed.ageApproximation || '',
          poseAndAction: parsed.poseAndAction || '',
          facialExpression: parsed.facialExpression || '',
          clothingAndAccessories: parsed.clothingAndAccessories || '',
          environmentAndSetting: parsed.environmentAndSetting || 'Studio setting',
          foregroundDetails: parsed.foregroundDetails || '',
          backgroundDetails: parsed.backgroundDetails || '',
          compositionAndFraming: parsed.compositionAndFraming || 'Centered composition',
          cameraAngle: parsed.cameraAngle || 'Eye level',
          perspectiveAndShotType: parsed.perspectiveAndShotType || 'Medium shot',
          apparentFocalLength: parsed.apparentFocalLength || '50mm standard prime',
          depthOfField: parsed.depthOfField || 'Natural depth of field',
          focusPoint: parsed.focusPoint || 'Sharp focus on subject',
          lightingDirection: parsed.lightingDirection || 'Directional ambient lighting',
          lightingQuality: parsed.lightingQuality || 'Soft diffuse illumination',
          shadowsAndHighlights: parsed.shadowsAndHighlights || 'Balanced contrast',
          colorPalette: Array.isArray(parsed.colorPalette)
            ? parsed.colorPalette
            : ['Natural tones', 'Neutral gray'],
          materialsAndTextures: Array.isArray(parsed.materialsAndTextures)
            ? parsed.materialsAndTextures
            : ['Smooth textures'],
          atmosphereAndMood: parsed.atmosphereAndMood || 'Neutral',
          artOrPhotographyStyle:
            parsed.artOrPhotographyStyle || 'Digital photography',
          renderingQualityKeywords: Array.isArray(parsed.renderingQualityKeywords)
            ? parsed.renderingQualityKeywords
            : ['high resolution', 'sharp focus'],
          fineVisualDetails: Array.isArray(parsed.fineVisualDetails)
            ? parsed.fineVisualDetails
            : [],
          detectedAspectRatio: parsed.detectedAspectRatio || '1:1',
          confidenceScore: 0.95,
        };
      }
    } catch {
      // Fallback if model output was prose rather than raw JSON
    }

    return {
      mainSubject: text.slice(0, 150),
      environmentAndSetting: 'Detailed photographic environment',
      compositionAndFraming: 'Balanced composition',
      cameraAngle: 'Eye level',
      perspectiveAndShotType: 'Medium shot',
      depthOfField: 'Selective depth of field',
      lightingDirection: 'Frontal directional lighting',
      lightingQuality: 'Soft natural lighting',
      colorPalette: ['Natural realistic tones'],
      materialsAndTextures: ['Detailed organic surfaces'],
      atmosphereAndMood: 'Artistic atmosphere',
      artOrPhotographyStyle: 'High-detail photograph',
      renderingQualityKeywords: ['8k resolution', 'masterpiece', 'sharp focus'],
      fineVisualDetails: [text.slice(0, 300)],
      detectedAspectRatio: '1:1',
    };
  }
}
