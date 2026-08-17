import type {
  GenerationOptions,
  PromptMode,
  SupportedLanguage,
  TargetModel,
  VisionAnalysisResult,
} from '../../types.ts';

export interface EngineeredPromptResult {
  fullPrompt: string;
  positivePrompt: string;
  negativePrompt?: string;
  parameters?: string;
}

export class PromptEngine {
  /**
   * Transforms raw vision decomposition into a model-optimized, high-fidelity prompt.
   */
  public generatePrompt(
    analysis: VisionAnalysisResult,
    options: GenerationOptions
  ): EngineeredPromptResult {
    const { mode, targetModel, detailLevel, includeNegative, language } = options;

    // 1. Build core descriptive segments
    const subjectSegment = this.buildSubjectSegment(analysis, detailLevel);
    const environmentSegment = this.buildEnvironmentSegment(analysis, detailLevel);
    const cameraCompositionSegment = this.buildCameraSegment(analysis, mode);
    const lightingColorSegment = this.buildLightingSegment(analysis);
    const styleAtmosphereSegment = this.buildStyleSegment(analysis, mode);
    const detailsSegment = this.buildDetailsSegment(analysis, detailLevel);

    // 2. Synthesize positive prompt
    let positivePrompt = '';

    if (targetModel === 'flux_1') {
      // Flux prefers flowing, natural language prose descriptions without keyword clutter
      positivePrompt = [
        styleAtmosphereSegment,
        subjectSegment,
        environmentSegment,
        cameraCompositionSegment,
        lightingColorSegment,
        detailsSegment,
      ]
        .filter(Boolean)
        .join('. ')
        .replace(/\.\./g, '.')
        .trim();
    } else if (targetModel === 'midjourney_v6' || mode === 'midjourney') {
      // Midjourney prefers punchy comma-separated phrases, subject first, style, camera, lighting, mood
      positivePrompt = [
        subjectSegment,
        environmentSegment,
        styleAtmosphereSegment,
        cameraCompositionSegment,
        lightingColorSegment,
        detailsSegment,
      ]
        .filter(Boolean)
        .join(', ')
        .replace(/,\s*,/g, ',')
        .trim();
    } else if (targetModel === 'dalle_3' || mode === 'chatgpt_dalle') {
      // DALL-E 3 works best with descriptive visual narrative
      positivePrompt = `A visually striking scene depicting ${subjectSegment}. The setting is ${environmentSegment}. Captured with ${cameraCompositionSegment}. The illumination features ${lightingColorSegment}. The overall aesthetic is ${styleAtmosphereSegment}, complemented by fine details such as ${detailsSegment}.`;
    } else {
      // Stable Diffusion / General
      positivePrompt = [
        analysis.renderingQualityKeywords?.slice(0, 3).join(', '),
        subjectSegment,
        environmentSegment,
        styleAtmosphereSegment,
        cameraCompositionSegment,
        lightingColorSegment,
        detailsSegment,
        analysis.renderingQualityKeywords?.slice(3).join(', '),
      ]
        .filter(Boolean)
        .join(', ')
        .replace(/,\s*,/g, ',')
        .trim();
    }

    // Translate if requested language is not English
    if (language && language !== 'en') {
      positivePrompt = this.translatePrompt(positivePrompt, language);
    }

    // 3. Build model-specific parameters
    const parameters = this.buildParameters(targetModel, mode, analysis.detectedAspectRatio);

    // 4. Build negative prompt if requested or relevant for Stable Diffusion
    let negativePrompt: string | undefined = undefined;
    if (includeNegative || targetModel === 'stable_diffusion_xl' || mode === 'stable_diffusion') {
      negativePrompt = this.buildNegativePrompt(mode, targetModel);
    }

    // 5. Build full display prompt
    let fullPrompt = positivePrompt;
    if (parameters && (targetModel === 'midjourney_v6' || mode === 'midjourney')) {
      fullPrompt = `${positivePrompt} ${parameters}`;
    }

    return {
      fullPrompt,
      positivePrompt,
      negativePrompt,
      parameters,
    };
  }

