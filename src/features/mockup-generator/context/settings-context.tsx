'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { MockupSettings } from '@/features/mockup-generator/types';
import { MOCKUP_PRESETS } from '@/features/mockup-generator/types';

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

  const cleanupBackgroundImage = (currentSettings: MockupSettings) => {
    if (currentSettings.background.type === 'image' && typeof currentSettings.background.value === 'string' && currentSettings.background.value.startsWith('blob:')) {
      URL.revokeObjectURL(currentSettings.background.value);
    }
  };

  const resetSettings = () => {
    cleanupBackgroundImage(settings);
    setSettings(defaultSettings);
  };
  
  const applyPreset = (presetName: keyof typeof MOCKUP_PRESETS) => {
    cleanupBackgroundImage(settings);
    setSettings(MOCKUP_PRESETS[presetName]);
  };

  // Effect to clean up object URL on unmount or when settings change
  useEffect(() => {
    const currentSettings = settings;
    return () => {
      cleanupBackgroundImage(currentSettings);
    };
  }, [settings]);


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
