# PromptVision.ai — Cloudflare Workers & Workers AI

PromptVision.ai is an image-to-prompt reverse-engineering application powered by **Cloudflare Workers** and **Cloudflare Workers AI** using the **`@cf/llava-hf/llava-1.5-7b-hf`** multimodal vision model.

---

## 1. Production Architecture

```
React / Vite Frontend
       │
       ▼ (FormData / Fetch POST /api/generate)
Cloudflare Worker (worker.ts)
       │
       ▼ (Native env.AI binding)
Cloudflare Workers AI (@cf/llava-hf/llava-1.5-7b-hf)
       │
       ▼ (Deconstructed Visual Components)
Prompt Engine (Midjourney v6.1 / Flux.1 / SDXL / DALL-E 3)
       │
       ▼ (Structured Response)
React / Vite Frontend
```

- **Native Workers AI Binding**: The Worker interacts directly with `@cf/llava-hf/llava-1.5-7b-hf` using the platform-level `env.AI` binding.
- **Zero Runtime Credentials**: No runtime API keys, secrets, or gateway URLs are needed by the deployed application.
- **Cloudflare Workers Builds**: Automated builds and deployments are managed through the Cloudflare GitHub integration.

---

## 2. Configuration (`wrangler.jsonc`)

The application defines the Workers AI and static asset bindings in `wrangler.jsonc`:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "image-to-prompt",
  "main": "worker.ts",
  "compatibility_date": "2026-08-17",
  "compatibility_flags": ["nodejs_compat"],
  "ai": {
    "binding": "AI"
  },
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "observability": {
    "enabled": true
  }
}
```

The Worker invokes the model directly:

```typescript
// worker.ts
const aiResponse = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
  image: Array.from(imageData),
  prompt: analysisPrompt,
  max_tokens: 1500,
});
```

---

## 3. Build & Deployment Commands

```bash
# Install dependencies
npm install

# Build the React static frontend for Cloudflare Assets
npm run build

# Run local development server
npm run dev

# Run Cloudflare Worker locally with simulated Workers AI bindings
npm run worker:dev

# Deploy to Cloudflare Workers via Wrangler CLI (if running manually)
npm run deploy
```

---

## 4. Supported Target Models & Synthesis Modes

When an image is deconstructed by `@cf/llava-hf/llava-1.5-7b-hf`, the edge engine compiles target-optimized prompt syntax for:
- **Midjourney v6.1**: Photographic camera parameters, lighting descriptors, `--v 6.1 --ar 16:9 --style raw`.
- **Flux.1 [dev / schnell]**: Rich descriptive prose narrative capturing textures, subtle specular highlights, and atmospheric depth.
- **Stable Diffusion XL**: Dual-stream positive and negative prompts with weighted parenthesis tags and quality embeddings.
- **ChatGPT / DALL-E 3**: Detailed compositional narrative describing subject interaction, lighting direction, and artistic style.
