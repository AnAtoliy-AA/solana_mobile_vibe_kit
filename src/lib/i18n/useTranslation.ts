// Custom hook for translations

import { useSettingsStore } from '../stores/useSettingsStore';
import { translations, Translations } from './translations';

export const useTranslation = (): Translations => {
  const language = useSettingsStore((state) => state.language);
  return translations[language];
};
