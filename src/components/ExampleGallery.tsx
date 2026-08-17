import React, { useState } from 'react';
import { Copy, Check, Sparkles, ArrowRight, Eye, Sliders, ExternalLink } from 'lucide-react';
import { EXAMPLE_PRESETS } from '../data/examples.ts';
import type { ExamplePreset, PromptMode } from '../types.ts';
import { useToast } from './Toast.tsx';
import { trackEvent } from '../lib/analytics.ts';

interface ExampleGalleryProps {
  onSelectExample?: (preset: ExamplePreset) => void;
}

export const ExampleGallery: React.FC<ExampleGalleryProps> = ({ onSelectExample }) => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Examples' },
    { id: 'photorealistic', label: '📸 Photorealistic' },
    { id: 'cinematic', label: '🎬 Cinematic' },
    { id: 'product', label: '🛍️ Product' },
    { id: 'architecture', label: '🏛️ Architecture' },
    { id: 'anime', label: '🌸 Anime & Manga' },
    { id: 'fashion', label: '👗 Fashion' },
    { id: '3d_render', label: '💎 3D Render' },
  ];

  const filteredExamples =
    selectedCategory === 'all'
      ? EXAMPLE_PRESETS
      : EXAMPLE_PRESETS.filter((ex) => ex.category === selectedCategory);

  const handleCopyPrompt = async (preset: ExamplePreset) => {
    try {
      await navigator.clipboard.writeText(preset.prompt);
      setCopiedId(preset.id);
      showToast(`Copied ${preset.title} prompt!`, 'success');
      trackEvent('example_clicked', { presetId: preset.id, action: 'copy' });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const handleLoadInGenerator = (preset: ExamplePreset) => {
    trackEvent('example_clicked', { presetId: preset.id, action: 'load' });
    onSelectExample?.(preset);
    // Smooth scroll to generator
    const genElem = document.getElementById('generator-container');
    if (genElem) {
      genElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="example-gallery-section" className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Example Transformations
            </h2>
            <p className="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl">
              Explore how real reference visuals deconstruct into model-tuned prompts across varied artistic domains.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`filter-category-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExamples.map((preset) => (
            <div
              key={preset.id}
              id={`example-card-${preset.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-900">
                <img
                  src={preset.imageUrl}
                  alt={preset.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Badge Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-900 backdrop-blur-md dark:bg-slate-900/90 dark:text-white">
                    {preset.category.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-medium text-white/90">
                    {preset.targetModel === 'midjourney_v6'
                      ? 'Midjourney v6.1'
                      : preset.targetModel === 'flux_1'
                      ? 'Flux.1'
                      : 'Universal'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  {preset.title}
                </h3>

                {/* Generated Prompt Box */}
                <div className="relative flex-1 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-950/60 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80 font-mono">
                  <p className="line-clamp-4">{preset.prompt}</p>
                </div>

                {/* Parameters Tag */}
                {preset.parameters && (
                  <div className="mt-2 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 px-2 py-1 rounded">
                    {preset.parameters}
                  </div>
                )}

                {/* Action Buttons Bottom */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    id={`copy-example-${preset.id}`}
                    onClick={() => handleCopyPrompt(preset)}
                    className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                      copiedId === preset.id
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400'
                    }`}
                  >
                    {copiedId === preset.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId === preset.id ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>

                  <button
                    id={`load-example-${preset.id}`}
                    onClick={() => handleLoadInGenerator(preset)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    <span>Load in Generator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
