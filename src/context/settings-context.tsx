'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { MockupSettings } from '@/types';
import { MOCKUP_PRESETS } from '@/types';

const defaultSettings: MockupSettings = {
  padding: '64',
  background: { from: '#ec4899', to: '#f59e0b' },
  darkMode: true,
  shadow: '2xl',
  radius: 'xl',
  screenshotRadius: 'lg',
  noise: false,
  position: 'center',
};

type SettingsContextType = {
  settings: MockupSettings;
  setSettings: React.Dispatch<React.SetStateAction<MockupSettings>>;
  resetSettings: () => void;
  applyPreset: (presetName: keyof typeof MOCKUP_PRESETS) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MockupSettings>(defaultSettings);

  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  const applyPreset = (presetName: keyof typeof MOCKUP_PRESETS) => {
    setSettings(MOCKUP_PRESETS[presetName]);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetSettings, applyPreset }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
