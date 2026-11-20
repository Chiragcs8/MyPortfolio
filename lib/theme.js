const LEGACY_THEME_KEY = "chirag-portfolio:theme:v1";
export const THEME_COLORS = { light: "#f4f6fb", dark: "#141b29" };

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

export const themeScript = `
(() => {
  // Remove the previously saved preference; themes now last for this page only.
  try { localStorage.removeItem('${LEGACY_THEME_KEY}'); } catch {}
  document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
})();
`;
