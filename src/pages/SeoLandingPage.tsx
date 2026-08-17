import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead.tsx';
import { ImageUploadZone } from '../components/ImageUploadZone.tsx';
import { ProcessingIndicator } from '../components/ProcessingIndicator.tsx';
import { PromptResultCard } from '../components/PromptResultCard.tsx';
import { FAQSection } from '../components/FAQSection.tsx';
import { SupportedModelsSection } from '../components/SupportedModelsSection.tsx';
import { ExampleGallery } from '../components/ExampleGallery.tsx';
import { SEO_LANDING_PAGES } from '../data/seoPages.ts';
import { Link } from '../lib/router.tsx';
import {
  Sparkles,
  Camera,
  Cpu,
  ShieldCheck,
  Sun,
  Layers,
  Globe,
  Eye,
  Filter,
  FileText,
  Sliders,
  Zap,
  Palette,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import type { GeneratedPromptResponse, GenerationOptions, HistoryItem } from '../types.ts';
import { saveHistoryItem } from '../lib/history.ts';
import { useToast } from '../components/Toast.tsx';
import { analyzeImage } from '../services/vision/index.ts';

interface SeoLandingPageProps {
  slug: string;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({ slug }) => {
  const { showToast } = useToast();
  const pageData = SEO_LANDING_PAGES[slug] || SEO_LANDING_PAGES['image-to-prompt'];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastImageFile, setLastImageFile] = useState<File | null>(null);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);
  const [lastOptions, setLastOptions] = useState<GenerationOptions | null>(null);
  const [result, setResult] = useState<GeneratedPromptResponse | null>(null);

  // Icon mapper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return Camera;
      case 'Cpu': return Cpu;
      case 'ShieldCheck': return ShieldCheck;
      case 'Sun': return Sun;
      case 'Layers': return Layers;
      case 'Globe': return Globe;
      case 'Eye': return Eye;
      case 'Filter': return Filter;
      case 'FileText': return FileText;
      case 'Sliders': return Sliders;
      case 'Zap': return Zap;
      case 'Palette': return Palette;
      default: return Sparkles;
    }
  };

  const handleGenerate = async (
    file: File | null,
    base64: string | null,
    options: GenerationOptions
  ) => {
    setIsLoading(true);
    setLastImageFile(file);
    setLastImageBase64(base64);
    setLastOptions(options);

    try {
      const imageInput = file || base64;
      if (!imageInput) {
        throw new Error('Please upload an image or provide valid image data.');
      }

      const data = await analyzeImage(imageInput, options);
      setResult(data);

      saveHistoryItem({
        prompt: data.prompt,
        positivePrompt: data.positivePrompt,
        negativePrompt: data.negativePrompt,
        parameters: data.parameters,
        mode: data.mode,
        targetModel: data.targetModel,
        analysis: data.analysis,
      });

      showToast('AI prompt successfully generated!', 'success');

      setTimeout(() => {
        const resElem = document.getElementById('prompt-result-card');
        if (resElem) {
          resElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Generation failed:', err);
      showToast(err.message || 'Failed to generate prompt.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastOptions && (lastImageFile || lastImageBase64)) {
      handleGenerate(lastImageFile, lastImageBase64, lastOptions);
    }
  };

  const handleReset = () => {
    setResult(null);
    setLastImageFile(null);
    setLastImageBase64(null);
  };

  return (
    <div id={`seo-page-${slug}`} className="min-h-screen">
      <SEOHead
        title={pageData.title}
        description={pageData.metaDescription}
        canonicalPath={`/${slug}`}
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: pageData.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: window.location.origin,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: pageData.h1,
                item: `${window.location.origin}/${slug}`,
              },
            ],
          },
        ]}
      />

      {/* Hero Header */}
      <div className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/60 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{pageData.badgeText}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            {pageData.h1}
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {pageData.subtitle}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {pageData.heroHighlights.map((hl, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {hl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Generator Tool */}
      <div id="generator" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="space-y-6">
          <ImageUploadZone
            onGenerate={handleGenerate}
            isLoading={isLoading}
            initialMode={pageData.defaultMode}
            initialTargetModel={pageData.defaultTargetModel}
          />

          {isLoading && (
            <ProcessingIndicator
              modeName={lastOptions?.mode || pageData.defaultMode}
              targetModelName={lastOptions?.targetModel || pageData.defaultTargetModel}
            />
          )}

          {result && !isLoading && (
            <PromptResultCard
              result={result}
              onRegenerate={handleRegenerate}
              onReset={handleReset}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Editorial Introduction */}
      <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {pageData.introduction.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* How it Works 3 Steps */}
      <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              How to Use the {pageData.h1}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageData.howItWorksSteps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs"
              >
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {step.title}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Advanced Capabilities
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageData.keyFeatures.map((feat, idx) => {
              const Icon = getIcon(feat.iconName);
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-3 font-bold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
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

      {/* Target Audiences */}
      <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Who Is This For?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageData.targetAudience.map((aud, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {aud.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {aud.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools Internal Linking */}
      {pageData.relatedSlugs && pageData.relatedSlugs.length > 0 && (
        <section className="py-10 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Explore Related AI Prompt Tools
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {pageData.relatedSlugs.map((relSlug) => {
                const target = SEO_LANDING_PAGES[relSlug];
                if (!target) return null;
                return (
                  <Link
                    key={relSlug}
                    to={`/${relSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors shadow-2xs"
                  >
                    <span>{target.h1}</span>
                    <ArrowRight className="h-3 w-3 opacity-60" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection faqs={pageData.faqs} title={`${pageData.h1} FAQs`} />
    </div>
  );
};
