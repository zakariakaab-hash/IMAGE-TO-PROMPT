import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './lib/router.tsx';
import { ToastProvider } from './components/Toast.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { SeoLandingPage } from './pages/SeoLandingPage.tsx';
import { SEO_LANDING_PAGES } from './data/seoPages.ts';
import { BLOG_ARTICLES } from './data/blogArticles.ts';
import { ExampleGallery } from './components/ExampleGallery.tsx';
import { getHistory, deleteHistoryItem, clearAllHistory } from './lib/history.ts';
import type { ExamplePreset, HistoryItem } from './types.ts';
import { Link } from './lib/router.tsx';
import { Check, Sparkles, Zap, Shield, HelpCircle, ArrowRight, ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { SEOHead } from './components/SEOHead.tsx';

const AppContent: React.FC = () => {
  const { path, navigate } = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [activeHistoryItem, setActiveHistoryItem] = useState<HistoryItem | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<ExamplePreset | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistoryList(getHistory());
  }, []);

  const handlePromptGenerated = (item: HistoryItem) => {
    setHistoryList(getHistory());
    setActiveHistoryItem(item);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setActiveHistoryItem(item);
    if (path !== '/') {
      navigate('/');
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistoryList(updated);
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistoryList([]);
  };

  // Route Dispatching
  const cleanSlug = path.replace(/^\//, '').split('?')[0];

  const renderContent = () => {
    // 1. Home Page
    if (path === '/' || path === '') {
      return (
        <HomePage
          onPromptGenerated={handlePromptGenerated}
          selectedPresetToLoad={selectedPreset}
          activeHistoryItem={activeHistoryItem}
        />
      );
    }

    // 2. SEO Landing Pages (e.g. /image-to-prompt, /midjourney-prompt-generator, etc.)
    if (SEO_LANDING_PAGES[cleanSlug]) {
      return <SeoLandingPage slug={cleanSlug} />;
    }

    // 3. Examples Gallery Page
    if (cleanSlug === 'examples') {
      return (
        <div className="min-h-screen">
          <SEOHead
            title="AI Prompt Examples Gallery – Midjourney, Flux, SDXL"
            description="Browse curated example image-to-prompt transformations. Discover how lighting, optics, and styles translate into model prompts."
            canonicalPath="/examples"
          />
          <div className="pt-10 pb-8 text-center bg-slate-50 border-b border-slate-200">
            <div className="mx-auto max-w-4xl px-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Sparkles className="w-3.5 h-3.5" /> Curated Showcase
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Example Image-to-Prompt Transformations
              </h1>
              <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
                Explore real reference visual breakdowns and copy production-tested prompts directly into your AI workflow.
              </p>
            </div>
          </div>
          <ExampleGallery
            onSelectExample={(preset) => {
              setSelectedPreset(preset);
              navigate('/');
            }}
          />
        </div>
      );
    }

    // 4. Blog / Guides List
    if (cleanSlug === 'blog') {
      return (
        <div className="min-h-screen">
          <SEOHead
            title="Prompt Engineering Guides & Tutorials – PromptLens AI"
            description="Deep-dive tutorials on prompt reverse-engineering, camera focal length prompts, Midjourney v6 syntax, and Flux parameter optimization."
            canonicalPath="/blog"
          />
          <div className="pt-12 pb-10 text-center bg-slate-50 border-b border-slate-200">
            <div className="mx-auto max-w-4xl px-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <BookOpen className="w-3.5 h-3.5" /> Knowledge Base
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Prompt Engineering Guides & Tutorials
              </h1>
              <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
                Master the science of reverse-engineering visual references for Midjourney, Flux, and SDXL.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {BLOG_ARTICLES.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-16/9 w-full overflow-hidden bg-slate-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-indigo-600">{article.tags[0]}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                      <span>Read full guide</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 5. Individual Blog Article
    if (cleanSlug.startsWith('blog/')) {
      const articleSlug = cleanSlug.replace('blog/', '');
      const article = BLOG_ARTICLES.find((a) => a.slug === articleSlug) || BLOG_ARTICLES[0];

      return (
        <div className="min-h-screen">
          <SEOHead
            title={`${article.title} – PromptLens AI`}
            description={article.description}
            canonicalPath={`/blog/${article.slug}`}
          />
          <div className="mx-auto max-w-3xl px-4 py-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to all articles
            </Link>

            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="rounded bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700">
                {article.tags[0]}
              </span>
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>

            <div className="mt-4 flex items-center gap-3 border-y border-slate-100 py-3">
              <img
                src={article.author.avatarUrl}
                alt={article.author.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">{article.author.name}</div>
                <div className="text-xs text-slate-500">{article.author.role}</div>
              </div>
            </div>

            <div className="mt-6 aspect-16/9 w-full overflow-hidden rounded-2xl border border-slate-200">
              <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
            </div>

            {/* Article Body */}
            <div className="mt-8 space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed prose prose-slate max-w-none">
              {article.contentMarkdown.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-xl font-bold text-slate-900 mt-8 mb-3">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('---')) {
                  return <hr key={index} className="my-6 border-slate-200" />;
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>

            {/* Try CTA */}
            <div className="mt-12 rounded-2xl bg-indigo-50 border border-indigo-200 p-8 text-center">
              <h3 className="text-xl font-bold text-indigo-950">Ready to Reverse-Engineer Your Images?</h3>
              <p className="mt-2 text-sm text-indigo-800 max-w-lg mx-auto">
                Upload any photograph or digital visual into our free Cloudflare-powered AI prompt engine.
              </p>
              <Link
                to="/#generator"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Start Generating Now
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // 6. Pricing Page
    if (cleanSlug === 'pricing') {
      return (
        <div className="min-h-screen">
          <SEOHead
            title="Simple, Transparent Plans – PromptLens AI"
            description="Start for free with unlimited standard prompt generations, or upgrade for batch processing and API access."
            canonicalPath="/pricing"
          />
          <div className="pt-12 pb-12 text-center bg-slate-50 border-b border-slate-200">
            <div className="mx-auto max-w-4xl px-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Sparkles className="w-3.5 h-3.5" /> Fair & Accessible
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Transparent Plans for Every Creator
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
                No credit card required to start. Generate high-precision AI prompts with zero hassle.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Free Tier</h3>
                  <p className="text-xs text-slate-500 mt-1">For casual creators & prompt hobbyists</p>
                  <div className="mt-4 text-3xl font-extrabold text-slate-900">$0 <span className="text-sm font-normal text-slate-500">/ forever</span></div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Standard Generations</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 16+ Aesthetic Style Modes</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Midjourney, Flux & SDXL Support</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Negative Prompt Synthesis</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100% In-Memory Privacy</li>
                  </ul>
                </div>
                <Link to="/#generator" className="mt-8 block text-center rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                  Use Free Now
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-6 shadow-xl flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Most Popular
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Pro Studio</h3>
                  <p className="text-xs text-slate-500 mt-1">For commercial designers & studio workflows</p>
                  <div className="mt-4 text-3xl font-extrabold text-indigo-600">$12 <span className="text-sm font-normal text-slate-500">/ month</span></div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-indigo-600" /> Everything in Free</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Batch Multi-Image Uploads (Up to 20)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Ultra-Detailed Optics Analysis</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Priority Cloudflare Workers Edge Speed</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Export to CSV & Batch JSON</li>
                  </ul>
                </div>
                <Link to="/#generator" className="mt-8 block text-center rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-md">
                  Get Started with Pro
                </Link>
              </div>

              {/* API Plan */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">API & Enterprise</h3>
                  <p className="text-xs text-slate-500 mt-1">For software developers & apps</p>
                  <div className="mt-4 text-3xl font-extrabold text-slate-900">$49 <span className="text-sm font-normal text-slate-500">/ month</span></div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 50,000 API Calls / Month</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Direct REST / WebSocket Endpoint</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated SLA & 99.9% Uptime</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom System Prompt Tuning</li>
                  </ul>
                </div>
                <Link to="/#generator" className="mt-8 block text-center rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 7. General Legal / Informational Pages (About, Terms, Privacy, Contact, Cookies)
    if (['about', 'terms', 'privacy', 'cookies', 'contact'].includes(cleanSlug)) {
      const titles: Record<string, string> = {
        about: 'About PromptLens AI',
        terms: 'Terms of Service',
        privacy: 'Privacy & Data Retention Policy',
        cookies: 'Cookie Policy',
        contact: 'Contact Support & Inquiries',
      };

      return (
        <div className="min-h-screen py-12">
          <SEOHead title={`${titles[cleanSlug]} – PromptLens AI`} canonicalPath={`/${cleanSlug}`} />
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">{titles[cleanSlug]}</h1>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 text-sm text-slate-700 leading-relaxed shadow-sm">
              <p>
                <strong>PromptLens AI</strong> is an open platform designed for prompt creators, game designers, concept artists, and AI visual engineers.
              </p>
              <p>
                <strong>Zero Image Storage Guarantee:</strong> All images uploaded to the generator are processed solely in memory via Cloudflare Workers AI and are permanently discarded the instant analysis completes. We do not store, catalog, train on, or monetize user images.
              </p>
              <p>
                For questions, feature requests, or enterprise integrations, contact our engineering team anytime at{' '}
                <a href="mailto:support@promptvision.ai" className="text-indigo-600 font-semibold hover:underline">
                  support@promptvision.ai
                </a>.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Fallback -> Default Home
    return <HomePage onPromptGenerated={handlePromptGenerated} />;
  };

  return (
    <div id="app-root" className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyList.length}
      />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyList}
        onClearHistory={handleClearAllHistory}
        onDeleteItem={handleDeleteHistoryItem}
        onSelectPrompt={handleSelectHistoryItem}
      />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </RouterProvider>
  );
}
