'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from './en.json';
import te from './te.json';

export type Locale = 'en' | 'te';

type TranslationDict = typeof en;

const dictionaries: Record<Locale, TranslationDict> = { en, te };

/** Resolve a dot-separated key like "customer.home" from the dictionary */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // fallback: return the key itself
    }
  }
  return typeof current === 'string' ? current : path;
}

/** Replace {placeholder} tokens in a translation string */
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr';
}

const I18nContext = createContext<I18nContextType | null>(null);

const LOCALE_STORAGE_KEY = 'pakka-local-locale';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load saved locale on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (saved && (saved === 'en' || saved === 'te')) {
        setLocaleState(saved);
      }
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
    // Update document lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = dictionaries[locale] as unknown as Record<string, unknown>;
      const value = getNestedValue(dict, key);
      return interpolate(value, params);
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir: 'ltr' }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}

export { I18nContext };
