import { create } from "zustand";

export type Theme = "dark" | "light";

const KEY = "vim-typetutor:theme";

function initialTheme(): Theme {
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

type ThemeState = {
  theme: Theme;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme(),
  toggleTheme: () => {
    const theme: Theme = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem(KEY, theme);
    set({ theme });
  },
}));
