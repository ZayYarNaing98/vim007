import { create } from "zustand";

export type Theme = "dark" | "light";

const KEY = "vim-typetutor:theme";

function initialTheme(): Theme {
  const saved = localStorage.getItem(KEY);
  // Dark is the default; light only applies once the user picks it.
  return saved === "light" ? "light" : "dark";
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
