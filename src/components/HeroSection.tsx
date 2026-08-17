import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Cloud } from 'lucide-react';
import { Link } from '../lib/router.tsx';

interface HeroSectionProps {
  onTryExampleClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTryExampleClick }) => {
  return (
    <div id="hero-section" className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 text-center">
      {/* Background Subtle Gradient Glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-sky-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/60 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 shadow-xs">
          <Cloud className="h-3.5 w-3.5 text-indigo-500" />
          <span>Cloudflare Workers AI LLaVA 1.5 Vision Engine</span>
          <span className="h-1 w-1 rounded-full bg-indigo-400" />
          <span className="text-slate-500 dark:text-slate-400 font-normal">Zero Data Retention</span>
        </div>

        {/* Primary H1 */}
        <h1
          id="homepage-main-h1"
          className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
        >
          AI Image to Prompt Generator
        </h1>

        {/* Subtitle / Value Proposition */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Turn any image into a detailed, high-fidelity AI prompt for <strong className="text-slate-900 dark:text-white font-semibold">Midjourney</strong>, <strong className="text-slate-900 dark:text-white font-semibold">Flux</strong>, <strong className="text-slate-900 dark:text-white font-semibold">Stable Diffusion</strong>, and <strong className="text-slate-900 dark:text-white font-semibold">ChatGPT</strong>.
        </p>

        {/* Quick Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> Instant Lens & Lighting Detection
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-500" /> 16+ Aesthetic Modes
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 100% In-Memory Privacy
          </span>
        </div>
      </div>
    </div>
  );
};
