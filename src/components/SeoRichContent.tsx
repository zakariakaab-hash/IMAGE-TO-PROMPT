import React from 'react';
import { Sparkles, BookOpen, Layers, Lightbulb, Camera } from 'lucide-react';
import { Link } from '../lib/router.tsx';

export const SeoRichContent: React.FC = () => {
  return (
    <section id="seo-rich-content-section" className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Section 1: The Science of Image Reverse-Engineering */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Comprehensive Guide</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            How Multimodal AI Reverse-Engineers Images into Precision Prompts
          </h2>
          <p>
            Generative artificial intelligence has fundamentally transformed digital content creation, yet writing an effective text prompt remains the primary creative bottleneck. When attempting to recreate a specific visual aesthetic—whether an editorial portrait, a complex architectural concept, or a 3D isometric render—translating optical reality into text requires specialized vocabulary.
          </p>
          <p>
            PromptLens AI utilizes state-of-the-art vision models hosted on <strong>Cloudflare Workers AI</strong> (powered by <code>@cf/llava-hf/llava-1.5-7b-hf</code>). Our engine analyzes visual tokens across multiple orthogonal dimensions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-500" />
                Photographic & Optical Geometry
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Identifies apparent focal lengths (e.g. 24mm wide vs. 85mm portrait telephoto), aperture depth of field, perspective distortion, and sensor grain structures.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Lighting Architecture & Physics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Maps key, fill, and rim light angles, color temperatures (warm tungsten vs. cool daylight), shadow gradation, and volumetric atmospheric scattering.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Model Comparison */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Why Prompt Syntax Matters Across Generative Models
          </h2>
          <p>
            Each generative image model incorporates a different text encoder with distinct syntactic preferences:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Midjourney v6.1:</strong> Prioritizes front-loaded subject definition, concise contextual clauses, and explicit parameter flags (<code>--ar 16:9</code>, <code>--style raw</code>, <code>--stylize 250</code>).
            </li>
            <li>
              <strong>Black Forest Labs Flux.1:</strong> Utilizes a 12B parameter T5-XXL text encoder that thrives on continuous, descriptive natural English sentences without spamming keyword tags.
            </li>
            <li>
              <strong>Stable Diffusion XL:</strong> Benefits from weighted positive prompt tokens paired with comprehensive negative prompt exclusion lists to strip out common digital artifacts.
            </li>
          </ul>
        </div>

        {/* Section 3: Privacy and Performance */}
        <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Enterprise-Grade Edge Architecture & In-Memory Privacy
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Unlike many online converters that persist user uploads on third-party cloud buckets, PromptLens AI processes all visual data in-memory at the Cloudflare network edge. Your uploaded reference photos and intellectual property are never saved on public disk storage or used to train public machine learning datasets.
          </p>
        </div>
      </div>
    </section>
  );
};