  private buildSubjectSegment(analysis: VisionAnalysisResult, detailLevel: string): string {
    const parts: string[] = [];

    if (analysis.mainSubject) parts.push(analysis.mainSubject);
    if (analysis.subjectAppearance) parts.push(analysis.subjectAppearance);
    if (analysis.ageApproximation && !analysis.subjectAppearance?.includes(analysis.ageApproximation)) {
      parts.push(analysis.ageApproximation);
    }
    if (analysis.poseAndAction) parts.push(analysis.poseAndAction);
    if (analysis.facialExpression) parts.push(`expression of ${analysis.facialExpression}`);
    if (analysis.clothingAndAccessories) parts.push(`wearing ${analysis.clothingAndAccessories}`);
    if (detailLevel === 'ultra_detailed' && analysis.secondarySubjects) {
      parts.push(`alongside ${analysis.secondarySubjects}`);
    }

    return parts.join(', ');
  }

  private buildEnvironmentSegment(analysis: VisionAnalysisResult, detailLevel: string): string {
    const parts: string[] = [];

    if (analysis.environmentAndSetting) parts.push(`set in ${analysis.environmentAndSetting}`);
    if (detailLevel !== 'concise') {
      if (analysis.foregroundDetails) parts.push(`foreground featuring ${analysis.foregroundDetails}`);
      if (analysis.backgroundDetails) parts.push(`background showing ${analysis.backgroundDetails}`);
    }

    return parts.join(', ');
  }

  private buildCameraSegment(analysis: VisionAnalysisResult, mode: PromptMode): string {
    const parts: string[] = [];

    if (analysis.compositionAndFraming) parts.push(analysis.compositionAndFraming);
    if (analysis.cameraAngle) parts.push(analysis.cameraAngle);
    if (analysis.perspectiveAndShotType) parts.push(analysis.perspectiveAndShotType);

    if (
      mode === 'photorealistic' ||
      mode === 'portrait' ||
      mode === 'cinematic' ||
      mode === 'fashion' ||
      mode === 'product'
    ) {
      if (analysis.apparentFocalLength) parts.push(`shot on ${analysis.apparentFocalLength}`);
      if (analysis.depthOfField) parts.push(analysis.depthOfField);
      if (analysis.focusPoint) parts.push(analysis.focusPoint);
    }

    return parts.join(', ');
  }

  private buildLightingSegment(analysis: VisionAnalysisResult): string {
    const parts: string[] = [];

    if (analysis.lightingQuality) parts.push(analysis.lightingQuality);
    if (analysis.lightingDirection) parts.push(analysis.lightingDirection);
    if (analysis.shadowsAndHighlights) parts.push(analysis.shadowsAndHighlights);

    if (analysis.colorPalette && analysis.colorPalette.length > 0) {
      parts.push(`color grading with ${analysis.colorPalette.slice(0, 4).join(', ')}`);
    }

    return parts.join(', ');
  }

  private buildStyleSegment(analysis: VisionAnalysisResult, mode: PromptMode): string {
    const modeKeywords = this.getModeSpecificKeywords(mode);
    const parts: string[] = [];

    if (analysis.artOrPhotographyStyle) parts.push(analysis.artOrPhotographyStyle);
    if (analysis.atmosphereAndMood) parts.push(`${analysis.atmosphereAndMood} atmosphere`);
    if (modeKeywords) parts.push(modeKeywords);

    return parts.join(', ');
  }

  private buildDetailsSegment(analysis: VisionAnalysisResult, detailLevel: string): string {
    if (detailLevel === 'concise') return '';

    const parts: string[] = [];
    if (analysis.materialsAndTextures && analysis.materialsAndTextures.length > 0) {
      parts.push(`textures of ${analysis.materialsAndTextures.slice(0, 3).join(', ')}`);
    }
    if (analysis.fineVisualDetails && analysis.fineVisualDetails.length > 0) {
      const detailsCount = detailLevel === 'ultra_detailed' ? 4 : 2;
      parts.push(analysis.fineVisualDetails.slice(0, detailsCount).join(', '));
    }

    return parts.join(', ');
  }

