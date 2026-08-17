import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import type { GenerationOptions, PromptMode, SupportedLanguage, TargetModel } from './src/types.ts';
import { PromptEngine } from './server/services/promptEngine.ts';
import { VisionManager } from './server/services/vision/visionManager.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Multer memory storage configuration (Max 15MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported image format. Allowed formats: JPG, PNG, WEBP, AVIF.'));
    }
  },
});

// JSON and URL-encoded body parser
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Services
const visionManager = new VisionManager();
const promptEngine = new PromptEngine();

// API Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PromptLens AI - Image to Prompt Generator',
    version: '1.0.0',
    platform: 'Cloudflare Workers AI Ready',
    model: '@cf/llava-hf/llava-1.5-7b-hf',
    timestamp: new Date().toISOString(),
  });
});

// Supported Models & Modes metadata
app.get('/api/models', (_req: Request, res: Response) => {
  res.json({
    primaryVisionModel: '@cf/llava-hf/llava-1.5-7b-hf',
    targetGenerators: [
      { id: 'all', name: 'Universal AI Prompt', badge: 'Recommended' },
      { id: 'midjourney_v6', name: 'Midjourney v6.1', badge: '--v 6.1 params' },
      { id: 'flux_1', name: 'Flux.1 [dev/schnell]', badge: 'Prose Style' },
      { id: 'stable_diffusion_xl', name: 'Stable Diffusion XL', badge: 'Positive + Negative' },
      { id: 'dalle_3', name: 'ChatGPT / DALL-E 3', badge: 'Narrative Prompt' },
    ],
    modes: [
      { id: 'general', name: 'General AI Prompt' },
      { id: 'photorealistic', name: 'Photorealistic' },
      { id: 'cinematic', name: 'Cinematic Movie Still' },
      { id: 'portrait', name: 'Portrait & Studio' },
      { id: 'product', name: 'Product Photography' },
      { id: 'fashion', name: 'Fashion & Editorial' },
      { id: 'advertising', name: 'Commercial Advertising' },
      { id: 'architecture', name: 'Architecture & Interior' },
      { id: 'anime', name: 'Anime & Manga' },
      { id: 'illustration', name: 'Digital Illustration' },
      { id: '3d_render', name: '3D Render / Octane' },
      { id: 'concept_art', name: 'Sci-Fi / Fantasy Concept Art' },
      { id: 'midjourney', name: 'Midjourney Tuned' },
      { id: 'flux', name: 'Flux Tuned' },
      { id: 'stable_diffusion', name: 'Stable Diffusion Tuned' },
      { id: 'chatgpt_dalle', name: 'ChatGPT DALL-E 3' },
    ],
  });
});

// Primary Generation Endpoint
app.post('/api/generate', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    let imageBuffer: Buffer | null = null;
    let mimeType = 'image/jpeg';

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body?.imageBase64) {
      const rawBase64 = req.body.imageBase64 as string;
      const matches = rawBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        imageBuffer = Buffer.from(matches[2], 'base64');
      } else {
        imageBuffer = Buffer.from(rawBase64, 'base64');
      }
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Please upload an image or provide a valid base64 image data string.',
      });
      return;
    }

    // Parse options with safe fallbacks
    const options: GenerationOptions = {
      mode: (req.body?.mode as PromptMode) || 'general',
      targetModel: (req.body?.targetModel as TargetModel) || 'all',
      detailLevel: req.body?.detailLevel || 'balanced',
      includeNegative: req.body?.includeNegative === 'true' || req.body?.includeNegative === true,
      language: (req.body?.language as SupportedLanguage) || 'en',
      aspectRatioHint: req.body?.aspectRatioHint,
      customInstructions: req.body?.customInstructions,
    };

    // 1. Deconstruct the image via Cloudflare LLaVA / Multimodal Vision Manager
    const visionAnalysis = await visionManager.analyzeImage(imageBuffer, mimeType, options);

    // 2. Synthesize target-optimized prompt via PromptEngine
    const engineeredPrompt = promptEngine.generatePrompt(visionAnalysis.structured, options);

    const processingTimeMs = Date.now() - startTime;

    res.json({
      success: true,
      prompt: engineeredPrompt.fullPrompt,
      positivePrompt: engineeredPrompt.positivePrompt,
      negativePrompt: engineeredPrompt.negativePrompt,
      parameters: engineeredPrompt.parameters,
      mode: options.mode,
      targetModel: options.targetModel,
      language: options.language,
      analysis: visionAnalysis.structured,
      modelDetails: {
        engine: '@cf/llava-hf/llava-1.5-7b-hf',
        provider: visionAnalysis.provider,
        processingTimeMs,
      },
    });
  } catch (error: unknown) {
    console.error('Error generating image prompt:', error);
    const message = error instanceof Error ? error.message : 'Something went wrong while analyzing your image.';
    res.status(500).json({
      success: false,
      error: message.includes('API key') || message.includes('credentials')
        ? 'AI Vision service is initializing. Please verify credentials or retry.'
        : 'Something went wrong while analyzing your image. Please try again.',
    });
  }
});

// Quick Visual Analysis Endpoint
app.post('/api/analyze-only', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    let imageBuffer: Buffer | null = null;
    let mimeType = 'image/jpeg';

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body?.imageBase64) {
      const rawBase64 = req.body.imageBase64 as string;
      const matches = rawBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        imageBuffer = Buffer.from(matches[2], 'base64');
      } else {
        imageBuffer = Buffer.from(rawBase64, 'base64');
      }
    }

    if (!imageBuffer) {
      res.status(400).json({ success: false, error: 'Please provide an image.' });
      return;
    }

    const options: GenerationOptions = {
      mode: (req.body?.mode as PromptMode) || 'general',
      targetModel: (req.body?.targetModel as TargetModel) || 'all',
      detailLevel: req.body?.detailLevel || 'ultra_detailed',
      includeNegative: true,
      language: 'en',
    };

    const analysis = await visionManager.analyzeImage(imageBuffer, mimeType, options);
    res.json({ success: true, analysis: analysis.structured, provider: analysis.provider });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    res.status(500).json({ success: false, error: message });
  }
});

// Vite & Static file handling
async function setupViteAndListen() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PromptLens AI server running at http://0.0.0.0:${PORT}`);
  });
}

setupViteAndListen();
