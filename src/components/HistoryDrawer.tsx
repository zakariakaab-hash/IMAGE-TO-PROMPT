import React from 'react';
import { X, Copy, Trash2, Clock, Check, Sparkles, ExternalLink } from 'lucide-react';
import type { HistoryItem } from '../types.ts';
import { useToast } from './Toast.tsx';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onSelectPrompt: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onDeleteItem,
  onSelectPrompt,
}) => {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (item: HistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopiedId(item.id);
      showToast('Prompt copied from history!', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Could not copy', 'error');
    }
  };

  return (
    <div id="history-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      <div
        id="history-drawer-panel"
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Prompt History
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                id="clear-all-history-btn"
                onClick={onClearHistory}
                className="rounded-lg p-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="Clear all history"
              >
                Clear all
              </button>
            )}
            <button
              id="close-history-drawer-btn"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Clock className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm font-medium">No prompts generated yet</p>
              <p className="text-xs text-slate-500">
                Your recent reverse-engineered prompts will appear here automatically.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                id={`history-card-${item.id}`}
                className="group relative rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                    {item.mode}
                  </span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-3 font-mono leading-relaxed mb-3">
                  {item.prompt}
                </p>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-800/60">
                  <button
                    id={`copy-history-item-${item.id}`}
                    onClick={() => handleCopy(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      id={`load-history-item-${item.id}`}
                      onClick={() => {
                        onSelectPrompt(item);
                        onClose();
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      View
                    </button>
                    <button
                      id={`delete-history-item-${item.id}`}
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                      title="Delete item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
