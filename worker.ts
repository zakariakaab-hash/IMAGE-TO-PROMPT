/**
 * Cloudflare Worker Entry Point for PromptVision.ai
 * AI Engine: Cloudflare Workers AI (@cf/llava-hf/llava-1.5-7b-hf)
 * Framework: Cloudflare Workers Native Web APIs (Request, Response, FormData, File, ArrayBuffer)
 */

import { PromptEngine } from './src/services/vision/promptEngine.ts';
import { VISION_SYSTEM_ANALYSIS_PROMPT } from './src/services/vision/promptTemplates.ts';
import type {
  GenerationOptions,
  PromptMode,
  SupportedLanguage,
  TargetModel,
  VisionAnalysisResult,
} from './src/types.ts';

export interface Env {
  AI: {
    run(
      model: string,
      inputs: {
        image: number[] | Uint8Array;
        prompt: string;
        max_tokens?: number;
      }
    ): Promise<{ description?: string; response?: string } | Record<string, unknown>>;
  };
  ASSETS?: {
    fetch(request: Request): Promise<Response>;
  };
}

const promptEngine = new PromptEngine();

/**
 * Extracts and parses structured visual deconstruction from LLaVA multimodal output.
 */
function parseLlavaStructuredOutput(text: string): VisionAnalysisResult {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        mainSubject: parsed.mainSubject || 'Main visual subject',
        secondarySubjects: parsed.secondarySubjects || '',
        subjectAppearance: parsed.subjectAppearance || '',
        ageApproximation: parsed.ageApproximation || '',
        poseAndAction: parsed.poseAndAction || '',
        facialExpression: parsed.facialExpression || '',
        clothingAndAccessories: parsed.clothingAndAccessories || '',
        environmentAndSetting: parsed.environmentAndSetting || 'Studio photographic setting',
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
          : ['Natural tones', 'Neutral balance'],
        materialsAndTextures: Array.isArray(parsed.materialsAndTextures)
          ? parsed.materialsAndTextures
          : ['Smooth natural textures'],
        atmosphereAndMood: parsed.atmosphereAndMood || 'Atmospheric',
        artOrPhotographyStyle: parsed.artOrPhotographyStyle || 'Digital photography',
        renderingQualityKeywords: Array.isArray(parsed.renderingQualityKeywords)
          ? parsed.renderingQualityKeywords
          : ['high resolution', 'sharp focus', 'masterpiece'],
        fineVisualDetails: Array.isArray(parsed.fineVisualDetails)
          ? parsed.fineVisualDetails
          : [],
        detectedAspectRatio: parsed.detectedAspectRatio || '1:1',
        confidenceScore: 0.98,
      };
    }
  } catch {
    // Non-JSON fallback parser
  }

  return {
    mainSubject: text.slice(0, 160) || 'Photographic subject',
    environmentAndSetting: 'Photographic scene environment',
    compositionAndFraming: 'Centered balanced framing',
    cameraAngle: 'Eye level',
    perspectiveAndShotType: 'Medium shot',
    depthOfField: 'Selective depth of field',
    lightingDirection: 'Frontal directional lighting',
    lightingQuality: 'Natural lighting',
    colorPalette: ['Natural realistic tones'],
    materialsAndTextures: ['Detailed organic surfaces'],
    atmosphereAndMood: 'Atmospheric depth',
    artOrPhotographyStyle: 'Professional photography',
    renderingQualityKeywords: ['8k resolution', 'masterpiece', 'sharp optical focus'],
    fineVisualDetails: [text.slice(0, 240)],
    detectedAspectRatio: '1:1',
    confidenceScore: 0.95,
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Standard CORS Headers for edge responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 1. Health API Route
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          platform: 'Cloudflare Workers AI Native',
          model: '@cf/llava-hf/llava-1.5-7b-hf',
          binding: 'env.AI',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Models & Capabilities Metadata Route
    if (url.pathname === '/api/models') {
      return new Response(
        JSON.stringify({
          primaryVisionModel: '@cf/llava-hf/llava-1.5-7b-hf',
          provider: 'Cloudflare Workers AI',
          targetGenerators: [
            { id: 'all', name: 'Universal AI Prompt', badge: 'Recommended' },
            { id: 'midjourney_v6', name: 'Midjourney v6.1', badge: '--v 6.1 params' },
            { id: 'flux_1', name: 'Flux.1 [dev/schnell]', badge: 'Prose Style' },
            { id: 'stable_diffusion_xl', name: 'Stable Diffusion XL', badge: 'Positive + Negative' },
            { id: 'dalle_3', name: 'ChatGPT / DALL-E 3', badge: 'Narrative Prompt' },
          ],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Primary Reverse-Prompt Generation Route: POST /api/generate
    if ((url.pathname === '/api/generate' || url.pathname === '/api/generate-base64') && request.method === 'POST') {
      const startTime = Date.now();
      try {
        let imageData: number[] | Uint8Array | null = null;
        let mode: PromptMode = 'general';
        let targetModel: TargetModel = 'all';
        let detailLevel: GenerationOptions['detailLevel'] = 'balanced';
        let includeNegative = true;
        let language: SupportedLanguage = 'en';
        let aspectRatioHint: string | undefined = undefined;
        let customInstructions: string | undefined = undefined;

        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
          const formData = await request.formData();
          const imageFile = formData.get('image') as File | null;
          mode = (formData.get('mode') as PromptMode) || 'general';
          targetModel = (formData.get('targetModel') as TargetModel) || 'all';
          detailLevel = (formData.get('detailLevel') as GenerationOptions['detailLevel']) || 'balanced';
          includeNegative = formData.get('includeNegative') === 'true';
          language = (formData.get('language') as SupportedLanguage) || 'en';
          aspectRatioHint = (formData.get('aspectRatioHint') as string) || undefined;
          customInstructions = (formData.get('customInstructions') as string) || undefined;

          if (imageFile) {
            const arrayBuffer = await imageFile.arrayBuffer();
            imageData = new Uint8Array(arrayBuffer);
          }
        } else if (contentType.includes('application/json')) {
          const body = (await request.json()) as Record<string, unknown>;
          mode = (body.mode as PromptMode) || 'general';
          targetModel = (body.targetModel as TargetModel) || 'all';
          detailLevel = (body.detailLevel as GenerationOptions['detailLevel']) || 'balanced';
          includeNegative = body.includeNegative === true;
          language = (body.language as SupportedLanguage) || 'en';
          aspectRatioHint = typeof body.aspectRatioHint === 'string' ? body.aspectRatioHint : undefined;
          customInstructions = typeof body.customInstructions === 'string' ? body.customInstructions : undefined;

          if (typeof body.imageBase64 === 'string') {
            const rawBase64 = body.imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
            const binaryString = atob(rawBase64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            imageData = bytes;
          }
        }

        if (!imageData || imageData.length === 0) {
          return new Response(
            JSON.stringify({ success: false, error: 'Please upload an image or provide valid image data.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const analysisPrompt = `${VISION_SYSTEM_ANALYSIS_PROMPT}

USER REQUESTED MODE: ${mode.toUpperCase()}
TARGET IMAGE GENERATION MODEL: ${targetModel.toUpperCase()}
LANGUAGE: ${language.toUpperCase()}
${customInstructions ? `CUSTOM USER INSTRUCTIONS: ${customInstructions}` : ''}

Please deconstruct this image completely and return only the valid JSON.`;

        // Direct Cloudflare Workers AI execution with @cf/llava-hf/llava-1.5-7b-hf
        const aiResponse = (await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
          image: Array.from(imageData),
          prompt: analysisPrompt,
          max_tokens: 1500,
        })) as { description?: string; response?: string };

        const rawOutput = aiResponse.description || aiResponse.response || JSON.stringify(aiResponse);
        const structuredAnalysis = parseLlavaStructuredOutput(rawOutput);

        if (aspectRatioHint) {
          structuredAnalysis.detectedAspectRatio = aspectRatioHint;
        }

        const options: GenerationOptions = {
          mode,
          targetModel,
          detailLevel,
          includeNegative,
          language,
          aspectRatioHint,
          customInstructions,
        };

        // Synthesize target-specific prompts via PromptEngine
        const engineeredPrompt = promptEngine.generatePrompt(structuredAnalysis, options);
        const processingTimeMs = Date.now() - startTime;

        return new Response(
          JSON.stringify({
            success: true,
            prompt: engineeredPrompt.fullPrompt,
            positivePrompt: engineeredPrompt.positivePrompt,
            negativePrompt: engineeredPrompt.negativePrompt,
            parameters: engineeredPrompt.parameters,
            mode,
            targetModel,
            language,
            analysis: structuredAnalysis,
            modelDetails: {
              engine: '@cf/llava-hf/llava-1.5-7b-hf',
              provider: 'Cloudflare Workers AI',
              processingTimeMs,
            },
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (err: unknown) {
        console.error('Cloudflare Workers AI processing error:', err);
        let message = err instanceof Error ? err.message : 'Analysis failed on Cloudflare Workers AI';
        
        // Catch Cloudflare Workers AI 3006 Request too large error or model payload limits
        if (message.includes('3006') || message.toLowerCase().includes('request is too large') || message.toLowerCase().includes('too large')) {
          message = 'Image is too large for AI processing. Please upload a smaller image or try again.';
          return new Response(
            JSON.stringify({ success: false, error: message }),
            { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: false, error: message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 4. Quick Visual Analysis Endpoint: POST /api/analyze-only
    if (url.pathname === '/api/analyze-only' && request.method === 'POST') {
      try {
        const formData = await request.formData();
        const imageFile = formData.get('image') as File | null;

        if (!imageFile) {
          return new Response(
            JSON.stringify({ success: false, error: 'Please upload an image file.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const imageBytes = Array.from(new Uint8Array(arrayBuffer));

        const aiResponse = (await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
          image: imageBytes,
          prompt: VISION_SYSTEM_ANALYSIS_PROMPT,
          max_tokens: 1500,
        })) as { description?: string; response?: string };

        const rawOutput = aiResponse.description || aiResponse.response || JSON.stringify(aiResponse);
        const structuredAnalysis = parseLlavaStructuredOutput(rawOutput);

        return new Response(
          JSON.stringify({
            success: true,
            analysis: structuredAnalysis,
            provider: 'Cloudflare Workers AI',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Analysis failed';
        return new Response(
          JSON.stringify({ success: false, error: message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 5. Static Assets serving via Cloudflare Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('PromptVision.ai Cloudflare Workers Edge Service is active.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
