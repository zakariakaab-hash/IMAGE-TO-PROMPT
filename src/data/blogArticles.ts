import type { BlogArticle } from '../types.ts';

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'how-to-turn-image-into-ai-prompt',
    title: 'How to Turn an Image into an AI Prompt: A Complete Practical Guide',
    description:
      'Learn the step-by-step methodology for reverse-engineering any photograph or artwork into a high-fidelity prompt for Midjourney, Flux, and Stable Diffusion.',
    publishedAt: 'August 14, 2026',
    readTime: '6 min read',
    author: {
      name: 'Julian Vance',
      role: 'Head of AI Vision Research',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    tags: ['Guide', 'Prompt Engineering', 'Midjourney', 'Flux'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    contentMarkdown: `
## Why Reverse-Engineering Images Matters in Generative AI

Every prompt engineer has encountered the same dilemma: you find a photograph or concept painting with breathtaking lighting, an impeccable camera angle, and an unforgettable mood—but when you attempt to describe it from memory, the AI generator outputs something flat and unrecognizable.

Turning an image into an accurate text prompt is not about guessing random adjectives. It is a systematic process of **visual deconstruction**.

---

### Step 1: Deconstructing the Primary Subject & Pose

Start with the core subject before adding any stylistic modifiers:
- **Physical Demographics / Materiality:** Specific descriptors rather than broad categories.
- **Posture and Kinetics:** Is the subject dynamically moving, resting, or holding tension?
- **Gaze and Micro-Expressions:** Eye direction, brow tension, mouth state.

---

### Step 2: Extracting the Camera Optics and Perspective

Generative models like Midjourney v6 and Flux have been trained on millions of camera metadata tags. Specifying photographic optics dramatically changes the render quality:
- **Focal Length:** 
  - *24mm–35mm:* Wide environmental context, slight perspective distortion.
  - *50mm:* Natural human eye perspective.
  - *85mm–135mm:* Compressed background, creamy shallow depth of field (bokeh), flattering facial geometry.
- **Shot Distance:** Extreme close-up, 3/4 medium portrait, full-body environmental wide.
- **Angle:** Low angle worm's eye, eye level, high angle bird's eye, Dutch tilt.

---

### Step 3: Mapping the Lighting Geometry

Lighting defines 80% of an image's emotional resonance:
- **Key Light Direction:** Top-left 45°, direct frontal, backlit rim light, under-lit dramatic.
- **Lighting Quality:** Soft diffused overcast vs. hard direct midday sun vs. volumetric misty light rays.
- **Shadow Roll-off:** Gradual soft shadows vs. sharp high-contrast chiaroscuro.

---

### Step 4: Structuring the Prompt for Your Target Generator

Different models require different grammatical grammar:
- **Midjourney v6:** Hierarchical comma-separated phrases with parameter flags (\`--ar 16:9 --v 6.1 --style raw\`).
- **Flux.1:** Continuous natural language narrative prose without keyword repetition.
- **Stable Diffusion:** Positive token weights paired with an artifact-filtering negative prompt.

Using an automated reverse-engineering tool like **PromptLens AI** speeds up this workflow by computing these optical parameters instantly using Cloudflare Workers AI vision models.
    `,
  },

  {
    slug: 'reverse-engineer-midjourney-prompts',
    title: 'How to Reverse-Engineer Midjourney Prompts from Reference Images',
    description:
      'Master the art of extracting Midjourney v6 parameters, stylize values, and aesthetic tags from reference images to achieve style consistency.',
    publishedAt: 'August 10, 2026',
    readTime: '7 min read',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Creative Technologist',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    },
    tags: ['Midjourney', 'V6.1', 'Parameters', 'Art Direction'],
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    contentMarkdown: `
## The Evolution of Midjourney Prompting: From V4 to V6.1

In earlier versions of Midjourney, users relied on massive walls of buzzwords (\`octane render, unreal engine 5, trending on artstation, masterpiece, 8k\`). In Midjourney v6 and v6.1, these legacy buzzwords actually degrade image quality by confusing the model's natural language understanding.

To reverse-engineer a Midjourney prompt from a reference photo today, you must follow modern Midjourney syntax.

---

### The 5-Part Midjourney Formula

1. **Core Subject:** The primary noun and its immediate physical attributes.
2. **Context / Setting:** The environment, weather, time of day, and background elements.
3. **Medium & Style:** E.g., *editorial 35mm film photography*, *oil on linen canvas*, *minimalist 3D render*.
4. **Lighting & Palette:** E.g., *warm golden hour side light, muted teal and terracotta color grading*.
5. **Technical Parameters:** \`--ar\`, \`--v 6.1\`, \`--stylize\`, \`--style raw\`.

---

### Deciding When to Use \`--style raw\`

When converting real photographs into Midjourney prompts:
- Use \`--style raw\` if you want to avoid Midjourney's default stylized cinematic look in favor of authentic documentary realism and natural skin micro-textures.
- Keep standard style (omit raw) when creating concept art or high-fantasy illustrations.

---

### Setting the Optimal \`--stylize\` Value

- \`--stylize 50-100:\` High prompt fidelity, strict adherence to reference image details.
- \`--stylize 150-250:\` Balanced artistic embellishment (the sweet spot for most creative workflows).
- \`--stylize 500-1000:\` High artistic interpretation, creative variations on the theme.
    `,
  },

  {
    slug: 'photorealistic-ai-prompts-guide',
    title: 'The Photographer’s Guide to Writing Photorealistic AI Prompts',
    description:
      'Eliminate the "AI plastic look." Learn how professional camera sensors, film stocks, and lighting setups produce truly photorealistic AI images.',
    publishedAt: 'August 05, 2026',
    readTime: '8 min read',
    author: {
      name: 'Marcus Thorne',
      role: 'Cinematographer & AI Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    tags: ['Photorealism', 'Photography', 'Optics', 'Lighting'],
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    contentMarkdown: `
## Why Most "Photorealistic" AI Images Look Fake

The uncanny valley in AI photography rarely stems from poor resolution; it stems from unnatural optical behavior:
1. **Implausibly perfect symmetry and plastic skin:** Real human faces have pores, micro-imperfections, and non-uniform specular reflections.
2. **Infinite depth of field with zero lens distortion:** Real lenses have optical fall-off, subtle chromatic dispersion, and aperture-specific bokeh shapes.
3. **Omnipresent flat lighting:** Real lighting has a definitive source, bounce surfaces, and shadow gradation.

---

### Camera & Sensor Prompting Keywords that Work

Instead of saying "photorealistic," specify the capture medium:
- \`Shot on 35mm Kodak Portra 400 film, natural grain, warm highlight roll-off\`
- \`Hasselblad H6D-100c medium format studio photograph, 100mm f/2.2 prime\`
- \`ARRI Alexa Mini LF cinematic still, Cooke Anamorphic /i Prime lenses, subtle optical flare\`

---

### Specifying Lighting Ratios

- **Three-Point Studio:** Key light 45° off-axis, soft ambient fill at 1:3 ratio, crisp rim light outlining subject hair.
- **Natural Golden Hour:** Low sun angle, warm rim highlights, elongated soft shadows, natural lens flare.
- **High-Contrast Chiaroscuro:** Deep directional shadows, single hard light source, dramatic mood.
    `,
  },

  {
    slug: 'flux-prompting-from-reference-images',
    title: 'Flux.1 Prompting Masterclass: Transforming Images into Natural Language',
    description:
      'Unlock the power of Flux.1 [dev] and [schnell] by understanding its T5 text encoder and how natural language prompting outperforms keyword tagging.',
    publishedAt: 'July 28, 2026',
    readTime: '5 min read',
    author: {
      name: 'Julian Vance',
      role: 'Head of AI Vision Research',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    tags: ['Flux', 'BFL', 'Prompting', 'Text Encoder'],
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    contentMarkdown: `
## Why Flux.1 Changes the Prompting Game

Flux.1 from Black Forest Labs relies on a massive 12B parameter text encoder based on Google's T5-XXL. This architecture understands sentence syntax, spatial prepositions (*"under the bridge," "to the left of"*), and narrative continuity far better than legacy CLIP-based models.

---

### The Golden Rule of Flux: Write Like a Writer, Not a Tag Cloud

**Poor Flux Prompt:**
\`woman, red dress, smiling, 8k, best quality, masterpiece, studio lighting, highly detailed\`

**High-Performing Flux Prompt:**
\`A high-resolution editorial portrait of a woman with natural freckled skin wearing a tailored crimson silk dress. She stands in a sunlit Scandinavian loft with exposed brick walls, looking calmly toward the camera. Soft morning light streams through floor-to-ceiling windows on the left, casting gentle shadows across her profile. Captured with an 85mm prime lens with shallow depth of field.\`

---

### Tips for Reverse-Engineering Reference Photos for Flux

1. Describe interactions between objects rather than isolated nouns.
2. Note the direction and texture of light in full descriptive clauses.
3. Mention text and typography explicitly: Flux is capable of rendering legible text when prompted accurately.
    `,
  },

  {
    slug: 'understanding-camera-and-lighting-prompts',
    title: 'Understanding Camera Angles and Lighting Terms for AI Image Prompts',
    description:
      'A visual reference dictionary of cinematography and studio lighting terms to take your AI prompt engineering to professional standards.',
    publishedAt: 'July 20, 2026',
    readTime: '6 min read',
    author: {
      name: 'Elena Rostova',
      role: 'Lead Creative Technologist',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    },
    tags: ['Cinematography', 'Lighting', 'Camera Angles', 'Cheat Sheet'],
    coverImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80',
    contentMarkdown: `
## The Essential Camera and Lighting Vocabulary

When you feed descriptive cinematic terms into AI generators, you control not just what is in the frame, but how the viewer experiences the scene.

---

### 1. Camera Framing & Angles
- **Extreme Close-Up (ECU):** Focuses on a single detail (e.g. iris, lips, texture of fabric).
- **Medium Close-Up (MCU):** Chest to top of head; standard dialogue and portrait framing.
- **Cowboy Shot / American Shot:** Mid-thigh up; conveys action, confidence, and posture.
- **Worm’s Eye View (Low Angle):** Camera looks upward; makes the subject appear monumental and powerful.
- **Bird’s Eye View (High Angle / Overhead):** Camera looks straight down; creates graphic, geometric spatial relationships.
- **Dutch Angle / Dutch Tilt:** Camera is tilted on its roll axis; introduces psychological unease or dynamic energy.

---

### 2. Studio Lighting Setups
- **Rembrandt Lighting:** Recognizable by a small triangle of light on the shadowed cheek; classic portraiture mood.
- **Butterfly Lighting (Paramount):** Light positioned directly above and in front of subject; creates a subtle butterfly shadow under the nose.
- **Rim Lighting / Hair Light:** Light behind the subject; creates a glowing outline that separates the subject from a dark background.
- **Volumetric God Rays:** Visible beams of light cutting through haze, fog, or dust in the air.
    `,
  },
];
