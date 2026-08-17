import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection.tsx';
import { ImageUploadZone } from '../components/ImageUploadZone.tsx';
import { ProcessingIndicator } from '../components/ProcessingIndicator.tsx';
import { PromptResultCard } from '../components/PromptResultCard.tsx';
import { HowItWorks } from '../components/HowItWorks.tsx';
import { ExampleGallery } from '../components/ExampleGallery.tsx';
import { SupportedModelsSection } from '../components/SupportedModelsSection.tsx';
import { FeaturesGrid } from '../components/FeaturesGrid.tsx';
import { UseCasesSection } from '../components/UseCasesSection.tsx';
import { FAQSection } from '../components/FAQSection.tsx';
import { SeoRichContent } from '../components/SeoRichContent.tsx';
import { SEOHead } from '../components/SEOHead.tsx';
import { HOMEPAGE_FAQS } from '../data/faqs.ts';
import type { ExamplePreset, GeneratedPromptResponse, GenerationOptions, HistoryItem } from '../types.ts';
import { saveHistoryItem } from '../lib/history.ts';
import { useToast } from '../components/Toast.tsx';
import { analyzeImage } from '../services/vision/index.ts';

interface HomePageProps {
  onPromptGenerated?: (item: HistoryItem) => void;
  selectedPresetToLoad?: ExamplePreset | null;
  activeHistoryItem?: HistoryItem | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  onPromptGenerated,
  selectedPresetToLoad,
  activeHistoryItem,
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastImageFile, setLastImageFile] = useState<File | null>(null);
  const [lastImageBase64, setLastImageBase64] = useState<string | null>(null);
  const [lastOptions, setLastOptions] = useState<GenerationOptions | null>(null);
  const [result, setResult] = useState<GeneratedPromptResponse | null>(null);

  // If activeHistoryItem passed, load it into result
  React.useEffect(() => {
    if (activeHistoryItem) {
      setResult({
        success: true,
        prompt: activeHistoryItem.prompt,
        positivePrompt: activeHistoryItem.positivePrompt,
        negativePrompt: activeHistoryItem.negativePrompt,
        parameters: activeHistoryItem.parameters,
        mode: activeHistoryItem.mode,
        targetModel: activeHistoryItem.targetModel,
        language: 'en',
        analysis: activeHistoryItem.analysis,
        modelDetails: {
          provider: 'Cloudflare Workers AI LLaVA',
          engine: '@cf/llava-hf/llava-1.5-7b-hf',
          processingTimeMs: 420,
        },
      });
    }
  }, [activeHistoryItem]);

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

      // Save to local history
      const historyItem = saveHistoryItem({
        prompt: data.prompt,
        positivePrompt: data.positivePrompt,
        negativePrompt: data.negativePrompt,
        parameters: data.parameters,
        mode: data.mode,
        targetModel: data.targetModel,
        analysis: data.analysis,
      });

      onPromptGenerated?.(historyItem);
      showToast('AI prompt successfully generated!', 'success');

      // Scroll to result card
      setTimeout(() => {
        const resElem = document.getElementById('prompt-result-card');
        if (resElem) {
          resElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Generation failed:', err);
      showToast(err.message || 'Failed to generate prompt. Please try another image.', 'error');
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
    const genElem = document.getElementById('generator-container');
    if (genElem) {
      genElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home-page" className="min-h-screen">
      <SEOHead
        title="Image to Prompt AI – Convert Images Into AI Prompts (Free)"
        description="Turn any image into a detailed AI prompt with our free image to prompt converter. Extract lighting, camera angles, textures, and styles for Midjourney and Flux."
        canonicalPath="/"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: HOMEPAGE_FAQS.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          },
        ]}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Generator Tool Section */}
      <div id="generator" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-16">
        <div id="generator-container" className="space-y-6">
          <ImageUploadZone
            onGenerate={handleGenerate}
            isLoading={isLoading}
            presetImageToLoad={selectedPresetToLoad}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <ProcessingIndicator
              modeName={lastOptions?.mode}
              targetModelName={lastOptions?.targetModel}
            />
          )}

          {/* Result Card */}
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

      {/* How it Works */}
      <HowItWorks />

      {/* Example Transformations Gallery */}
      <ExampleGallery onSelectExample={(preset) => handleGenerate(null, null, {
        mode: preset.mode,
        targetModel: preset.targetModel,
        detailLevel: 'balanced',
        includeNegative: true,
        language: 'en',
      })} />

      {/* Supported Models */}
      <SupportedModelsSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Use Cases */}
      <UseCasesSection />

      {/* SEO Editorial Content */}
      <SeoRichContent />

      {/* FAQ Section */}
      <FAQSection faqs={HOMEPAGE_FAQS} />
    </div>
  );
};
