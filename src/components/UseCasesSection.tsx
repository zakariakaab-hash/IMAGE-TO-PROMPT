import React from 'react';
import { Camera, Palette, ShoppingBag, Clapperboard, Briefcase, Code } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      title: 'Digital Artists & Illustrators',
      description: 'Recreate visual styles, deconstruct master painting brushwork, and generate consistent character design series.',
      icon: Palette,
    },
    {
      title: 'Photographers & Cinematographers',
      description: 'Analyze lighting geometry, focal lengths, and color grades from iconic reference movie stills and editorial photos.',
      icon: Camera,
    },
    {
      title: 'E-commerce & Product Marketers',
      description: 'Transform competitor product imagery into high-converting lifestyle studio render prompts for advertising.',
      icon: ShoppingBag,
    },
    {
      title: 'Creative Directors & Agencies',
      description: 'Rapidly translate client moodboards and physical reference boards into editable generative image prompts.',
      icon: Briefcase,
    },
    {
      title: 'Game Developers & 3D Modelers',
      description: 'Generate environmental texture prompts, prop reference guides, and architectural concept art with precision.',
      icon: Clapperboard,
    },
    {
      title: 'Prompt Engineers & Researchers',
      description: 'Systematically test multimodal vision models, parameter flags, and text encoder attention weights.',
      icon: Code,
    },
  ];

  return (
    <section id="use-cases-section" className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Designed for Creative Professionals
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            From solo artists to enterprise creative teams, PromptLens AI elevates your generative workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <div
                key={idx}
                id={`use-case-${idx}`}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {uc.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
