/**
 * Cloudflare Workers entrypoint for PromptLens AI
 * Model: @cf/llava-hf/llava-1.5-7b-hf
 * Deploy with: npx wrangler deploy
 */

interface Env {
  AI: {
    run(
      model: string,
      inputs: {
        image: number[];
        prompt: string;
        max_tokens?: number;
      }
    ): Promise<{ description?: string; response?: string }>;
  };
  ASSETS?: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API Routes
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          platform: 'Cloudflare Workers AI Native',
          model: '@cf/llava-hf/llava-1.5-7b-hf',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const formData = await request.formData();
        const imageFile = formData.get('image') as File | null;
        const mode = (formData.get('mode') as string) || 'general';
        const targetModel = (formData.get('targetModel') as string) || 'all';
        const detailLevel = (formData.get('detailLevel') as string) || 'balanced';

        if (!imageFile) {
          return new Response(
            JSON.stringify({ success: false, error: 'Please upload an image file.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const imageBytes = Array.from(new Uint8Array(arrayBuffer));

        const systemPrompt = `Deconstruct this image into visual components (subject, pose, lighting, camera angle, colors, style, mood, details) and return a structured JSON object.`;

        // Direct Cloudflare Workers AI execution
        const aiResponse = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
          image: imageBytes,
          prompt: systemPrompt,
          max_tokens: 1500,
        });

        const rawDescription = aiResponse.description || aiResponse.response || 'Photographic subject';

        // Prompt formatting for Cloudflare edge execution
        const generatedPrompt = `${rawDescription}, high quality, detailed lighting, cinematic composition`;

        return new Response(
          JSON.stringify({
            success: true,
            prompt: generatedPrompt,
            positivePrompt: generatedPrompt,
            mode,
            targetModel,
            analysis: {
              mainSubject: rawDescription.slice(0, 100),
              environmentAndSetting: 'Photographic scene',
              compositionAndFraming: 'Centered',
              cameraAngle: 'Eye level',
              depthOfField: 'Selective focus',
              lightingQuality: 'Natural lighting',
              colorPalette: ['Balanced natural tones'],
              atmosphereAndMood: 'Atmospheric',
              artOrPhotographyStyle: 'Professional photography',
            },
            modelDetails: {
              engine: '@cf/llava-hf/llava-1.5-7b-hf',
              provider: 'Cloudflare Workers AI',
            },
          }),
          {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          }
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Analysis failed';
        return new Response(
          JSON.stringify({ success: false, error: message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Static Assets serving via Cloudflare Pages / Workers static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('PromptLens AI Cloudflare Workers Edge Service', { status: 200 });
  },
};
