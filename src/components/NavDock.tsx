import Dock, { type DockItemData } from './Dock';
import { Home, BookOpen, FolderOpen, User, Search, Sun, Moon, Rss } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NavDock() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const openSearch = () => {
    document.getElementById('search-trigger')?.click();
  };

  const items: DockItemData[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: '首页',
      onClick: () => (window.location.href = '/'),
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: '博客',
      onClick: () => (window.location.href = '/blog'),
    },
    {
      icon: <FolderOpen className="h-5 w-5" />,
      label: '项目',
      onClick: () => (window.location.href = '/projects'),
    },
    {
      icon: <User className="h-5 w-5" />,
      label: '关于',
      onClick: () => (window.location.href = '/about'),
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: '搜索',
      onClick: openSearch,
    },
    {
      icon: dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />,
      label: dark ? '亮色' : '暗色',
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
