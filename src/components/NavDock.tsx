import Dock, { type DockItemData } from './Dock';
import { Home, BookOpen, FolderOpen, User, Search, Sun, Moon, Rss } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { t, type Locale } from '../lib/i18n';

function tr(key: string, locale: Locale): string {
  return t[key]?.[locale] ?? t[key]?.zh ?? key;
}

export default function NavDock() {
  const [dark, setDark] = useState(true);
  const [locale, setLocale] = useState<Locale>('zh');

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const lang = document.documentElement.lang;
    const l = lang === 'zh-CN' ? 'zh' : lang;
    if (['zh', 'en', 'ja', 'es'].includes(l)) setLocale(l as Locale);

    const handler = (e: Event) => setLocale((e as CustomEvent).detail as Locale);
    window.addEventListener('locale-changed', handler);
    return () => window.removeEventListener('locale-changed', handler);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }, [dark]);

  const openSearch = useCallback(() => {
    document.getElementById('search-trigger')?.click();
  }, []);

  const items: DockItemData[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: tr('nav.home', locale),
      onClick: () => (window.location.href = '/'),
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: tr('nav.blog', locale),
      onClick: () => (window.location.href = '/blog'),
    },
    {
      icon: <FolderOpen className="h-5 w-5" />,
      label: tr('nav.projects', locale),
      onClick: () => (window.location.href = '/projects'),
    },
    {
      icon: <User className="h-5 w-5" />,
      label: tr('nav.about', locale),
      onClick: () => (window.location.href = '/about'),
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: tr('nav.search', locale),
      onClick: openSearch,
    },
    {
      icon: dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />,
      label: dark ? tr('nav.light', locale) : tr('nav.dark', locale),
      onClick: toggleTheme,
    },
    {
      icon: <Rss className="h-5 w-5" />,
      label: 'RSS',
      onClick: () => (window.location.href = '/rss.xml'),
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
      <Dock
        items={items}
        baseItemSize={48}
        magnification={70}
        distance={120}
        panelHeight={64}
        className="bg-card/90 backdrop-blur-md border border-border rounded-2xl shadow-2xl"
      />
    </div>
  );
}
