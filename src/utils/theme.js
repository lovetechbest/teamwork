const STORAGE_KEY = 'appTheme';
const THEMES = ['dark', 'light'];

export const getTheme = () => {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(t) ? t : 'dark';
  } catch {
    return 'dark';
  }
};

export const setTheme = (theme) => {
  if (!THEMES.includes(theme)) return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  } catch (_) {}
};

export const applyStoredTheme = () => {
  document.documentElement.setAttribute('data-theme', getTheme());
};
