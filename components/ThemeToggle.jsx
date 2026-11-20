'use client';

import { useEffect, useRef, useState } from 'react';
import { applyTheme } from '../lib/theme';
import Icon from './Icon';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);
  const hasPagePreference = useRef(false);

  useEffect(() => {
    const scheme = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      if (hasPagePreference.current) return;
      const next = scheme.matches ? 'dark' : 'light';
      applyTheme(next);
      setTheme(next);
    };
    sync();
    scheme.addEventListener('change', sync);
    return () => scheme.removeEventListener('change', sync);
  }, []);

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    hasPagePreference.current = true;
    applyTheme(next);
    setTheme(next);
  }

  const label = theme ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` : 'Switch color theme';

  return (
    <button type="button" className="theme-toggle" data-b onClick={toggleTheme} aria-label={label} title={label}>
      <Icon name="sun" className="theme-sun" />
      <Icon name="moon" className="theme-moon" />
    </button>
  );
}