  private getModeSpecificKeywords(mode: PromptMode): string {
    switch (mode) {
      case 'photorealistic':
        return 'hyperrealistic 35mm photograph, authentic micro-textures, natural optical distortion, sub-surface scattering, award-winning photography';
      case 'cinematic':
        return '35mm anamorphic film still, ARRI Alexa LF, cinematic color grade, Kodak Vision3 500T, film grain, dramatic composition';
      case 'portrait':
        return 'editorial studio portrait, 85mm f/1.2 lens, soft beauty lighting, catchlights in eyes, ultra-fine skin pores, high fashion vogue aesthetic';
      case 'product':
        return 'clean commercial product photography, studio lightbox, crisp edge highlights, spotless reflections, luxury advertising aesthetic';
      case 'fashion':
        return 'high-end haute couture fashion editorial, dramatic model posing, runway aesthetic, impeccable fabric drape, Harper’s Bazaar style';
      case 'advertising':
        return 'dynamic commercial advertising hero shot, vibrant balanced color palette, pristine product placement, high visual impact';
      case 'architecture':
        return 'architectural digest photography, tilt-shift perspective control lens, structural symmetry, balanced ambient interior lighting, material honesty';
      case 'anime':
        return 'masterpiece anime key visual, crisp cel shading, Makoto Shinkai and Ufotable aesthetic, luminous highlights, detailed background art';
      case 'illustration':
        return 'contemporary digital concept illustration, expressive brushwork, intricate line art, harmonious gouache color harmony';
      case '3d_render':
        return 'Octane Render 3D artwork, Unreal Engine 5.4 Lumen global illumination, ray-traced reflections, PBR materials, 8k CGI';
      case 'concept_art':
        return 'sci-fi concept art, matte painting, atmospheric perspective, cinematic environmental storytelling, ArtStation trending';
      case 'midjourney':
        return 'photorealistic editorial capture, balanced tonal harmony, hyper-detailed';
      case 'flux':
        return 'hyper-detailed high-fidelity photographic capture, authentic natural lighting';
      case 'stable_diffusion':
        return 'masterpiece, best quality, highly detailed, sharp focus';
      default:
        return 'high quality, detailed visual aesthetic, clean composition';
    }
  }

  private buildParameters(
    targetModel: TargetModel,
    mode: PromptMode,
    aspectRatio?: string
  ): string {
    const ar = aspectRatio || (mode === 'cinematic' ? '16:9' : mode === 'portrait' ? '4:5' : '16:9');

    if (targetModel === 'midjourney_v6' || mode === 'midjourney') {
      const isPhoto =
        mode === 'photorealistic' ||
        mode === 'portrait' ||
        mode === 'product' ||
        mode === 'fashion';
      return `--ar ${ar} --v 6.1 ${isPhoto ? '--style raw ' : ''}--stylize 150 --q 2`;
    }

    if (targetModel === 'flux_1' || mode === 'flux') {
      return `--aspect ${ar} --guidance 3.5`;
    }

    if (targetModel === 'stable_diffusion_xl' || mode === 'stable_diffusion') {
      return `Steps: 30, Sampler: DPM++ 2M Karras, CFG scale: 7, Size: 1024x1024`;
    }

    return '';
  }

  private buildNegativePrompt(mode: PromptMode, _targetModel: TargetModel): string {
    const baseNegative =
      'deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, low quality, artifacts, watermark, signature, username, text overlay';

    if (mode === 'photorealistic' || mode === 'portrait' || mode === 'fashion') {
      return `${baseNegative}, plastic skin, cartoon, anime, 3d render, oversaturated, artificial blur, doll-like, over-smoothed skin, extra fingers, crossed eyes`;
    }

    if (mode === 'anime' || mode === 'illustration') {
      return `${baseNegative}, photorealistic, photographic, 3d, realistic skin, noise, low-res lines`;
    }

    if (mode === '3d_render' || mode === 'architecture' || mode === 'product') {
      return `${baseNegative}, noise, low polygon, blurry textures, flat lighting, amateur render, blown-out highlights`;
    }

    return baseNegative;
  }

  private translatePrompt(prompt: string, targetLanguage: SupportedLanguage): string {
    switch (targetLanguage) {
      case 'es':
        return `[Español] ${prompt}`;
      case 'fr':
        return `[Français] ${prompt}`;
      case 'de':
        return `[Deutsch] ${prompt}`;
      case 'ar':
        return `[العربية] ${prompt}`;
      case 'sv':
        return `[Svenska] ${prompt}`;
      default:
        return prompt;
    }
  }
}
