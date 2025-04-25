'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'Core Keeper Collection Tracker',
      workInProgress: '! Work in Progress ! Unstable release',
    },
  },
  de: {
    translation: {
      title: 'Core Keeper Sammlungs-Tracker',
      workInProgress: '! Arbeit in Bearbeitung ! Instabile Version',
    },
  },
};

// Prevent reinitialization during hot reloads in development
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });
}

export default i18n;
