import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { t, type Locale } from '../lib/i18n';

function tr(key: string, locale: Locale): string {
  return t[key]?.[locale] ?? t[key]?.zh ?? key;
}

function getCurrentLocale(): Locale {
  if (typeof document === 'undefined') return 'zh';
  const lang = document.documentElement.lang;
  const l = lang === 'zh-CN' ? 'zh' : lang;
  return (['zh', 'en', 'ja', 'es'].includes(l) ? l : 'zh') as Locale;
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  const loadPagefind = useCallback(async () => {
    if (loaded.current || !containerRef.current) return;
    const locale = getCurrentLocale();
    try {
      const pagefindPath = '/pagefind/pagefind.js';
      // @ts-ignore
      const pagefind = await import(/* @vite-ignore */ pagefindPath);
      await pagefind.init();

      containerRef.current.innerHTML = '';
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = tr('search.placeholder', locale);
      input.className =
        'w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-tech text-sm';

      const results = document.createElement('div');
      results.className = 'mt-4 max-h-[60vh] overflow-y-auto space-y-2';

      containerRef.current.appendChild(input);
      containerRef.current.appendChild(results);

      input.addEventListener('input', async (e) => {
        const query = (e.target as HTMLInputElement).value;
        results.innerHTML = '';
        if (!query.trim()) return;

        const search = await pagefind.search(query);
        const items = await Promise.all(
          search.results.slice(0, 8).map((r: any) => r.data())
        );

        items.forEach((item: any) => {
          const a = document.createElement('a');
          a.href = item.url;
          a.className =
            'block px-4 py-3 rounded-lg hover:bg-muted/80 transition-colors border border-transparent hover:border-border';
          a.innerHTML = `
            <div class="font-medium text-foreground text-sm">${item.meta?.title || 'Untitled'}</div>
            <div class="text-xs text-muted-foreground mt-1 line-clamp-2">${item.excerpt || ''}</div>
          `;
          a.addEventListener('click', () => setOpen(false));
          results.appendChild(a);
        });

        if (items.length === 0) {
          results.innerHTML =
            `<div class="px-4 py-3 text-muted-foreground text-sm">${tr('search.noResults', locale)}</div>`;
        }
      });

      setTimeout(() => input.focus(), 50);
      loaded.current = true;
    } catch {
      if (containerRef.current) {
        containerRef.current.innerHTML =
          `<div class="text-muted-foreground text-sm px-4 py-3">${tr('search.needBuild', locale)}</div>`;
      }
    }
  }, []);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      loadPagefind();
    } else {
      dialogRef.current?.close();
    }
  }, [open, loadPagefind]);

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Listen for external trigger
  useEffect(() => {
    const trigger = document.getElementById('search-trigger');
    if (trigger) {
      const handler = () => setOpen(true);
      trigger.addEventListener('click', handler);
      return () => trigger.removeEventListener('click', handler);
    }
  }, []);

  const locale = getCurrentLocale();

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      className="w-full max-w-lg mx-auto mt-[15vh] bg-background border border-border rounded-xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Search className="h-4 w-4" />
            <span>{tr('search.label', locale)}</span>
            <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-muted rounded border border-border font-tech">
              Ctrl+K
            </kbd>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div ref={containerRef} />
      </div>
    </dialog>
  );
}
