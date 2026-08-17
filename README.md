# PromptVision.ai — Cloudflare Workers & Workers AI Deployment

PromptVision.ai is an image-to-prompt reverse-engineering application powered by **Cloudflare Workers** and **Cloudflare Workers AI** using the **`@cf/llava-hf/llava-1.5-7b-hf`** multimodal vision model.

---

## 1. Credentials Classification

| Credential | Status | Usage Scope | Purpose |
| :--- | :--- | :--- | :--- |
| `CLOUDFLARE_ACCOUNT_ID` | **Required for Deployment / CLI** | Deployment / CI | Identifies your Cloudflare account for Wrangler deployments. |
| `CLOUDFLARE_API_TOKEN` | **Required for Deployment / CLI** | Deployment Secret / CI | Authenticates Wrangler CLI / CI/CD pipelines to publish Workers. *Not required at runtime in deployed Workers.* |

> **Production AI Architecture**: When deployed to Cloudflare Workers, the vision model is accessed directly via the native runtime platform binding `env.AI` (`@cf/llava-hf/llava-1.5-7b-hf`). No API token or AI Gateway is required at runtime by the deployed worker.

---

## 2. Where to Configure Each Credential in Cloudflare

### `CLOUDFLARE_ACCOUNT_ID`
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** in the left sidebar.
3. Your **Account ID** is displayed in the right sidebar under **Account Details**.
4. Set this as an environment variable in your deployment environment or CI secrets.

### `CLOUDFLARE_API_TOKEN`
1. Go to **Cloudflare Dashboard** → **My Profile** → **API Tokens** (or [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)).
2. Click **Create Token** → choose **Create Custom Token**.
3. Configure the following permissions:
   - `Account` → `Workers AI` → `Read / Run`
   - `Account` → `Workers Scripts` → `Edit`
   - `Account` → `Account Settings` → `Read`
4. Copy the generated token securely. Set it as `CLOUDFLARE_API_TOKEN` in your deployment secrets (e.g., GitHub Actions Secrets or local shell). Do not put it in application runtime code.

---

## 3. Security Rules & Frontend Isolation

- **Zero Client-Side Exposure**: Neither `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, nor any AI secrets are ever exposed to the client application or bundled in the frontend build (`dist/`).
- **Edge Proxy Architecture**: The browser interacts exclusively with the Worker API endpoints (`/api/generate`, `/api/analyze-only`, `/api/health`).
- **Do Not Commit Secrets**: Never commit `.env` or API tokens to source control. Only commit `.env.example` with blank placeholder values.

---

## 4. Architecture: `env.AI` Binding & LLaVA Model

The application leverages the native Cloudflare Workers AI binding defined in `wrangler.jsonc`:

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
  }
}
```

The Worker executes vision reverse-engineering directly on Cloudflare's global edge network:

```typescript
// worker.ts
const aiResponse = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
  image: Array.from(imageData),
  prompt: analysisPrompt,
  max_tokens: 1500,
});
```

---

## 5. How to Deploy Using Wrangler

### Prerequisites
- Node.js 18+ installed
- Cloudflare account with Workers AI enabled

### Step 1: Build the Static Frontend Assets
Compile the React application into the `./dist` directory:
```bash
npm install
npm run build
```

### Step 2: Authenticate with Cloudflare
Authenticate interactively via browser:
```bash
npx wrangler login
```
*Or* export your deployment credentials directly in your CI/CD environment:
```bash
export CLOUDFLARE_ACCOUNT_ID="your_account_id"
export CLOUDFLARE_API_TOKEN="your_api_token"
```

### Step 3: Test Locally with Wrangler Dev (Optional)
Run the worker locally with simulated Workers AI bindings:
```bash
npx wrangler dev
```

### Step 4: Deploy to Cloudflare Workers
Deploy the Worker and static assets to Cloudflare's global edge network:
```bash
npx wrangler deploy
```

### Step 5: Verify Deployment
Once deployed, verify the worker health check endpoint:
```bash
curl https://<your-worker-subdomain>.workers.dev/api/health
```

Expected response:
```json
{
  "status": "ok",
  "platform": "Cloudflare Workers AI Native",
  "model": "@cf/llava-hf/llava-1.5-7b-hf",
  "binding": "env.AI",
  "version": "1.0.0"
}
```

---

## 6. Supported Target Models & Synthesis Modes

When an image is deconstructed by `@cf/llava-hf/llava-1.5-7b-hf`, the edge engine compiles target-optimized prompt syntax for:
- **Midjourney v6.1**: Photographic camera parameters, lighting descriptors, `--v 6.1 --ar 16:9 --style raw`.
- **Flux.1 [dev / schnell]**: Rich descriptive prose narrative capturing textures, subtle specular highlights, and atmospheric depth.
- **Stable Diffusion XL**: Dual-stream positive and negative prompts with weighted parenthesis tags and quality embeddings.
- **ChatGPT / DALL-E 3**: Detailed compositional narrative describing subject interaction, lighting direction, and artistic style.
