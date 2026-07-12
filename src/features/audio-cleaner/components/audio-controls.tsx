
'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, Wind, Volume2, Sparkles } from 'lucide-react';
import type { AudioSettings } from '../types';

interface AudioControlsProps {
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
  disabled?: boolean;
}

export function AudioControls({ settings, onSettingsChange, disabled }: AudioControlsProps) {
  const updateSetting = (key: keyof AudioSettings, value: number[]) => {
    onSettingsChange({ ...settings, [key]: value[0] });
  };

  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Pengaturan Pembersihan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              High-Pass (Hapus Rumble)
            </Label>
            <span className="text-xs font-mono">{settings.highPass} Hz</span>
          </div>
          <Slider
            value={[settings.highPass]}
            onValueChange={(v) => updateSetting('highPass', v)}
            min={0}
            max={500}
            step={10}
            disabled={disabled}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Low-Pass (Hapus Hiss)
            </Label>
            <span className="text-xs font-mono">{settings.lowPass} Hz</span>
          </div>
          <Slider
            value={[settings.lowPass]}
            onValueChange={(v) => updateSetting('lowPass', v)}
            min={2000}
            max={20000}
            step={100}
            disabled={disabled}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smooth Voice (Compression)
            </Label>
            <span className="text-xs font-mono">{settings.compression}:1</span>
          </div>
          <Slider
            value={[settings.compression]}
            onValueChange={(v) => updateSetting('compression', v)}
            min={1}
            max={10}
            step={0.5}
            disabled={disabled}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Gain Output
            </Label>
            <span className="text-xs font-mono">{settings.gain.toFixed(1)}x</span>
          </div>
          <Slider
            value={[settings.gain]}
            onValueChange={(v) => updateSetting('gain', v)}
            min={0.1}
            max={3}
            step={0.1}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
