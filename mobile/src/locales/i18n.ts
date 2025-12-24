import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

import en from './en.json';
import ar from './ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Get device language
const deviceLanguage = Localization.locale.split('-')[0];
const supportedLanguages = ['en', 'ar'];
const defaultLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Function to change language and handle RTL
export const changeLanguage = async (language: 'en' | 'ar') => {
  await i18n.changeLanguage(language);
  
  const isRTL = language === 'ar';
  
  // Force RTL layout for Arabic
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // Note: App will need to restart for RTL changes to take effect
  }
};

export default i18n;
