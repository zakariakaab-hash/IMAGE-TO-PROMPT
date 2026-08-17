import React from 'react';
import { Upload, Scan, Copy, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Image',
      description: 'Drag & drop any JPG, PNG, WEBP, or AVIF image, browse your local drive, or paste from clipboard (Ctrl+V).',
      icon: Upload,
      accent: 'from-blue-500 to-indigo-500',
    },
    {
      number: '02',
      title: 'Multimodal Vision Analysis',
      description: 'Cloudflare Workers AI LLaVA 1.5 deconstructs lighting geometry, camera lenses, materials, and art styles in real time.',
      icon: Scan,
      accent: 'from-indigo-500 to-purple-500',
    },
    {
      number: '03',
      title: 'Copy & Recreate',
      description: 'Copy the model-tuned prompt with optimal parameter flags (--ar, --v 6.1, negative tokens) and paste into your AI generator.',
      icon: Copy,
      accent: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Reverse-engineer any visual reference into production-ready prompts in three seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                id={`how-it-works-step-${idx + 1}`}
                className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-slate-800">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
