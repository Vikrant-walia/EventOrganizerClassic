// context/ThemeContext.js
import React, { createContext, useContext, useMemo, useState } from 'react';

const Dark = {
  bg: '#0f172a',    // slate-900
  card: '#111827',  // gray-900
  border: '#1f2937',
  text: '#e5e7eb',
  sub: '#9ca3af',
  primary: '#22c55e',
  danger: '#ef4444',
  accent: '#38bdf8',
  chip: '#1f2937',
  input: '#0b1220',
};

const Light = {
  bg: '#f8fafc',     // slate-50
  card: '#ffffff',   // white
  border: '#e5e7eb',
  text: '#0f172a',
  sub: '#475569',
  primary: '#16a34a',
  danger: '#dc2626',
  accent: '#0284c7',
  chip: '#f1f5f9',
  input: '#ffffff',
};

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const COLORS = isDark ? Dark : Light;

  const value = useMemo(() => ({
    COLORS,
    isDark,
    toggleTheme: () => setIsDark((v) => !v),
  }), [isDark]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
