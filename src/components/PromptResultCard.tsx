import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Sliders,
  FileText,
  Layers,
  Camera,
  Sun,
  Palette,
  Eye,
} from 'lucide-react';
import type { GeneratedPromptResponse } from '../types.ts';
import { useToast } from './Toast.tsx';
import { trackEvent } from '../lib/analytics.ts';

interface PromptResultCardProps {
  result: GeneratedPromptResponse;
  onRegenerate: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const PromptResultCard: React.FC<PromptResultCardProps> = ({
  result,
  onRegenerate,
  onReset,
  isLoading = false,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'prompt' | 'negative' | 'analysis' | 'parameters'>('prompt');
  const [editablePrompt, setEditablePrompt] = useState<string>(result.prompt);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync state if incoming prompt changes
  React.useEffect(() => {
    setEditablePrompt(result.prompt);
  }, [result.prompt]);

  const wordCount = editablePrompt.trim() ? editablePrompt.trim().split(/\s+/).length : 0;
  const charCount = editablePrompt.length;

  const handleCopy = async (textToCopy = editablePrompt, label = 'Prompt') => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast(`${label} copied to clipboard!`, 'success');
      trackEvent('prompt_copied', { mode: result.mode, targetModel: result.targetModel });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not access clipboard. Please copy manually.', 'error');
    }
  };

  const handleDownloadTxt = () => {
    const content = `=== PromptVision.ai Generated Prompt ===\nMode: ${result.mode}\nTarget Model: ${result.targetModel}\nTimestamp: ${new Date().toISOString()}\n\n[PRIMARY PROMPT]\n${editablePrompt}\n\n${
      result.negativePrompt ? `[NEGATIVE PROMPT]\n${result.negativePrompt}\n\n` : ''
    }${result.parameters ? `[PARAMETERS]\n${result.parameters}\n\n` : ''}=== Visual Deconstruction ===\nSubject: ${result.analysis.mainSubject}\nLighting: ${result.analysis.lightingQuality}\nCamera: ${result.analysis.apparentFocalLength || result.analysis.cameraAngle}\nStyle: ${result.analysis.artOrPhotographyStyle}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promptvision-${result.mode}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded prompt as TXT file', 'info');
    trackEvent('download_txt');
  };

  const handleDownloadJson = () => {
    const data = {
      prompt: editablePrompt,
      positivePrompt: result.positivePrompt,
      negativePrompt: result.negativePrompt,
      parameters: result.parameters,
      mode: result.mode,
      targetModel: result.targetModel,
      analysis: result.analysis,
      generatedWith: 'PromptVision.ai',
      modelEngine: result.modelDetails.engine,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `promptvision-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded complete JSON analysis', 'info');
    trackEvent('download_json');
  };

  return (
    <div id="prompt-result-card" className="space-y-6">
      {/* Upper Label Row matching Professional Polish */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
          Generated Output
        </h2>
        <div className="flex space-x-2">
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            98% Analysis Confidence
          </span>
        </div>
      </div>

      {/* Main Container Card matching Professional Polish */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        {/* Analysis Engine Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0 border border-indigo-200 text-indigo-600">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-0.5">
                Analysis Engine
              </h3>
              <p className="text-sm font-semibold text-slate-800">
                {result.modelDetails.engine || 'LLaVA 1.5-7b-hf'}
              </p>
              <p className="text-[11px] text-slate-500">
                Successfully identified visual attributes & lighting physics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {result.mode.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 px-6 bg-white text-xs font-medium">
          <button
            id="tab-full-prompt"
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-3 transition-colors ${
              activeTab === 'prompt'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Full Prompt
          </button>

          {result.negativePrompt && (
            <button
              id="tab-negative-prompt"
              onClick={() => setActiveTab('negative')}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-3 transition-colors ${
                activeTab === 'negative'
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Negative Prompt
            </button>
          )}

          {result.parameters && (
            <button
              id="tab-parameters"
              onClick={() => setActiveTab('parameters')}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-3 transition-colors ${
                activeTab === 'parameters'
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Parameters
            </button>
          )}

          <button
            id="tab-vision-analysis"
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-3 transition-colors ${
              activeTab === 'analysis'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Vision Breakdown
          </button>
        </div>

        {/* Tab 1: Full Prompt */}
        {activeTab === 'prompt' && (
          <div className="p-6 sm:p-8 relative">
            <textarea
              id="prompt-editor-textarea"
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-base sm:text-lg leading-relaxed text-slate-800 font-serif italic focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Edit prompt..."
            />

            {/* Bottom Actions Row matching Professional Polish */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  id="copy-prompt-primary-btn"
                  onClick={() => handleCopy(editablePrompt, 'Prompt')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                </button>

                <button
                  id="download-txt-btn"
                  onClick={handleDownloadTxt}
                  title="Download as TXT"
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  id="regenerate-prompt-btn"
                  onClick={onRegenerate}
                  disabled={isLoading}
                  title="Regenerate prompt variation"
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
                >
                  <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <span className="text-xs text-slate-400">
                Word count: {wordCount} | Characters: {charCount}
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Negative Prompt */}
        {activeTab === 'negative' && result.negativePrompt && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-700">
                  Recommended Negative Prompt (Stable Diffusion / Midjourney --no)
                </span>
                <button
                  id="copy-negative-prompt-btn"
                  onClick={() => handleCopy(result.negativePrompt!, 'Negative Prompt')}
                  className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:underline"
                >
                  <Copy className="w-3 h-3" /> Copy Negative
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-mono">
                {result.negativePrompt}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Parameters */}
        {activeTab === 'parameters' && result.parameters && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">
                  Model Flags & Command Parameters
                </span>
                <button
                  id="copy-parameters-btn"
                  onClick={() => handleCopy(result.parameters!, 'Parameters')}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline"
                >
                  <Copy className="w-3 h-3" /> Copy Flags
                </button>
              </div>
              <div className="rounded-lg bg-slate-900 px-4 py-3 font-mono text-xs text-emerald-400">
                {result.parameters}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Vision Breakdown */}
        {activeTab === 'analysis' && (
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  Main Subject
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {result.analysis.mainSubject}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <Camera className="w-3.5 h-3.5 text-sky-500" />
                  Optics & Framing
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {result.analysis.apparentFocalLength || result.analysis.cameraAngle} • {result.analysis.depthOfField}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Lighting & Atmosphere
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {result.analysis.lightingQuality} • {result.analysis.atmosphereAndMood}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                  <Palette className="w-3.5 h-3.5 text-purple-500" />
                  Dominant Color Palette
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {result.analysis.colorPalette?.map((c, i) => (
                    <span
                      key={i}
                      className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Footer Tools */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Model: <strong className="text-slate-700">{result.modelDetails.provider}</strong></span>
            <span>•</span>
            <span>Speed: <strong className="text-slate-700">{result.modelDetails.processingTimeMs}ms</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="download-json-btn"
              onClick={handleDownloadJson}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              id="generate-again-btn"
              onClick={onReset}
              className="flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload New Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Stats Grid matching Professional Polish template */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Time</p>
          <p className="text-xs font-semibold text-slate-700">
            {(result.modelDetails.processingTimeMs / 1000).toFixed(1)}s
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Storage</p>
          <p className="text-xs font-semibold text-slate-700">Privacy First</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Cost</p>
          <p className="text-xs font-semibold text-slate-700">Free Plan</p>
        </div>
      </div>
    </div>
  );
};
