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
  LayoutGrid,
  Mic2,
  Music,
  Headphones,
  Radio,
  Phone,
  Tv,
  VolumeX,
  Mountain,
  Bot,
  Speaker,
  Disc,
  Film,
  Users,
  Home,
  Newspaper,
  Mic,
  Cpu,
  Dumbbell,
  Info
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { voiceProfiles, type AudioSettings } from '../types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, any> = {
  Mic2, Music, Headphones, Radio, Phone, Tv, VolumeX, Zap, Waves, Mountain, Bot, Speaker, Disc, Film, Users, Home, Newspaper, Mic, Cpu, Wind, Dumbbell
};

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
    <Card className="glass-panel border-none shadow-2xl overflow-hidden flex flex-col h-[550px]">
      <CardHeader className="bg-accent/10 border-b border-accent/20 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            FX Workstation
          </CardTitle>
          <Badge variant="outline" className="text-[9px] uppercase border-accent/30 text-accent">Master Engine</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <Tabs defaultValue="profiles" className="w-full h-full flex flex-col">
          <TabsList className="w-full rounded-none h-10 bg-muted/50 border-b">
            <TabsTrigger value="profiles" className="flex-1 text-xs gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5" /> Profil
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-1 text-xs gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="flex-grow m-0 p-0 overflow-hidden">
            <ScrollArea className="h-[430px] p-4">
              <div className="grid grid-cols-2 gap-2 pb-4">
                {voiceProfiles.map((profile) => {
                  const Icon = iconMap[profile.icon] || Mic2;
                  const isActive = settings.profile === profile.id;
                  return (
                    <button
                      key={profile.id}
                      onClick={() => updateSetting('profile', profile.id)}
                      disabled={disabled}
                      className={cn(
                        "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center gap-1.5 min-h-[85px]",
                        isActive 
                          ? "bg-accent border-accent text-white shadow-lg ring-2 ring-accent/20" 
                          : "bg-background/50 border-border hover:border-accent/50 hover:bg-accent/5"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-accent")} />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold leading-tight">{profile.label}</p>
                        <p className={cn("text-[8px] leading-tight opacity-70", isActive ? "text-white" : "text-muted-foreground")}>
                          {profile.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="manual" className="p-5 m-0 space-y-5 overflow-y-auto h-[430px]">
             <div className="bg-muted/30 p-3 rounded-lg flex gap-3 items-start">
               <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
               <p className="text-[10px] text-muted-foreground leading-normal">
                 Gunakan kontrol manual untuk tuning halus setelah memilih profil.
               </p>
             </div>

            {[
              { label: 'High-Pass', icon: Wind, key: 'highPass', min: 0, max: 800, step: 10, suffix: 'Hz' },
              { label: 'Low-Pass', icon: Waves, key: 'lowPass', min: 1000, max: 20000, step: 100, suffix: 'Hz' },
              { label: 'Distortion', icon: Zap, key: 'distortion', min: 0, max: 100, step: 1, suffix: '%' },
              { label: 'Echo', icon: Repeat, key: 'echo', min: 0, max: 100, step: 1, suffix: '%', multiplier: 100 },
              { label: 'Gain', icon: Volume2, key: 'gain', min: 0.1, max: 3, step: 0.1, suffix: 'x' },
            ].map((slider) => (
              <div key={slider.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-[11px] font-semibold">
                    <slider.icon className="h-3.5 w-3.5 text-accent" /> {slider.label}
                  </Label>
                  <span className="text-[10px] font-mono bg-accent/10 px-1.5 py-0.5 rounded text-accent">
                    {slider.multiplier ? Math.round(settings[slider.key as keyof AudioSettings] as number * slider.multiplier) : settings[slider.key as keyof AudioSettings]}{slider.suffix}
                  </span>
                </div>
                <Slider
                  value={[slider.multiplier ? (settings[slider.key as keyof AudioSettings] as number * slider.multiplier) : (settings[slider.key as keyof AudioSettings] as number)]}
                  onValueChange={(v) => updateSetting(slider.key as keyof AudioSettings, slider.multiplier ? v[0] / slider.multiplier : v[0])}
                  min={slider.min} max={slider.max} step={slider.step} disabled={disabled}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
