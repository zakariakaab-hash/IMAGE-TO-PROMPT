import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { PromptEngine } from './src/services/vision/promptEngine.ts';

// Lightweight Vite dev server middleware for local development API simulation
function devApiPlugin(): Plugin {
  const promptEngine = new PromptEngine();

  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'ok',
              platform: 'Cloudflare Workers AI (LLaVA Development Server)',
              model: '@cf/llava-hf/llava-1.5-7b-hf',
              timestamp: new Date().toISOString(),
            })
          );
          return;
        }

        if (req.url === '/api/models') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
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
            })
          );
          return;
        }

        if ((req.url === '/api/generate' || req.url === '/api/generate-base64') && req.method === 'POST') {
          // Read request body in chunks
          let bodyData = '';
          req.on('data', (chunk) => {
            bodyData += chunk;
          });

          req.on('end', () => {
            try {
              // Parse mode/targetModel parameters if available
              let mode: any = 'general';
              let targetModel: any = 'all';

              if (bodyData.includes('name="mode"')) {
                const modeMatch = bodyData.match(/name="mode"\r\n\r\n([a-z_]+)/);
                if (modeMatch) mode = modeMatch[1];
              }
              if (bodyData.includes('name="targetModel"')) {
                const modelMatch = bodyData.match(/name="targetModel"\r\n\r\n([a-z0-9_]+)/);
                if (modelMatch) targetModel = modelMatch[1];
              }

              const structuredAnalysis = {
                mainSubject: 'Photographic subject composed with high aesthetic clarity and dimensional presence',
                secondarySubjects: 'Harmonious contextual environment details',
                subjectAppearance: 'Distinctive visual textures, authentic material quality, subtle micro-contrast',
                poseAndAction: 'Balanced centered posture conveying poise and presence',
                facialExpression: 'Focused, emotionally resonant expression',
                clothingAndAccessories: 'Stylishly coordinated apparel with visible texture details',
                environmentAndSetting: 'Atmospheric scene setting with rich lighting and depth',
                foregroundDetails: 'Subtle atmospheric elements with natural optical separation',
                backgroundDetails: 'Layered architectural and environmental background geometry',
                compositionAndFraming: 'Balanced rule-of-thirds composition with leading lines',
                cameraAngle: 'Eye level perspective',
                perspectiveAndShotType: 'Medium cinematic shot',
                apparentFocalLength: '50mm standard prime f/1.4',
                depthOfField: 'Selective depth of field with creamy circular background bokeh',
                focusPoint: 'Pin-sharp optical focus on the central subject focal plane',
                lightingDirection: 'Three-point lighting setup: warm key light, soft rim light',
                lightingQuality: 'Volumetric cinematic lighting with soft shadow gradation',
                shadowsAndHighlights: 'Balanced contrast roll-off without crushed shadows',
                colorPalette: ['#1A2B3C (Deep Slate)', '#D4AF37 (Warm Gold)', '#EAEAEA (Clean Pearl)'],
                materialsAndTextures: ['tactile micro-textures', 'specular reflections', 'soft fabric weave'],
                atmosphereAndMood: 'Evocative, sophisticated, and pristine',
                artOrPhotographyStyle: 'Award-winning 35mm photography shot on ARRI Alexa with Hasselblad prime lenses',
                renderingQualityKeywords: ['8k resolution', 'masterpiece', 'hyper-detailed', 'sharp optical focus'],
                fineVisualDetails: [
                  'Subtle specular highlights catching contours',
                  'Fine surface texture micro-contrast',
                  'Realistic natural optical lens flare',
                ],
                detectedAspectRatio: '16:9',
                confidenceScore: 0.98,
              };

              const options = {
                mode,
                targetModel,
                detailLevel: 'balanced' as const,
                includeNegative: true,
                language: 'en' as const,
              };

              const engineered = promptEngine.generatePrompt(structuredAnalysis, options);

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  prompt: engineered.fullPrompt,
                  positivePrompt: engineered.positivePrompt,
                  negativePrompt: engineered.negativePrompt,
                  parameters: engineered.parameters,
                  mode,
                  targetModel,
                  language: 'en',
                  analysis: structuredAnalysis,
                  modelDetails: {
                    engine: '@cf/llava-hf/llava-1.5-7b-hf',
                    provider: 'Cloudflare Workers AI',
                    processingTimeMs: 380,
                  },
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message || 'Generation error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
