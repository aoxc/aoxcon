import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import trTranslation from './locales/tr/translation.json';

/**
 * @title AOXC Neural OS - Internationalization Bootstrap
 * @notice Initializes the i18n runtime with deterministic language resolution.
 * @dev Supported languages are explicitly constrained to avoid ambiguous browser
 *      locale expansion and to preserve stable fallback behavior.
 */

const resources = {
  en: {
    translation: enTranslation,
  },
  tr: {
    translation: trTranslation,
  },
} as const;

const SUPPORTED_LANGUAGES = ['en', 'tr'] as const;

/**
 * @notice Initializes the i18n subsystem exactly once for the frontend runtime.
 * @dev The detector is configured to prioritize persisted user choice before
 *      browser language inference. Unsupported locale variants are normalized
 *      to the nearest supported base language.
 */
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    load: 'languageOnly',
    cleanCode: true,
    nonExplicitSupportedLngs: true,
    debug: false,

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'aoxc_language',
    },

    interpolation: {
      escapeValue: false,
    },

    returnNull: false,
    returnEmptyString: false,
  });

export default i18n;
