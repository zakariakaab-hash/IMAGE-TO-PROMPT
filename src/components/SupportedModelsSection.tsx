import React from 'react';
import { Cpu, Zap, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from '../lib/router.tsx';

export const SupportedModelsSection: React.FC = () => {
  const models = [
    {
      name: 'Midjourney v6.1 & Niji',
      slug: '/midjourney-prompt-generator',
      badge: 'v6.1 Supported',
      icon: Cpu,
      description:
        'Hierarchical token structure with automatic generation of --ar aspect ratios, --v 6.1 flags, --stylize weights, and --style raw parameters.',
      syntaxExample: 'cinematic portrait of a warrior, dramatic lighting, 85mm --ar 16:9 --v 6.1 --style raw',
      color: 'border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20',
      iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
    },
    {
      name: 'Black Forest Labs Flux.1',
      slug: '/flux-prompt-generator',
      badge: '[dev] & [schnell]',
      icon: Zap,
      description:
        'Continuous natural language descriptive paragraphs crafted specifically for Flux’s 12B T5-XXL text encoder, maximizing spatial understanding and typography.',
      syntaxExample: 'A crisp editorial photograph of a model in sunlight, soft shadows falling across...',
      color: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20',
      iconColor: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900',
    },
    {
      name: 'Stable Diffusion XL & SD3',
      slug: '/stable-diffusion-prompt-generator',
      badge: 'Positive + Negative',
      icon: Layers,
      description:
        'Dual-stream tokenization outputting balanced positive quality triggers alongside surgical negative prompt filters to eliminate noise, blur, and distortion.',
      syntaxExample: 'masterpiece, 8k, photorealistic subject | negative: blur, bad anatomy, deformed',
      color: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900',
    },
    {
      name: 'ChatGPT / DALL-E 3',
      slug: '/image-to-text-prompt',
      badge: 'Narrative Framing',
      icon: Sparkles,
      description:
        'Evocative storytelling prompt formatting engineered to prevent DALL-E 3 internal rewrite drift, ensuring faithful reproduction of reference scenes.',
      syntaxExample: 'A detailed scene depicting an authentic artisan workshop filled with hand tools...',
      color: 'border-sky-200 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/20',
      iconColor: 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900',
    },
  ];

  return (
    <section id="supported-models-section" className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Optimized for Every Leading AI Image Generator
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Every generative AI engine parses prompts differently. PromptLens AI writes tailored syntax for each specific model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                id={`model-card-${idx}`}
                className={`flex flex-col justify-between rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${mod.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold ${mod.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {mod.name}
                      </h3>
                    </div>
                    <span className="rounded-md bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800">
                      {mod.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  <div className="rounded-lg bg-slate-900/90 dark:bg-black/60 p-2.5 font-mono text-[11px] text-slate-300">
                    <span className="text-slate-500">// Output syntax:</span>
                    <p className="truncate text-emerald-400">{mod.syntaxExample}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                  <Link
                    to={mod.slug}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    <span>Open {mod.name} Generator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
