'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { MockupSettings } from '@/types';
import { MOCKUP_PRESETS } from '@/types';

const defaultSettings: MockupSettings = {
  padding: '64',
  background: {
    type: 'gradient',
    value: { from: '#ec4899', to: '#f59e0b' },
  },
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
    // Clean up old object URL if resetting from an image background
    if (settings.background.type === 'image') {
      URL.revokeObjectURL(settings.background.value as string);
    }
    setSettings(defaultSettings);
  };
  
  const applyPreset = (presetName: keyof typeof MOCKUP_PRESETS) => {
    // Clean up old object URL if applying preset over an image background
    if (settings.background.type === 'image') {
      URL.revokeObjectURL(settings.background.value as string);
    }
    setSettings(MOCKUP_PRESETS[presetName]);
  };

  // Effect to clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (settings.background.type === 'image' && settings.background.value) {
        URL.revokeObjectURL(settings.background.value as string);
      }
    };
  }, [settings.background]);


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
