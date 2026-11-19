export const THEME_KEY = "chirag-portfolio:theme:v1";
export const THEME_COLORS = { light: "#f4f6fb", dark: "#141b29" };

export function getThemePreference() {
  try {
    const preference = localStorage.getItem(THEME_KEY);
    return preference === "light" || preference === "dark" ? preference : null;
  } catch {
    return null;
  }
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

export const themeScript = `
(() => {
  let preference;
  try { preference = localStorage.getItem('${THEME_KEY}'); } catch {}
  const theme = preference === 'light' || preference === 'dark'
    ? preference
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
})();
`;
