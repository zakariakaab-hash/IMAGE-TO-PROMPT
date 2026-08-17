import type { FAQItem } from '../types.ts';

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: 'What is an image-to-prompt generator?',
    answer:
      'An image-to-prompt generator is an AI tool that reverse-engineers any uploaded photograph, illustration, or render into a comprehensive, high-fidelity text prompt. It deconstructs the image into its core elements—including subject, camera lens, lighting geometry, color palette, composition, and artistic styling—so you can recreate or iterate on the visual concept across leading AI image generators like Midjourney, Flux, and Stable Diffusion.',
  },
  {
    question: 'How does image-to-prompt AI work?',
    answer:
      'The tool uses advanced multimodal computer vision (powered by Cloudflare Workers AI LLaVA 1.5 and neural vision models) to analyze visual tokens within the image. It extracts photographic parameters, lighting directions, texture descriptors, and mood cues. Our proprietary prompt engineering layer then structures these visual attributes into model-optimized prompts formatted for your target generator.',
  },
  {
    question: 'Can I generate a prompt from any image format?',
    answer:
      'Yes. PromptLens AI supports standard image formats including JPEG, PNG, WEBP, and AVIF up to 15MB. You can drag and drop files, browse your local drive, or paste directly from your clipboard (Ctrl+V / Cmd+V).',
  },
  {
    question: 'Is the image-to-prompt generator free to use?',
    answer:
      'Yes, PromptLens AI offers a free tier allowing you to analyze images and generate model-tuned prompts instantly with zero signup required. Pro plans are available for power users seeking higher throughput and advanced fine-tuning controls.',
  },
  {
    question: 'Can I use the generated prompt in Midjourney?',
    answer:
      'Absolutely. When selecting Midjourney mode (or target generator), the output is specially tailored with Midjourney parameters such as aspect ratio flags (--ar 16:9, --ar 4:5), version parameters (--v 6.1), style raw flags, and stylize values.',
  },
  {
    question: 'Can I use the prompt with Stable Diffusion and SDXL?',
    answer:
      'Yes. For Stable Diffusion, the engine produces both weighted positive descriptive tokens and a comprehensive negative prompt (filtering out anatomy defects, artifacts, and noise) alongside recommended step counts and sampler configurations.',
  },
  {
    question: 'Can I use the prompt with Flux.1 [dev / schnell]?',
    answer:
      'Yes. Flux.1 thrives on coherent, natural-language narrative descriptions rather than repetitive keyword tags. When Flux mode is selected, PromptLens AI builds a fluid, descriptive paragraph capturing fine textures, lighting ambiance, and spatial depth.',
  },
  {
    question: 'Does the tool permanently store my uploaded images?',
    answer:
      'No. We adhere to a strict zero-retention privacy policy. Uploaded images are processed entirely in-memory for the duration of the vision analysis and discarded immediately after the prompt is generated. Your personal images and intellectual property are never saved on public disks or used to train public models.',
  },
  {
    question: 'How accurate are AI-generated image prompts?',
    answer:
      'Our reverse-engineering engine focuses on observable photographic realities rather than hallucinatory speculation. It accurately detects focal length, lighting setup, color grading, and composition, producing prompts that achieve high visual consistency when regenerated.',
  },
  {
    question: 'Can I edit the generated prompt before copying?',
    answer:
      'Yes. The output interface provides a built-in live text editor with word and character counters, one-click clipboard copying, parameter breakdown tabs, and export to TXT or JSON.',
  },
];
