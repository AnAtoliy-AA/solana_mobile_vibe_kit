// Settings store for language and theme preferences

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'de' | 'fr';
export type Theme =
  | 'default'
  | 'dark'
  | 'ocean'
  | 'sunset'
  | 'neon-cyan'
  | 'neon-purple'
  | 'neon-green'
  | 'neon-pink';

interface SettingsState {
  language: Language;
  theme: Theme;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'dark',
      setLanguage: (language: Language) => set({ language }),
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'launchpad-settings',
      onRehydrateStorage: () => (state) => {
        // Apply saved theme on load
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
