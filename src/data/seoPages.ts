import type { SEOPageData } from '../types.ts';

export const SEO_LANDING_PAGES: Record<string, SEOPageData> = {
  'image-to-prompt': {
    slug: 'image-to-prompt',
    title: 'Image to Prompt Generator – Convert Images Into AI Prompts',
    metaDescription:
      'Turn any image into a detailed AI prompt with our free image to prompt converter. Extract lighting, camera angles, textures, and styles for Midjourney and Flux.',
    h1: 'Image to Prompt Generator',
    subtitle:
      'Transform any visual reference into an exact, actionable text prompt. Perfect for Midjourney, Flux, Stable Diffusion, and ChatGPT DALL-E.',
    defaultMode: 'general',
    defaultTargetModel: 'all',
    badgeText: 'Instant Visual Reverse-Engineering',
    heroHighlights: [
      'Universal format support (JPG, PNG, WEBP, AVIF)',
      'Identifies lens focal length, lighting, and composition',
      'Zero image storage — 100% private in-memory processing',
    ],
    introduction: [
      'Have you ever seen an incredible photograph, illustration, or 3D render and wondered how to write an AI prompt that recreates that exact aesthetic? Our Image to Prompt Generator reverse-engineers the visual DNA of any image and translates it into a structured, production-ready prompt.',
      'Unlike basic captioning tools, PromptLens AI deconstructs camera lenses, lighting ratios, color palettes, and material textures. The resulting prompts give you total creative control when generating in Midjourney, Flux, or Stable Diffusion.',
    ],
    howItWorksSteps: [
      {
        title: '1. Upload Any Image',
        description: 'Drag and drop your photo, paste from clipboard, or select a file from your device.',
      },
      {
        title: '2. Multimodal Vision Analysis',
        description: 'Cloudflare Workers AI LLaVA scans the subject, environment, lighting, and camera geometry.',
      },
      {
        title: '3. Copy Optimized Prompt',
        description: 'Get a clean, formatted prompt with optional negative prompts and model parameters ready to copy.',
      },
    ],
    keyFeatures: [
      {
        title: 'Deep Photographic Extraction',
        description: 'Detects 35mm film grain, 85mm prime bokeh, anamorphic lens flares, and shutter characteristics.',
        iconName: 'Camera',
      },
      {
        title: 'Model-Specific Formatting',
        description: 'Automatically formats parameters for Midjourney (--ar, --v 6.1), Flux natural prose, or SDXL tokens.',
        iconName: 'Cpu',
      },
      {
        title: 'Zero Permanent Storage',
        description: 'Images are analyzed in-memory and deleted immediately after processing for full privacy.',
        iconName: 'ShieldCheck',
      },
    ],
    targetAudience: [
      {
        title: 'Digital Artists & Designers',
        description: 'Recreate visual styles, match client reference moodboards, and build consistent asset libraries.',
      },
      {
        title: 'Photographers & Filmmakers',
        description: 'Analyze lighting setups, framing geometry, and color grades from iconic reference stills.',
      },
      {
        title: 'Marketers & Content Creators',
        description: 'Produce high-converting on-brand visuals quickly by converting reference graphics into prompts.',
      },
    ],
    faqs: [
      {
        question: 'How do I turn an image into a prompt?',
        answer:
          'Simply upload or paste your image into PromptLens AI, select your desired prompt mode or target image generator, and click Generate. In seconds, you will receive a detailed, copyable prompt tailored to your needs.',
      },
      {
        question: 'Does this work on mobile devices?',
        answer:
          'Yes, PromptLens AI is fully responsive and allows you to upload photos directly from your smartphone camera or photo library.',
      },
      {
        question: 'What is the best way to get accurate prompts?',
        answer:
          'Upload high-resolution images with clear lighting and well-defined subjects. You can choose the "Ultra-Detailed" detail level for maximum granularity.',
      },
    ],
    relatedSlugs: ['ai-image-prompt-generator', 'midjourney-prompt-generator', 'photo-to-prompt'],
  },

  'ai-image-prompt-generator': {
    slug: 'ai-image-prompt-generator',
    title: 'AI Image Prompt Generator – Create Detailed Prompts From Images',
    metaDescription:
      'Generate high-precision AI prompts from any image using advanced vision models. Formats prompts for Midjourney, Flux, SDXL, and ChatGPT.',
    h1: 'AI Image Prompt Generator',
    subtitle:
      'Harness cutting-edge multimodal AI to deconstruct visual media into high-impact generative prompts with zero guesswork.',
    defaultMode: 'photorealistic',
    defaultTargetModel: 'all',
    badgeText: 'Multimodal Vision Intelligence',
    heroHighlights: [
      'Advanced optical & lighting reverse-engineering',
      'One-click multi-model parameter generation',
      'No account required for instant conversion',
    ],
    introduction: [
      'Crafting the perfect text prompt for AI generators often requires extensive trial and error. Our AI Image Prompt Generator solves this by analyzing real visual references and extracting the precise descriptive vocabulary required by modern diffusion and autoregressive image models.',
      'Whether you are building photorealistic portraits, commercial product shots, or concept art, our tool bridges the gap between your visual inspiration and final AI output.',
    ],
    howItWorksSteps: [
      {
        title: '1. Select Source Image',
        description: 'Upload any artwork, concept render, or photograph as your reference foundation.',
      },
      {
        title: '2. Select Output Style',
        description: 'Pick from Photorealistic, Cinematic, Portrait, Product, Anime, or Concept Art modes.',
      },
      {
        title: '3. Receive & Refine',
        description: 'Inspect the visual breakdown, tweak parameters in the built-in editor, and copy directly.',
      },
    ],
    keyFeatures: [
      {
        title: 'Lighting & Shadow Mapping',
        description: 'Identifies chiaroscuro contrast, volumetric lighting, rim highlights, and color temperatures.',
        iconName: 'Sun',
      },
      {
        title: 'Material & Texture Detection',
        description: 'Extracts surface qualities such as brushed titanium, porous concrete, soft velvet, or dewy skin.',
        iconName: 'Layers',
      },
      {
        title: 'Multi-Language Output',
        description: 'Generate prompts formatted for English, Spanish, French, German, and Swedish workflows.',
        iconName: 'Globe',
      },
    ],
    targetAudience: [
      {
        title: 'Prompt Engineers',
        description: 'Accelerate visual prompt experimentation with verified photographic and stylistic terminology.',
      },
      {
        title: 'Game Developers & 3D Artists',
        description: 'Generate texture, environmental, and prop reference prompts matching established art bibles.',
      },
      {
        title: 'Agencies & Studios',
        description: 'Maintain rapid ideation pipelines for client pitches and creative moodboard development.',
      },
    ],
    faqs: [
      {
        question: 'What makes this AI prompt generator different?',
        answer:
          'PromptLens AI does not output generic 3-word tags. It performs comprehensive vision parsing, evaluating optics, physics, composition, and art history to generate coherent, model-aware prompts.',
      },
      {
        question: 'Can I choose specific detail levels?',
        answer:
          'Yes, you can toggle between Concise (key elements only), Balanced (standard production prompt), and Ultra-Detailed (exhaustive texture, lens, and lighting breakdown).',
      },
    ],
    relatedSlugs: ['image-to-prompt', 'flux-prompt-generator', 'ai-art-prompt-generator'],
  },

  'image-prompt-generator': {
    slug: 'image-prompt-generator',
    title: 'Image Prompt Generator – Free Online Image to Text Tool',
    metaDescription:
      'Fast and free image prompt generator. Convert images, pictures, and photos into detailed prompts for AI image creation.',
    h1: 'Image Prompt Generator',
    subtitle:
      'The fastest way to convert pictures into descriptive text prompts for every modern generative image engine.',
    defaultMode: 'general',
    defaultTargetModel: 'all',
    badgeText: 'Fast & Free AI Tool',
    heroHighlights: [
      'Instant real-time analysis',
      'Clean export to TXT & JSON',
      'Works with all AI art platforms',
    ],
    introduction: [
      'When you have an inspiring image but lack the exact words to describe its lighting, camera angle, and mood to an AI, the Image Prompt Generator provides the answer. In a single click, it writes out the complete creative prompt for you.',
      'Use it to understand how professional creators achieve specific visual looks, or use it to generate infinite variations of your favorite art styles.',
    ],
    howItWorksSteps: [
      {
        title: '1. Drag & Drop Picture',
        description: 'Upload your reference picture in seconds without signing up.',
      },
      {
        title: '2. Automatic Reverse Prompting',
        description: 'Our vision engine maps visual features to precise prompt tokens.',
      },
      {
        title: '3. Copy with One Click',
        description: 'Click copy and paste the prompt straight into Midjourney, Discord, or web UIs.',
      },
    ],
    keyFeatures: [
      {
        title: 'Instant Clipboard Integration',
        description: 'Copy directly with one tap and paste anywhere in your workflow.',
        iconName: 'Clipboard',
      },
      {
        title: 'Editable Output Card',
        description: 'Make custom tweaks directly in the prompt box before copying.',
        iconName: 'Edit3',
      },
      {
        title: 'Local History',
        description: 'Access your recent generated prompts locally without creating an account.',
        iconName: 'Clock',
      },
    ],
    targetAudience: [
      {
        title: 'Everyday Creators',
        description: 'Anyone who wants to turn visual thoughts and photo examples into AI art.',
      },
      {
        title: 'Educators & Students',
        description: 'Learn prompt engineering through real-time reverse deconstruction of visual media.',
      },
    ],
    faqs: [
      {
        question: 'Is there a limit on how many images I can convert?',
        answer: 'You can generate prompts on the free tier with generous daily allowances.',
      },
      {
        question: 'Do you keep a copy of my pictures?',
        answer: 'No. Images are processed in-memory and immediately discarded after generation.',
      },
    ],
    relatedSlugs: ['image-to-prompt', 'photo-to-prompt', 'image-to-text-prompt'],
  },

  'photo-to-prompt': {
    slug: 'photo-to-prompt',
    title: 'Photo to Prompt Generator – Turn Real Photos Into AI Prompts',
    metaDescription:
      'Convert real-world photographs into photorealistic AI image prompts. Detects camera lens, aperture, lighting, and composition.',
    h1: 'Photo to Prompt Generator',
    subtitle:
      'Reverse-engineer real-world photography into authentic, photorealistic prompts with true photographic optics and lighting.',
    defaultMode: 'photorealistic',
    defaultTargetModel: 'midjourney_v6',
    badgeText: 'Photographic Precision Engine',
    heroHighlights: [
      'Detects lens focal lengths (24mm, 50mm, 85mm, 135mm)',
      'Identifies natural vs. studio lighting setups',
      'Tuned for photorealistic diffusion models',
    ],
    introduction: [
      'Achieving true photorealism in AI image generators requires understanding real photography: focal lengths, aperture roll-off, sensor grain, shutter timing, and natural light behavior. The Photo to Prompt generator specializes in decoding real photographs into authentic camera-driven prompts.',
      'Stop getting plastic-looking skin and fake textures. Use prompts derived from real photographic optics to produce lifelike, editorial-grade portraits, landscapes, and street photography.',
    ],
    howItWorksSteps: [
      {
        title: '1. Upload Photograph',
        description: 'Provide any high-res portrait, landscape, or street photo.',
      },
      {
        title: '2. Optical & Lighting Analysis',
        description: 'The engine calculates camera angles, depth of field, and illumination ratios.',
      },
      {
        title: '3. Get Photorealistic Prompt',
        description: 'Receive an authentic photographic prompt with raw camera parameters.',
      },
    ],
    keyFeatures: [
      {
        title: 'Lens & Sensor Simulation',
        description: 'Translates visual depth into Hasselblad, Leica, and ARRI camera descriptors.',
        iconName: 'Camera',
      },
      {
        title: 'Skin & Texture Fidelity',
        description: 'Preserves micro-pore realism, natural wrinkles, and authentic specular highlights.',
        iconName: 'Eye',
      },
      {
        title: 'Negative Artifact Filtering',
        description: 'Generates negative prompts that banish plastic skin, cartoon smoothing, and 3D artifacts.',
        iconName: 'Filter',
      },
    ],
    targetAudience: [
      {
        title: 'Professional Photographers',
        description: 'Explore AI concept prototyping while preserving their signature lighting and framing style.',
      },
      {
        title: 'Studio Lighting Specialists',
        description: 'Test lighting setups virtually by decoding and remixing real-world photo references.',
      },
    ],
    faqs: [
      {
        question: 'How does it detect camera lenses from a photo?',
        answer:
          'By analyzing perspective compression, background bokeh circle sizes, and field of view, our vision model estimates the equivalent focal length and aperture.',
      },
    ],
    relatedSlugs: ['image-to-prompt', 'midjourney-prompt-generator', 'image-to-text-prompt'],
  },

  'image-to-text-prompt': {
    slug: 'image-to-text-prompt',
    title: 'Image to Text Prompt – Describe and Convert Images into Prompts',
    metaDescription:
      'Describe images in rich text for AI models. Turn complex visuals into structured textual prompts with accurate descriptions.',
    h1: 'Image to Text Prompt Converter',
    subtitle:
      'Convert complex visual concepts into structured, richly descriptive text prompts that AI models comprehend effortlessly.',
    defaultMode: 'general',
    defaultTargetModel: 'dalle_3',
    badgeText: 'Rich Visual Transcription',
    heroHighlights: [
      'High semantic comprehension',
      'Descriptive narrative prompt syntax',
      'Compatible with ChatGPT DALL-E 3',
    ],
    introduction: [
      'Modern vision-language models can understand intricate visual scenes, but turning that understanding into an effective generation prompt requires linguistic structure. The Image to Text Prompt converter bridges human vision and AI synthesis.',
      'Get rich, evocative descriptions that preserve the emotional atmosphere and core subject details of your reference images.',
    ],
    howItWorksSteps: [
      {
        title: '1. Input Reference Image',
        description: 'Upload any visual source directly.',
      },
      {
        title: '2. Deep Semantic Transcription',
        description: 'AI decomposes actions, relationships, background scenery, and mood.',
      },
      {
        title: '3. Export Text Prompt',
        description: 'Copy the structured narrative prompt into ChatGPT, Midjourney, or Flux.',
      },
    ],
    keyFeatures: [
      {
        title: 'Narrative Framing',
        description: 'Creates flowing descriptive prose that prevents DALL-E 3 re-prompting distortion.',
        iconName: 'FileText',
      },
      {
        title: 'Hierarchical Breakdown',
        description: 'Inspect subject, foreground, background, and lighting in separate logical tabs.',
        iconName: 'List',
      },
    ],
    targetAudience: [
      {
        title: 'Writers & Storytellers',
        description: 'Translate visual scene concepts into rich descriptive text for worldbuilding.',
      },
      {
        title: 'Creative Directors',
        description: 'Quickly document and communicate visual references across creative teams.',
      },
    ],
    faqs: [
      {
        question: 'Can I use this for ChatGPT DALL-E 3?',
        answer:
          'Yes! DALL-E 3 responds best to descriptive narrative paragraphs, and our Image to Text Prompt converter formats output specifically for it.',
      },
    ],
    relatedSlugs: ['image-to-prompt', 'ai-image-prompt-generator', 'midjourney-prompt-generator'],
  },

  'midjourney-prompt-generator': {
    slug: 'midjourney-prompt-generator',
    title: 'Midjourney Prompt Generator From Image – Create Midjourney Prompts',
    metaDescription:
      'Generate accurate Midjourney v6 and v6.1 prompts from reference images. Includes parameters like --ar, --v 6.1, --stylize, and --style raw.',
    h1: 'Midjourney Prompt Generator From Image',
    subtitle:
      'Reverse-engineer any image into a formatted Midjourney prompt complete with v6.1 flags, aspect ratios, and stylize parameters.',
    defaultMode: 'midjourney',
    defaultTargetModel: 'midjourney_v6',
    badgeText: 'Tuned for Midjourney v6.1 & Niji 6',
    heroHighlights: [
      'Auto-generates flags: --ar 16:9, --v 6.1, --style raw, --stylize',
      'Optimized token order for maximum Midjourney coherence',
      'Supports Niji anime mode detection',
    ],
    introduction: [
      'Midjourney v6.1 possesses distinct prompt syntax preferences. Unlike legacy models that required long keyword stuffing, Midjourney v6 rewards concise, hierarchically ordered phrasing paired with precise command parameters.',
      'Our Midjourney Prompt Generator From Image reads your reference image and automatically builds the optimal prompt structure: Subject, Environment, Style/Medium, Camera Optics, Lighting Mood, followed by accurate parameter flags.',
    ],
    howItWorksSteps: [
      {
        title: '1. Upload Midjourney Reference',
        description: 'Upload any artwork or photo you wish to recreate or stylize in Midjourney.',
      },
      {
        title: '2. Midjourney Parameter Engine',
        description: 'Calculates aspect ratio, stylize weight, raw style flag, and camera descriptors.',
      },
      {
        title: '3. Paste Into Discord / Midjourney',
        description: 'Directly paste the prompt after `/imagine prompt:` in Midjourney for immediate results.',
      },
    ],
    keyFeatures: [
      {
        title: 'Automatic Parameter Insertion',
        description: 'Appends verified `--ar`, `--v 6.1`, `--style raw`, and `--stylize` flags.',
        iconName: 'Sliders',
      },
      {
        title: 'Token Weight Optimization',
        description: 'Places dominant visual concepts at the beginning of the prompt for maximum attention weight.',
        iconName: 'Zap',
      },
      {
        title: 'Anime / Niji Mode Support',
        description: 'Auto-detects illustrated art and applies `--niji 6` parameters when appropriate.',
        iconName: 'Sparkles',
      },
    ],
    targetAudience: [
      {
        title: 'Midjourney Creators',
        description: 'Create consistent style series, match reference photos, and master Midjourney v6.1 syntax.',
      },
      {
        title: 'Concept Designers',
        description: 'Rapidly iterate on moodboards and client style guides directly inside Discord.',
      },
    ],
    faqs: [
      {
        question: 'Does this work with Midjourney v6 and v6.1?',
        answer:
          'Yes, our prompt engine is specifically updated for Midjourney v6 and v6.1, utilizing clean descriptive phrases and current parameter standards.',
      },
      {
        question: 'How do I run the generated prompt in Midjourney?',
        answer:
          'Simply copy the generated prompt from PromptLens AI, open Discord or the Midjourney Web interface, type `/imagine`, and paste the prompt into the prompt box.',
      },
    ],
    relatedSlugs: ['image-to-prompt', 'flux-prompt-generator', 'stable-diffusion-prompt-generator'],
  },

  'flux-prompt-generator': {
    slug: 'flux-prompt-generator',
    title: 'Flux Prompt Generator From Image – Turn Images Into Flux Prompts',
    metaDescription:
      'Generate high-quality prompts optimized for Black Forest Labs Flux.1 [dev], [schnell], and [pro] from any reference image.',
    h1: 'Flux Prompt Generator From Image',
    subtitle:
      'Craft fluid, natural-language prompts tailored specifically for Black Forest Labs Flux.1 [dev/schnell] diffusion models.',
    defaultMode: 'flux',
    defaultTargetModel: 'flux_1',
    badgeText: 'Optimized for Flux.1 [dev & schnell]',
    heroHighlights: [
      'Natural-language prose formatting without tag spam',
      'Guidance scale suggestions for Flux.1 dev',
      'Accurate typography & fine detail extraction',
    ],
    introduction: [
      'Flux.1 from Black Forest Labs is renowned for its exceptional prompt comprehension, photorealistic skin rendering, and coherent text generation. However, Flux performs best when prompted with flowing, descriptive natural language rather than comma-separated keyword piles.',
      'The Flux Prompt Generator From Image transforms reference pictures into articulate visual paragraphs that unlock Flux’s full photorealistic potential.',
    ],
    howItWorksSteps: [
      {
        title: '1. Provide Source Image',
        description: 'Upload your reference photo, render, or graphic.',
      },
      {
        title: '2. Natural Prose Synthesis',
        description: 'The engine composes a fluid, continuous narrative description capturing every layer.',
      },
      {
        title: '3. Run in Flux.1',
        description: 'Copy and use directly in ComfyUI, Replicate, Fal.ai, or your local Flux deployment.',
      },
    ],
    keyFeatures: [
      {
        title: 'Zero Keyword Spam',
        description: 'Generates coherent English sentences that align with Flux’s T5 text encoder.',
        iconName: 'FileText',
      },
      {
        title: 'Guidance & Step Parameters',
        description: 'Includes optimal guidance scale recommendations (3.0 - 4.0 for Dev).',
        iconName: 'Settings',
      },
    ],
    targetAudience: [
      {
        title: 'Flux.1 Artists & ComfyUI Users',
        description: 'Achieve pinpoint control over lighting, texture, and character consistency in Flux workflows.',
      },
    ],
    faqs: [
      {
        question: 'Why does Flux need a different prompt format than Midjourney?',
        answer:
          'Flux uses the T5-XXL language model as its text encoder, which understands complex sentences, prepositions, and grammatical relationships far better than legacy CLIP models.',
      },
    ],
    relatedSlugs: ['image-to-prompt', 'midjourney-prompt-generator', 'stable-diffusion-prompt-generator'],
  },

  'stable-diffusion-prompt-generator': {
    slug: 'stable-diffusion-prompt-generator',
    title: 'Stable Diffusion Prompt Generator – Create Prompts for SDXL & SD3',
    metaDescription:
      'Generate positive and negative prompts for Stable Diffusion XL, SD 1.5, and SD 3.5 from reference images.',
    h1: 'Stable Diffusion Prompt Generator',
    subtitle:
      'Generate dual-stream positive token prompts and comprehensive negative prompts tailored for SDXL, SD 1.5, and SD 3.5.',
    defaultMode: 'stable_diffusion',
    defaultTargetModel: 'stable_diffusion_xl',
    badgeText: 'Positive & Negative Prompt Separation',
    heroHighlights: [
      'Dual-stream output: Positive prompt & Negative prompt',
      'Sampler & CFG scale recommendations',
      'Removes unwanted artifacts, distortion, and blur',
    ],
    introduction: [
      'Stable Diffusion workflows rely heavily on balanced positive keyword weighting and robust negative prompt filters. Our Stable Diffusion Prompt Generator analyzes your source image and creates both halves of the prompting equation.',
      'Get a master positive prompt tuned for your chosen checkpoint along with a surgical negative prompt that cleans up bad anatomy, blurry backgrounds, and unwanted artifacts.',
    ],
    howItWorksSteps: [
      {
        title: '1. Upload Reference Image',
        description: 'Add your source visual to deconstruct.',
      },
      {
        title: '2. Dual-Stream Tokenization',
        description: 'The engine generates positive artistic tokens and tailored negative filters.',
      },
      {
        title: '3. Paste Into WebUI or ComfyUI',
        description: 'Copy positive and negative fields directly into Automatic1111, Forge, or ComfyUI.',
      },
    ],
    keyFeatures: [
      {
        title: 'Separate Negative Prompt Box',
        description: 'One-click copy for both positive and negative prompt inputs.',
        iconName: 'Copy',
      },
      {
        title: 'Checkpoint Compatibility',
        description: 'Works seamlessly across SDXL base, Juggernaut XL, Realistic Vision, and SD 3.5.',
        iconName: 'Cpu',
      },
    ],
    targetAudience: [
      {
        title: 'Automatic1111 & ComfyUI Users',
        description: 'Power users seeking fast reference tokenization and clean negative prompt generation.',
      },
    ],
    faqs: [
      {
        question: 'What negative prompts are generated?',
        answer:
          'Our negative prompt filters out common diffusion defects such as anatomical mutations, plastic skin, low resolution, signatures, watermarks, and jpeg artifacts.',
      },
    ],
    relatedSlugs: ['image-to-prompt', 'flux-prompt-generator', 'ai-art-prompt-generator'],
  },

  'ai-art-prompt-generator': {
    slug: 'ai-art-prompt-generator',
    title: 'AI Art Prompt Generator – Create Detailed Prompts From Art & Photos',
    metaDescription:
      'Turn concept art, anime, 3D renders, and digital illustrations into detailed AI generation prompts.',
    h1: 'AI Art Prompt Generator',
    subtitle:
      'Extract artistic styles, brush techniques, color palettes, and mediums from any visual artwork with precision.',
    defaultMode: 'concept_art',
    defaultTargetModel: 'all',
    badgeText: 'Artistic Medium & Style Analyzer',
    heroHighlights: [
      'Identifies traditional & digital art mediums',
      'Detects oil paint, watercolor, gouache, cel shading, Octane 3D',
      'Preserves artistic mood and atmospheric lighting',
    ],
    introduction: [
      'Whether you are analyzing a classical oil painting, modern concept art, a cel-shaded anime key visual, or an Octane 3D render, the AI Art Prompt Generator identifies the underlying artistic medium, brushwork, and color harmony.',
      'Use it to expand your creative repertoire, study artistic styles, and generate cohesive new artworks inspired by master references.',
    ],
    howItWorksSteps: [
      {
        title: '1. Upload Artwork',
        description: 'Upload digital art, paintings, illustrations, or 3D renders.',
      },
      {
        title: '2. Artistic Medium Parsing',
        description: 'Our vision model decodes brushwork, lineart, shading, and rendering engines.',
      },
      {
        title: '3. Recreate & Remix',
        description: 'Generate endless stylistic variations across your favorite AI art tools.',
      },
    ],
    keyFeatures: [
      {
        title: 'Medium & Technique Recognition',
        description: 'Recognizes gouache, acrylic impasto, digital speedpainting, and 3D raytracing.',
        iconName: 'Palette',
      },
      {
        title: 'Color Palette Deconstruction',
        description: 'Extracts dominant color chords, complementary tones, and ambient mood keys.',
        iconName: 'Sun',
      },
    ],
    targetAudience: [
      {
        title: 'Concept Artists & Illustrators',
        description: 'Deconstruct master illustrations to understand lighting schemes and composition keys.',
      },
      {
        title: 'Anime & Manga Creators',
        description: 'Extract cel-shading and anime background art prompts effortlessly.',
      },
    ],
    faqs: [
      {
        question: 'Can it identify 3D rendering styles like Octane or Unreal Engine?',
        answer:
          'Yes! It detects 3D hard-surface modeling, subsurface scattering, ambient occlusion, and ray-traced lighting styles.',
      },
    ],
    relatedSlugs: ['image-to-prompt', 'ai-image-prompt-generator', 'midjourney-prompt-generator'],
  },
};
