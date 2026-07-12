'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Waves, 
  Wind, 
  Volume2, 
  Sparkles, 
  Zap, 
  Repeat,
  LayoutGrid
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { voiceProfiles, type AudioSettings, type VoiceProfileId } from '../types';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface AudioControlsProps {
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
  disabled?: boolean;
}

export function AudioControls({ settings, onSettingsChange, disabled }: AudioControlsProps) {
  const updateSetting = (key: keyof AudioSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card className="glass-panel border-none shadow-xl overflow-hidden">
      <CardHeader className="bg-primary/10 border-b border-primary/20">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Master FX Control
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="w-full rounded-none h-12 bg-muted/30 border-b">
            <TabsTrigger value="profiles" className="flex-1 gap-2">
              <LayoutGrid className="w-4 h-4" /> Profil
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-1 gap-2">
              <Zap className="w-4 h-4" /> Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="p-4 m-0">
            <div className="grid grid-cols-2 gap-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {voiceProfiles.map((profile) => {
                const Icon = (Icons as any)[profile.icon] || Icons.Mic2;
                const isActive = settings.profile === profile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => updateSetting('profile', profile.id)}
                    disabled={disabled}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center gap-2",
                      isActive 
                        ? "bg-accent border-accent text-white shadow-lg scale-95" 
                        : "bg-background/50 border-border hover:border-accent/50 hover:bg-accent/5"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", isActive ? "text-white" : "text-accent")} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold leading-tight">{profile.label}</p>
                      <p className={cn("text-[9px] leading-tight", isActive ? "text-white/80" : "text-muted-foreground")}>
                        {profile.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="manual" className="p-6 m-0 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <Wind className="h-3 w-3" /> High-Pass (Rumble)
                </Label>
                <span className="text-[10px] font-mono">{settings.highPass}Hz</span>
              </div>
              <Slider
                value={[settings.highPass]}
                onValueChange={(v) => updateSetting('highPass', v[0])}
                min={0} max={800} step={10} disabled={disabled}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <Waves className="h-3 w-3" /> Low-Pass (Hiss)
                </Label>
                <span className="text-[10px] font-mono">{settings.lowPass}Hz</span>
              </div>
              <Slider
                value={[settings.lowPass]}
                onValueChange={(v) => updateSetting('lowPass', v[0])}
                min={1000} max={20000} step={100} disabled={disabled}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <Zap className="h-3 w-3" /> Distortion
                </Label>
                <span className="text-[10px] font-mono">{settings.distortion}%</span>
              </div>
              <Slider
                value={[settings.distortion]}
                onValueChange={(v) => updateSetting('distortion', v[0])}
                min={0} max={100} step={1} disabled={disabled}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <Repeat className="h-3 w-3" /> Echo Intensity
                </Label>
                <span className="text-[10px] font-mono">{Math.round(settings.echo * 100)}%</span>
              </div>
              <Slider
                value={[settings.echo * 100]}
                onValueChange={(v) => updateSetting('echo', v[0] / 100)}
                min={0} max={100} step={1} disabled={disabled}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <Volume2 className="h-3 w-3" /> Master Gain
                </Label>
                <span className="text-[10px] font-mono">{settings.gain.toFixed(1)}x</span>
              </div>
              <Slider
                value={[settings.gain]}
                onValueChange={(v) => updateSetting('gain', v[0])}
                min={0.1} max={3} step={0.1} disabled={disabled}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
