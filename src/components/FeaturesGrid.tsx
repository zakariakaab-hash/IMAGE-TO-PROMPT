import React from 'react';
import { Camera, Sun, Layers, ShieldCheck, Globe, Zap, Cpu, Sliders } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      title: 'Photographic Optics Engine',
      description: 'Accurately calculates 24mm, 50mm, 85mm prime lens focal lengths, aperture depth-of-field, and sensor noise characteristics.',
      icon: Camera,
    },
    {
      title: 'Lighting & Physics Mapping',
      description: 'Deconstructs key, fill, and rim lighting setups, color temperature, hard specular reflections, and atmospheric volumetric rays.',
      icon: Sun,
    },
    {
      title: '16+ Tuned Prompt Modes',
      description: 'From photorealistic street photography and luxury commercial products to anime key visuals and 3D Octane renders.',
      icon: Layers,
    },
    {
      title: 'Cloudflare Workers AI Powered',
      description: 'Lightning-fast vision tokenization executed globally at the edge on Cloudflare’s neural network infrastructure.',
      icon: Zap,
    },
    {
      title: 'Zero Image Retention Policy',
      description: 'Your uploaded artwork and personal photos are processed entirely in-memory and never stored on persistent disks.',
      icon: ShieldCheck,
    },
    {
      title: 'Multi-Language Synthesis',
      description: 'Generate prompts in English, Spanish, French, German, Swedish, and Arabic for international creative pipelines.',
      icon: Globe,
    },
  ];

  return (
    <section id="features-section" className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Built for Serious Prompt Engineering
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Everything you need to reverse-engineer, customize, and deploy AI prompts at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                id={`feature-card-${idx}`}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4 font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
