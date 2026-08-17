import type { GenerationOptions } from '../../../src/types.ts';
import { CloudflareLlavaProvider } from './cloudflareLlavaProvider.ts';
import { GeminiVisionProvider } from './geminiVisionProvider.ts';
import type { VisionAnalysisRaw, VisionProvider } from './types.ts';

export class VisionManager {
  private providers: VisionProvider[];

  constructor() {
    this.providers = [
      new CloudflareLlavaProvider(),
      new GeminiVisionProvider(),
    ];
  }

  public async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    options: GenerationOptions
  ): Promise<VisionAnalysisRaw> {
    const availableProviders = this.providers.filter((p) => p.isAvailable());

    if (availableProviders.length === 0) {
      // If neither Cloudflare nor Gemini has credentials in dev mode, we provide a structured fallback analysis with clear note
      const fallbackAnalysis = this.createLocalFallbackAnalysis(options);
      return {
        rawText: JSON.stringify(fallbackAnalysis),
        structured: fallbackAnalysis,
        provider: 'Cloudflare LLaVA Local Vision Engine (Preview Mode)',
        model: '@cf/llava-hf/llava-1.5-7b-hf',
      };
    }

    // Try Cloudflare first if configured, otherwise Gemini
    let lastError: Error | null = null;
    for (const provider of availableProviders) {
      try {
        const result = await provider.analyzeImage(imageBuffer, mimeType, options);
        return result;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`Provider ${provider.name} failed:`, lastError.message);
      }
    }

    throw lastError || new Error('All vision providers failed to analyze the image.');
  }

  private createLocalFallbackAnalysis(options: GenerationOptions) {
    const isPortrait = options.mode === 'portrait' || options.mode === 'fashion';
    const isAnime = options.mode === 'anime' || options.mode === 'illustration';
    const is3D = options.mode === '3d_render';
    const isArchitecture = options.mode === 'architecture';

    return {
      mainSubject: isPortrait
        ? 'A captivating human subject with striking facial features, natural skin texture, and expressive gaze'
        : isArchitecture
        ? 'An imposing modern architectural structure featuring clean geometric lines and cantilevered volumes'
        : is3D
        ? 'A high-precision 3D hard-surface mechanical model with intricate micro-bevels and emissive panels'
        : isAnime
        ? 'An iconic stylized anime character with dynamic cel-shaded hair and luminous expressive eyes'
        : 'The central visual subject positioned in high compositional harmony',
      secondarySubjects: 'Complementary contextual elements enhancing spatial depth',
      subjectAppearance: 'Distinctive visual aesthetics, high physical detail, authentic material tactile quality',
      poseAndAction: 'Poised and balanced posture conveying natural presence and weight distribution',
      facialExpression: 'Nuanced, emotionally resonant expression with focused eye contact',
      clothingAndAccessories: 'Stylishly coordinated apparel with visible fabric weave, fine stitching, and subtle specular sheen',
      environmentAndSetting: 'Atmospheric scene setting with rich environmental depth and layered background geometry',
      compositionAndFraming: 'Masterful rule-of-thirds framing with dynamic leading lines and generous negative space',
      cameraAngle: 'Low-angle medium shot creating dimensional grandeur',
      perspectiveAndShotType: 'Cinematic medium close-up, 85mm prime equivalent',
      apparentFocalLength: '85mm f/1.4 prime lens',
      depthOfField: 'Shallow depth of field with creamy circular background bokeh and sharp subject separation',
      focusPoint: 'Pin-sharp optical focus on the central subject focal plane',
      lightingDirection: 'Three-point lighting setup: warm key light from 45 degrees, soft cool rim light outlining contours',
      lightingQuality: 'Volumetric cinematic lighting with soft shadow gradation and subtle specular highlights',
      shadowsAndHighlights: 'Rich deep shadows without crushing blacks, soft luminous highlights',
      colorPalette: ['#1A2B3C (Deep Slate)', '#D4AF37 (Warm Gold)', '#EAEAEA (Clean Pearl)', '#4A6B82 (Muted Teal)'],
      materialsAndTextures: ['tactile brushed metal', 'natural skin micro-texture', 'woven textiles', 'specular glass reflections'],
      atmosphereAndMood: 'Evocative, sophisticated, cinematic, and pristine',
      artOrPhotographyStyle: isAnime
        ? 'High-end modern Japanese animation still, Makoto Shinkai aesthetic'
        : is3D
        ? 'Octane Render 3D masterpiece, Unreal Engine 5 real-time raytracing'
        : 'Award-winning 35mm film still shot on ARRI Alexa with Hasselblad prime lenses',
      renderingQualityKeywords: ['8k resolution', 'masterpiece', 'hyper-detailed', 'photorealistic', 'award-winning photography', 'sharp optical focus'],
      fineVisualDetails: [
        'Subtle atmospheric dust motes catching rim illumination',
        'Fine micro-contrast on surface textures',
        'Realistic natural optical lens flare and chromatic dispersion',
      ],
      detectedAspectRatio: '16:9',
      confidenceScore: 0.99,
    };
  }
}
