import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  X,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Lock,
  Zap,
  Globe,
  Camera,
  Layers,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type {
  DetailLevel,
  GenerationOptions,
  PromptMode,
  SupportedLanguage,
  TargetModel,
} from '../types.ts';
import { useToast } from './Toast.tsx';
import { trackEvent } from '../lib/analytics.ts';
import { optimizeImageForAI } from '../lib/imageOptimizer.ts';

interface ImageUploadZoneProps {
  onGenerate: (imageFile: File | null, imageBase64: string | null, options: GenerationOptions) => void;
  isLoading: boolean;
  initialMode?: PromptMode;
  initialTargetModel?: TargetModel;
  presetImageToLoad?: { imageUrl: string; mode?: PromptMode; targetModel?: TargetModel } | null;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onGenerate,
  isLoading,
  initialMode = 'photorealistic',
  initialTargetModel = 'all',
  presetImageToLoad,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; dimensions?: string; optimized?: boolean } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [optimizingStatus, setOptimizingStatus] = useState<string | null>(null);

  // Generation options
  const [mode, setMode] = useState<PromptMode>(initialMode);
  const [targetModel, setTargetModel] = useState<TargetModel>(initialTargetModel);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('balanced');
  const [includeNegative, setIncludeNegative] = useState<boolean>(true);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Quick mode presets for direct selection buttons
  const quickModes: { id: PromptMode; label: string }[] = [
    { id: 'photorealistic', label: 'Photorealistic' },
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'midjourney', label: 'Midjourney v6' },
    { id: 'anime', label: 'Anime Style' },
  ];

  // Sync if props change
  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (initialTargetModel) setTargetModel(initialTargetModel);
  }, [initialTargetModel]);

  // Load preset image if provided
  useEffect(() => {
    if (presetImageToLoad?.imageUrl) {
      setPreviewUrl(presetImageToLoad.imageUrl);
      setFileDetails({
        name: 'Preset Reference Visual',
        size: '1.2 MB',
        dimensions: 'High Resolution',
      });
      if (presetImageToLoad.mode) setMode(presetImageToLoad.mode);
      if (presetImageToLoad.targetModel) setTargetModel(presetImageToLoad.targetModel);
      setErrorMessage(null);
    }
  }, [presetImageToLoad]);

  // Process and validate an image file
  const processImageFile = useCallback((file: File) => {
    setErrorMessage(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Unsupported image format. Please upload a PNG, JPG, or WEBP image.');
      return;
    }

    // Validate size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage('Image size exceeds 10MB limit. Please select a smaller image.');
      return;
    }

    setSelectedFile(file);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Calculate dimensions
    const img = new Image();
    img.onload = () => {
      setFileDetails({
        name: file.name,
        size: `${sizeInMB} MB`,
        dimensions: `${img.width} × ${img.height}px`,
      });
    };
    img.src = objectUrl;

    trackEvent('image_uploaded', { sizeMB: sizeInMB, type: file.type });
  }, []);

  // Global Clipboard Paste Listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
            showToast('Image pasted from clipboard!', 'success');
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processImageFile, showToast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleClearImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileDetails(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !selectedFile) {
      setErrorMessage('Please upload or paste an image first.');
      return;
    }

    setErrorMessage(null);

    const options: GenerationOptions = {
      mode,
      targetModel,
      detailLevel,
      includeNegative,
      language,
    };

    trackEvent('prompt_generated', { mode, targetModel });

    try {
      let fileToSend: File | null = selectedFile;

      if (!fileToSend && previewUrl?.startsWith('http')) {
        try {
          const res = await fetch(previewUrl);
          const blob = await res.blob();
          fileToSend = new File([blob], 'reference.jpg', { type: blob.type || 'image/jpeg' });
        } catch {
          // fallback to passing data url
        }
      }

      if (fileToSend) {
        // Optimize large images / phone photos proportionally before sending to Cloudflare LLaVA
        const origSize = fileToSend.size;
        const needsOptimization = origSize > 1.2 * 1024 * 1024;
        
        if (needsOptimization) {
          setOptimizingStatus('Optimizing image for AI analysis…');
        }

        const optimization = await optimizeImageForAI(
          fileToSend,
          { maxDimension: 1536, maxBytes: 1.2 * 1024 * 1024 },
          (status) => setOptimizingStatus(status)
        );

        setOptimizingStatus(null);
        onGenerate(optimization.file, null, options);
      } else if (previewUrl) {
        onGenerate(null, previewUrl, options);
      }
    } catch (err: unknown) {
      setOptimizingStatus(null);
      console.warn('Image optimization warning, passing original input:', err);
      if (selectedFile) {
        onGenerate(selectedFile, null, options);
      } else if (previewUrl) {
        onGenerate(null, previewUrl, options);
      }
    }
  };

  return (
    <form
      id="image-upload-form"
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm transition-all"
    >
      {/* Upload Drop Zone matching Professional Polish aesthetic */}
      <div
        id="drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer mb-6 transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
            : previewUrl
            ? 'border-slate-200 bg-slate-50/60'
            : 'border-slate-200 bg-slate-50 hover:border-indigo-400'
        }`}
      >
        <input
          ref={fileInputRef}
          id="file-upload-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {previewUrl ? (
          /* Image Preview State */
          <div className="relative flex w-full flex-col items-center justify-center py-2">
            <div className="relative max-h-72 max-w-full overflow-hidden rounded-xl shadow-xs border border-slate-200 bg-slate-100">
              <img
                id="uploaded-image-preview"
                src={previewUrl}
                alt="Uploaded reference preview"
                className="max-h-64 w-auto rounded-xl object-contain"
              />
              <button
                type="button"
                id="remove-image-button"
                onClick={handleClearImage}
                title="Remove image"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-rose-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Metadata Pill */}
            {fileDetails && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{fileDetails.name}</span>
                <span>•</span>
                <span>{fileDetails.size}</span>
                {fileDetails.dimensions && (
                  <>
                    <span>•</span>
                    <span>{fileDetails.dimensions}</span>
                  </>
                )}
                <button
                  type="button"
                  id="replace-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="ml-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Change image
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty Drop Zone matching Professional Polish template */
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">Drop image here or click to upload</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP (Max 10MB)</p>
          </div>
        )}
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div
          id="upload-error-banner"
          className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Prompt Mode Quick Chips matching Professional Polish style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Prompt Mode
          </label>
          <span className="text-[11px] text-slate-400">Tuned Output Styles</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickModes.map((item) => {
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`mode-chip-${item.id}`}
                onClick={() => setMode(item.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isActive ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                ></span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mode Dropdown for Extended Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>All Artistic Modes (16+)</span>
            </label>
            <div className="relative">
              <select
                id="prompt-mode-select"
                value={mode}
                onChange={(e) => {
                  const val = e.target.value as PromptMode;
                  setMode(val);
                  trackEvent('mode_selected', { mode: val });
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="photorealistic">Photorealistic 35mm Photography</option>
                <option value="cinematic">Cinematic Movie Still (ARRI / Anamorphic)</option>
                <option value="midjourney">Midjourney v6.1 Tuned</option>
                <option value="anime">Anime & Manga Key Visual</option>
                <option value="general">Universal AI Prompt (General)</option>
                <option value="portrait">Portrait & Studio Lighting</option>
                <option value="product">Luxury Product Photography</option>
                <option value="fashion">Haute Couture Fashion Editorial</option>
                <option value="advertising">Commercial Advertising Hero</option>
                <option value="architecture">Architecture & Interior Design</option>
                <option value="illustration">Digital Concept Illustration</option>
                <option value="3d_render">3D Octane Render / Unreal Engine 5</option>
                <option value="concept_art">Sci-Fi / Fantasy Concept Art</option>
                <option value="flux">Flux.1 [dev/schnell] Natural Prose</option>
                <option value="stable_diffusion">Stable Diffusion XL Masterpiece</option>
                <option value="chatgpt_dalle">ChatGPT DALL-E 3 Narrative</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Target Image Generator</span>
            </label>
            <div className="relative">
              <select
                id="target-model-select"
                value={targetModel}
                onChange={(e) => {
                  const val = e.target.value as TargetModel;
                  setTargetModel(val);
                  trackEvent('target_model_selected', { targetModel: val });
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">Universal (All Generators)</option>
                <option value="midjourney_v6">Midjourney v6.1 (--v 6.1 --ar flags)</option>
                <option value="flux_1">Flux.1 [dev / schnell] (Natural Prose)</option>
                <option value="stable_diffusion_xl">Stable Diffusion XL (Positive + Negative)</option>
                <option value="dalle_3">ChatGPT / DALL-E 3 (Narrative Style)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div>
          <button
            type="button"
            id="toggle-advanced-options"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{showAdvanced ? 'Hide Advanced Settings' : 'Advanced Settings (Detail Level, Negative Tokens, Language)'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 animate-in fade-in duration-150">
              {/* Detail Level */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Detail Level
                </label>
                <select
                  id="detail-level-select"
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(e.target.value as DetailLevel)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                >
                  <option value="concise">Concise (Key Elements)</option>
                  <option value="balanced">Balanced (Recommended)</option>
                  <option value="ultra_detailed">Ultra-Detailed (Optics & Physics)</option>
                </select>
              </div>

              {/* Negative Prompt */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Negative Prompt
                </label>
                <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 cursor-pointer">
                  <input
                    id="include-negative-checkbox"
                    type="checkbox"
                    checked={includeNegative}
                    onChange={(e) => setIncludeNegative(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Generate Negative Filters</span>
                </label>
              </div>

              {/* Output Language */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Language
                </label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                >
                  <option value="en">English (Default)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="sv">Svenska (Swedish)</option>
                  <option value="ar">العربية (Arabic)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info & Generate CTA matching Professional Polish */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          {optimizingStatus ? (
            <div className="flex items-center gap-2 text-indigo-600 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{optimizingStatus}</span>
            </div>
          ) : (
            <>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-slate-600 font-medium">Cloudflare Workers AI Powered</span>
            </>
          )}
        </div>

        <button
          type="submit"
          id="generate-prompt-submit-btn"
          disabled={isLoading || Boolean(optimizingStatus) || (!previewUrl && !selectedFile)}
          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isLoading || Boolean(optimizingStatus) || (!previewUrl && !selectedFile)
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
        >
          {optimizingStatus ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizing Image…</span>
            </>
          ) : (
            <>
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Analyzing Visuals...' : 'Generate AI Prompt'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
