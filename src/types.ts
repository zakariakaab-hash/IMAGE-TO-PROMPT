export type PromptMode =
  | 'general'
  | 'photorealistic'
  | 'cinematic'
  | 'portrait'
  | 'product'
  | 'fashion'
  | 'advertising'
  | 'architecture'
  | 'anime'
  | 'illustration'
  | '3d_render'
  | 'concept_art'
  | 'midjourney'
  | 'flux'
  | 'stable_diffusion'
  | 'chatgpt_dalle';

export type TargetModel =
  | 'all'
  | 'midjourney_v6'
  | 'flux_1'
  | 'stable_diffusion_xl'
  | 'dalle_3'
  | 'general_ai';

export type DetailLevel = 'concise' | 'balanced' | 'ultra_detailed';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'sv';

export interface GenerationOptions {
  mode: PromptMode;
  targetModel: TargetModel;
  detailLevel: DetailLevel;
  includeNegative: boolean;
  language: SupportedLanguage;
  aspectRatioHint?: string;
  customInstructions?: string;
}

export interface VisionAnalysisResult {
  mainSubject: string;
  secondarySubjects?: string;
  subjectAppearance?: string;
  ageApproximation?: string;
  poseAndAction?: string;
  facialExpression?: string;
  clothingAndAccessories?: string;
  environmentAndSetting: string;
  foregroundDetails?: string;
  backgroundDetails?: string;
  compositionAndFraming: string;
  cameraAngle: string;
  perspectiveAndShotType: string;
  apparentFocalLength?: string;
  depthOfField: string;
  focusPoint?: string;
  lightingDirection: string;
  lightingQuality: string;
  shadowsAndHighlights?: string;
  colorPalette: string[];
  materialsAndTextures: string[];
  atmosphereAndMood: string;
  artOrPhotographyStyle: string;
  renderingQualityKeywords: string[];
  fineVisualDetails: string[];
  detectedAspectRatio?: string;
  confidenceScore?: number;
}

export interface GeneratedPromptResponse {
  success: boolean;
  prompt: string;
  positivePrompt: string;
  negativePrompt?: string;
  parameters?: string;
  mode: PromptMode;
  targetModel: TargetModel;
  language: SupportedLanguage;
  analysis: VisionAnalysisResult;
  modelDetails: {
    engine: string;
    provider: string;
    processingTimeMs: number;
    tokensEstimated?: number;
  };
  error?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageThumbnail?: string;
  imageFileName?: string;
  prompt: string;
  positivePrompt: string;
  negativePrompt?: string;
  parameters?: string;
  mode: PromptMode;
  targetModel: TargetModel;
  analysis: VisionAnalysisResult;
}

export interface ExamplePreset {
  id: string;
  title: string;
  category: 'portrait' | 'cinematic' | 'product' | 'fashion' | 'landscape' | 'architecture' | 'anime' | '3d_render';
  imageUrl: string;
  thumbnailUrl: string;
  prompt: string;
  negativePrompt?: string;
  parameters?: string;
  mode: PromptMode;
  targetModel: TargetModel;
  tags: string[];
  altText: string;
  analysis: Partial<VisionAnalysisResult>;
}

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  tags: string[];
  coverImage: string;
  contentMarkdown: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOPageData {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  defaultMode: PromptMode;
  defaultTargetModel: TargetModel;
  badgeText: string;
  heroHighlights: string[];
  introduction: string[];
  howItWorksSteps: { title: string; description: string }[];
  keyFeatures: { title: string; description: string; iconName: string }[];
  targetAudience: { title: string; description: string }[];
  faqs: FAQItem[];
  relatedSlugs: string[];
}
