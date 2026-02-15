import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true); // 默认为深色模式

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label={dark ? '切换亮色模式' : '切换暗色模式'}
    >
      <Sun className={`h-5 w-5 transition-all ${dark ? 'scale-0 rotate-90 opacity-0 absolute' : 'scale-100 rotate-0'}`} />
      <Moon className={`h-5 w-5 transition-all ${dark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90 opacity-0 absolute'}`} />
    </button>
  );
}
