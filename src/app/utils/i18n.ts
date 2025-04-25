'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations'; // Import translations

// Prevent reinitialization during hot reloads in development
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: translations, // Use imported translations
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });
}

export default i18n;
