'use client';

import { useEffect, useState } from 'react';
import { applyTheme, getThemePreference, THEME_KEY } from '../lib/theme';
import Icon from './Icon';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const scheme = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      const next = getThemePreference() || (scheme.matches ? 'dark' : 'light');
      applyTheme(next);
      setTheme(next);
    };
    const onStorage = (event) => { if (event.key === THEME_KEY || event.key === null) sync(); };
    sync();
    scheme.addEventListener('change', sync);
    addEventListener('storage', onStorage);
    return () => {
      scheme.removeEventListener('change', sync);
      removeEventListener('storage', onStorage);
    };
  }, []);

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch {
      // The toggle still works when browser storage is unavailable.
    }
  }

  const label = theme ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` : 'Switch color theme';

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={label} title={label}>
      <Icon name="sun" className="theme-sun" />
      <Icon name="moon" className="theme-moon" />
    </button>
  );
}
