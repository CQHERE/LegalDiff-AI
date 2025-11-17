import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type ThemeKey = 'beige' | 'green' | 'mono';

const THEME_CLASS: Record<ThemeKey, string> = {
  beige: 'theme-beige',
  green: 'theme-green',
  mono: 'theme-mono',
};

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeKey>(() => {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('ui-theme')) as ThemeKey | null;
    return saved || 'beige';
  });

  useEffect(() => {
    const el = document.documentElement;
    // remove previous
    Object.values(THEME_CLASS).forEach((cls) => el.classList.remove(cls));
    el.classList.add(THEME_CLASS[theme]);
    try {
      localStorage.setItem('ui-theme', theme);
    } catch {}
  }, [theme]);

  const btnBase = 'h-8 px-2 text-xs';

  return (
    <div className="inline-flex items-center gap-1">
      <Button variant={theme === 'beige' ? 'default' : 'ghost'} className={btnBase} onClick={() => setTheme('beige')}>
        米色系
      </Button>
      <Button variant={theme === 'green' ? 'default' : 'ghost'} className={btnBase} onClick={() => setTheme('green')}>
        绿色系
      </Button>
      <Button variant={theme === 'mono' ? 'default' : 'ghost'} className={btnBase} onClick={() => setTheme('mono')}>
        黑白
      </Button>
    </div>
  );
}

