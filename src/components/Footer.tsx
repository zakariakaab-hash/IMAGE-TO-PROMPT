import React from 'react';
import { Sparkles, Shield, Lock, Cloud, ArrowUpRight } from 'lucide-react';
import { Link } from '../lib/router.tsx';

export const Footer: React.FC = () => {
  return (
    <footer
      id="site-footer"
      className="border-t border-slate-200 bg-white text-slate-600 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                PromptVision.ai
              </span>
            </Link>
            <p className="max-w-sm text-sm text-slate-500 leading-relaxed">
              Turn any image into a detailed, high-quality prompt for Midjourney, Flux, Stable Diffusion, or ChatGPT using Cloudflare Workers AI LLaVA vision analysis.
            </p>

            {/* Cloudflare Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 shadow-2xs">
              <Cloud className="h-3.5 w-3.5 text-amber-500" />
              <span>Powered by Cloudflare Workers AI LLaVA 1.5</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" /> 100% In-Memory Processing
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-indigo-500" /> Zero Permanent Storage
              </span>
            </div>
          </div>

          {/* Column 1: AI Prompt Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              AI Tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/image-to-prompt" className="hover:text-indigo-600 transition-colors">
                  Image to Prompt
                </Link>
              </li>
              <li>
                <Link to="/ai-image-prompt-generator" className="hover:text-indigo-600 transition-colors">
                  AI Image Prompt Generator
                </Link>
              </li>
              <li>
                <Link to="/image-prompt-generator" className="hover:text-indigo-600 transition-colors">
                  Image Prompt Generator
                </Link>
              </li>
              <li>
                <Link to="/photo-to-prompt" className="hover:text-indigo-600 transition-colors">
                  Photo to Prompt
                </Link>
              </li>
              <li>
                <Link to="/image-to-text-prompt" className="hover:text-indigo-600 transition-colors">
                  Image to Text Prompt
                </Link>
              </li>
              <li>
                <Link to="/ai-art-prompt-generator" className="hover:text-indigo-600 transition-colors">
                  AI Art Prompt Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Generator Models */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Target Models
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/midjourney-prompt-generator" className="hover:text-indigo-600 transition-colors">
                  Midjourney v6.1 Generator
                </Link>
              </li>
              <li>
                <Link to="/flux-prompt-generator" className="hover:text-indigo-600 transition-colors">
                  Flux.1 [dev] Generator
                </Link>
              </li>
              <li>
                <Link to="/stable-diffusion-prompt-generator" className="hover:text-indigo-600 transition-colors">
                  Stable Diffusion XL / SD3
                </Link>
              </li>
              <li>
                <Link to="/examples" className="hover:text-indigo-600 transition-colors">
                  Example Gallery
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-indigo-600 transition-colors">
                  SaaS Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Resources & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="hover:text-indigo-600 transition-colors">
                  Guides & Tutorials
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-600 transition-colors">
                  About PromptVision
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-indigo-600 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar matching Professional Polish */}
        <div className="mt-10 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center space-x-6">
            <span>© {new Date().getFullYear()} PromptVision.ai</span>
            <Link to="/terms" className="hover:text-slate-800 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-slate-800 transition-colors">
              Privacy
            </Link>
            <Link to="/status" className="hover:text-slate-800 transition-colors">
              Status
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-medium text-slate-700">API Operational</span>
            </span>
            <span className="text-slate-400">•</span>
            <span>Built on Cloudflare Workers AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
