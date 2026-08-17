import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Menu,
  X,
  History,
  Zap,
  Layers,
  FileText,
  Compass,
  ArrowRight,
  Shield,
  Cpu,
  Camera,
} from 'lucide-react';
import { Link, useRouter } from '../lib/router.tsx';

interface HeaderProps {
  onOpenHistory?: () => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory, historyCount = 0 }) => {
  const { path } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shrink-0"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          id="brand-logo"
          to="/"
          className="flex items-center space-x-2 transition-transform hover:opacity-95"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">PromptVision.ai</span>
        </Link>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsDropdownOpen(true)}
            onMouseLeave={() => setToolsDropdownOpen(false)}
          >
            <button
              id="tools-menu-button"
              className={`flex items-center gap-1 transition-colors hover:text-indigo-600 cursor-pointer ${
                path.includes('prompt-generator') || path.includes('image-to-')
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              <span>Tools</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {toolsDropdownOpen && (
              <div
                id="tools-dropdown-menu"
                className="absolute left-0 top-full w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Generators
                </div>
                <Link
                  to="/image-to-prompt"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Image to Prompt</div>
                    <div className="text-[11px] text-slate-500">Universal visual deconstructor</div>
                  </div>
                </Link>

                <Link
                  to="/midjourney-prompt-generator"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Midjourney v6.1</div>
                    <div className="text-[11px] text-slate-500">--v 6.1, --ar & stylize flags</div>
                  </div>
                </Link>

                <Link
                  to="/flux-prompt-generator"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Flux.1 [dev/schnell]</div>
                    <div className="text-[11px] text-slate-500">Natural language descriptive</div>
                  </div>
                </Link>

                <Link
                  to="/stable-diffusion-prompt-generator"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Stable Diffusion XL</div>
                    <div className="text-[11px] text-slate-500">Positive & negative tokens</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Examples Gallery */}
          <Link
            id="nav-examples"
            to="/examples"
            className={`transition-colors hover:text-indigo-600 ${
              path === '/examples' ? 'text-indigo-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Examples
          </Link>

          {/* Blog / Guides */}
          <Link
            id="nav-blog"
            to="/blog"
            className={`transition-colors hover:text-indigo-600 ${
              path.startsWith('/blog') ? 'text-indigo-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Blog
          </Link>

          {/* Pricing */}
          <Link
            id="nav-pricing"
            to="/pricing"
            className={`transition-colors hover:text-indigo-600 ${
              path === '/pricing' ? 'text-indigo-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Pricing
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* History Button */}
          {onOpenHistory && (
            <button
              id="open-history-button"
              onClick={onOpenHistory}
              title="View your recent prompt generations"
              className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {historyCount}
                </span>
              )}
            </button>
          )}

          {/* Primary CTA */}
          <Link
            id="header-cta-generate"
            to="/#generator"
            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium shadow-xs"
          >
            Generate Now
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="border-b border-slate-200 bg-white px-4 py-4 md:hidden animate-in slide-in-from-top-4 duration-200 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">
              Tools
            </div>
            <Link
              to="/image-to-prompt"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Image to Prompt Generator
            </Link>
            <Link
              to="/midjourney-prompt-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Cpu className="w-4 h-4 text-purple-500" />
              Midjourney v6.1 Generator
            </Link>
            <Link
              to="/flux-prompt-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              Flux.1 Prompt Generator
            </Link>
            <Link
              to="/stable-diffusion-prompt-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Layers className="w-4 h-4 text-emerald-500" />
              Stable Diffusion XL Generator
            </Link>

            <div className="h-px bg-slate-200 my-1" />

            <Link
              to="/examples"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              Example Transformations
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              Guides & Blog
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              Pricing & Plans
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
