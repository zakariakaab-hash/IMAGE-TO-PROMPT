import React, { useEffect, useState } from 'react';
import { Sparkles, Scan, Sliders, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProcessingIndicatorProps {
  modeName?: string;
  targetModelName?: string;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  modeName = 'General Prompt',
  targetModelName = 'Universal AI',
}) => {
  const [stage, setStage] = useState<number>(0);

  const stages = [
    {
      title: 'Analyzing image visual tokens...',
      subtitle: 'Scanning subject geometry, posture, and facial micro-features with LLaVA 1.5',
      icon: Scan,
    },
    {
      title: 'Deconstructing camera, lighting & materials...',
      subtitle: 'Calculating apparent focal length, lighting directions, and surface textures',
      icon: Sliders,
    },
    {
      title: 'Engineering model-optimized prompt...',
      subtitle: `Formatting natural syntax and parameter flags for ${targetModelName}`,
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 900);
    const timer2 = setTimeout(() => setStage(2), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const CurrentIcon = stages[stage].icon;

  return (
    <div
      id="processing-indicator"
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-slate-900 shadow-xl"
    >
      {/* Animated Radar Scanner */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-400/60 dark:border-indigo-400"
        />
        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
          <CurrentIcon className="h-7 w-7 animate-pulse" />
        </div>
      </div>

      {/* Dynamic Stage Text */}
      <motion.div
        key={stage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-1.5 max-w-md"
      >
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {stages[stage].title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {stages[stage].subtitle}
        </p>
      </motion.div>

      {/* Progress Bars */}
      <div className="mt-8 flex w-full max-w-xs items-center justify-between gap-2">
        {stages.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              idx <= stage
                ? 'bg-indigo-600 dark:bg-indigo-500'
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        Cloudflare Workers AI LLaVA 1.5 Active
      </div>
    </div>
  );
};
