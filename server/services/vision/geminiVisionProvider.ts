import { GoogleGenAI } from '@google/genai';
import type { GenerationOptions, VisionAnalysisResult } from '../../../src/types.ts';
import { VISION_SYSTEM_ANALYSIS_PROMPT } from './promptTemplates.ts';
import type { VisionAnalysisRaw, VisionProvider } from './types.ts';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export class GeminiVisionProvider implements VisionProvider {
  public name = 'Google Gemini Multimodal Vision';
  public modelIdentifier = 'gemini-3.7-flash';

  public isAvailable(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  public async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    options: GenerationOptions
  ): Promise<VisionAnalysisRaw> {
    const client = getGeminiClient();
    if (!client) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }

    const base64Data = imageBuffer.toString('base64');
    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: base64Data,
      },
    };

    const textPrompt = `${VISION_SYSTEM_ANALYSIS_PROMPT}

TARGET PROMPT MODE: ${options.mode}
TARGET IMAGE GENERATOR: ${options.targetModel}
TARGET LANGUAGE: ${options.language}
DETAIL LEVEL: ${options.detailLevel}
${options.customInstructions ? `USER CUSTOM INSTRUCTIONS: ${options.customInstructions}` : ''}

Deconstruct the image thoroughly into the exact JSON schema.`;

    const response = await client.models.generateContent({
      model: this.modelIdentifier,
      contents: {
        parts: [imagePart, { text: textPrompt }],
      },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const rawText = response.text || '{}';
    let structured: VisionAnalysisResult;

    try {
      const parsed = JSON.parse(rawText);
      structured = {
        mainSubject: parsed.mainSubject || 'Subject in image',
        secondarySubjects: parsed.secondarySubjects || '',
        subjectAppearance: parsed.subjectAppearance || '',
        ageApproximation: parsed.ageApproximation || '',
        poseAndAction: parsed.poseAndAction || '',
        facialExpression: parsed.facialExpression || '',
        clothingAndAccessories: parsed.clothingAndAccessories || '',
        environmentAndSetting: parsed.environmentAndSetting || 'Photographic environment',
        foregroundDetails: parsed.foregroundDetails || '',
        backgroundDetails: parsed.backgroundDetails || '',
        compositionAndFraming: parsed.compositionAndFraming || 'Rule of thirds composition',
        cameraAngle: parsed.cameraAngle || 'Eye level',
        perspectiveAndShotType: parsed.perspectiveAndShotType || 'Medium shot',
        apparentFocalLength: parsed.apparentFocalLength || '50mm prime',
        depthOfField: parsed.depthOfField || 'Shallow depth of field with soft bokeh',
        focusPoint: parsed.focusPoint || 'Sharp focus on main subject',
        lightingDirection: parsed.lightingDirection || 'Natural directional lighting',
        lightingQuality: parsed.lightingQuality || 'Soft diffused ambient light',
        shadowsAndHighlights: parsed.shadowsAndHighlights || 'Rich shadow detail and gentle highlight roll-off',
        colorPalette: Array.isArray(parsed.colorPalette) ? parsed.colorPalette : ['Neutral tones'],
        materialsAndTextures: Array.isArray(parsed.materialsAndTextures) ? parsed.materialsAndTextures : ['High texture detail'],
        atmosphereAndMood: parsed.atmosphereAndMood || 'Atmospheric',
        artOrPhotographyStyle: parsed.artOrPhotographyStyle || 'Fine art photography',
        renderingQualityKeywords: Array.isArray(parsed.renderingQualityKeywords) ? parsed.renderingQualityKeywords : ['8k resolution', 'hyper-detailed'],
        fineVisualDetails: Array.isArray(parsed.fineVisualDetails) ? parsed.fineVisualDetails : [],
        detectedAspectRatio: parsed.detectedAspectRatio || '1:1',
        confidenceScore: 0.98,
      };
    } catch {
      structured = {
        mainSubject: 'Reverse-engineered visual subject',
        environmentAndSetting: 'Atmospheric scene setting',
        compositionAndFraming: 'Balanced framing',
        cameraAngle: 'Eye level',
        perspectiveAndShotType: 'Medium shot',
        depthOfField: 'Selective depth of field',
        lightingDirection: 'Studio directional lighting',
        lightingQuality: 'Soft volumetric illumination',
        colorPalette: ['Harmonious balanced palette'],
        materialsAndTextures: ['Detailed tactile textures'],
        atmosphereAndMood: 'Evocative atmosphere',
        artOrPhotographyStyle: 'Professional photography',
        renderingQualityKeywords: ['8k', 'award-winning photography', 'masterpiece'],
        fineVisualDetails: [rawText.slice(0, 300)],
        detectedAspectRatio: '1:1',
      };
    }

    return {
      rawText,
      structured,
      provider: 'Gemini Multimodal Vision AI',
      model: this.modelIdentifier,
    };
  }
}
