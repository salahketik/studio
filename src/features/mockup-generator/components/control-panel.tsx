'use client';

import { useRef, useState } from 'react';
import { useSettings } from '@/features/mockup-generator/context/settings-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from './color-picker';
import { MOCKUP_PRESETS } from '@/features/mockup-generator/types';
import { RefreshCcw, Palette, Image as ImageIcon, Framer, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export function ControlPanel() {
  const { settings, setSettings, resetSettings, applyPreset } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleBackgroundTypeChange = (type: 'gradient' | 'image') => {
    setSettings(prev => {
      if (prev.background.type === 'image' && type !== 'image' && typeof prev.background.value === 'string') {
        if (prev.background.value.startsWith('blob:')) {
            URL.revokeObjectURL(prev.background.value);
        }
      }
      
      const defaultValue = type === 'gradient'
        ? MOCKUP_PRESETS['Gradient Soft'].background.value
        : '';

      return {
        ...prev,
        background: {
          type,
          value: defaultValue,
        }
      }
    });
  };
  
  const handleGradientColorChange = (colorType: 'from' | 'to', value: string) => {
    setSettings(prev => {
        const currentGradient = prev.background.type === 'gradient' ? prev.background.value as { from: string, to: string } : { from: '#000000', to: '#ffffff' };
        return {
            ...prev,
            background: {
                type: 'gradient',
                value: {
                    ...currentGradient,
                    [colorType]: value,
                }
            }
        }
    })
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Tipe File Tidak Valid',
        description: 'Silakan unggah file gambar.',
      });
      return;
    }

    setSettings(prev => {
      if (prev.background.type === 'image' && prev.background.value && typeof prev.background.value === 'string') {
        if (prev.background.value.startsWith('blob:')) {
            URL.revokeObjectURL(prev.background.value);
        }
      }
      const newImageUrl = URL.createObjectURL(file);
      return {
        ...prev,
        background: {
          type: 'image',
          value: newImageUrl,
        }
      }
    })
  };

  const backgroundValue = settings.background.type === 'gradient' ? settings.background.value as { from: string, to: string } : { from: '#000000', to: '#000000' };

  const sections = [
    {
      title: 'Preset',
      icon: Palette,
      content: (
        <div className="grid grid-cols-2 gap-2">
            {Object.keys(MOCKUP_PRESETS).map((preset) => (
                <Button key={preset} variant="outline" size="sm" onClick={() => applyPreset(preset as keyof typeof MOCKUP_PRESETS)} className="text-[11px] h-8 rounded-xl font-bold uppercase tracking-widest">
                    {preset}
                </Button>
            ))}
        </div>
      )
    },
    {
      title: 'Latar',
      icon: ImageIcon,
      content: (
        <Tabs value={settings.background.type} onValueChange={(value) => handleBackgroundTypeChange(value as 'gradient' | 'image')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl h-10">
                <TabsTrigger value="gradient" className="text-[10px] font-bold uppercase tracking-widest">Warna</TabsTrigger>
                <TabsTrigger value="image" className="text-[10px] font-bold uppercase tracking-widest">Gambar</TabsTrigger>
            </TabsList>
            <TabsContent value="gradient" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Mulai</Label>
                    <ColorPicker
                        background={backgroundValue.from}
                        setBackground={(val) => handleGradientColorChange('from', val)}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Selesai</Label>
                    <ColorPicker
                        background={backgroundValue.to}
                        setBackground={(val) => handleGradientColorChange('to', val)}
                    />
                </div>
            </TabsContent>
            <TabsContent value="image" className="pt-4 space-y-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                />
                <Button variant="outline" className="w-full h-11 text-[10px] uppercase font-bold tracking-widest rounded-xl" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="mr-2 h-4 w-4" /> Pilih Gambar Lokal
                </Button>
                <p className="text-[9px] text-muted-foreground italic text-center">Gunakan gambar resolusi tinggi untuk hasil terbaik.</p>
            </TabsContent>
            <div className="flex items-center justify-between pt-4 border-t mt-4">
                <Label htmlFor="noise-switch" className="text-[10px] uppercase font-bold text-muted-foreground">Efek Noise</Label>
                <Switch
                    id="noise-switch"
                    checked={settings.noise}
                    onCheckedChange={(val) => handleSettingChange('noise', val)}
                />
            </div>
        </Tabs>
      ),
    },
    {
      title: 'Frame',
      icon: Framer,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Padding</Label>
            <Select
              value={settings.padding}
              onValueChange={(val) => handleSettingChange('padding', val)}
            >
              <SelectTrigger className="w-[120px] h-9 rounded-xl text-[10px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="32" className="text-[11px]">Kecil</SelectItem>
                <SelectItem value="64" className="text-[11px]">Sedang</SelectItem>
                <SelectItem value="80" className="text-[11px]">Besar</SelectItem>
                <SelectItem value="100" className="text-[11px]">Sangat Besar</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Bayangan</Label>
            <Select
              value={settings.shadow}
              onValueChange={(val) => handleSettingChange('shadow', val)}
            >
              <SelectTrigger className="w-[120px] h-9 rounded-xl text-[10px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-[11px]">Tidak ada</SelectItem>
                <SelectItem value="md" className="text-[11px]">Kecil</SelectItem>
                <SelectItem value="lg" className="text-[11px]">Sedang</SelectItem>
                <SelectItem value="xl" className="text-[11px]">Besar</SelectItem>
                <SelectItem value="2xl" className="text-[11px]">Sangat Besar</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Sudut Frame</Label>
            <Select
              value={settings.radius}
              onValueChange={(val) => handleSettingChange('radius', val)}
            >
              <SelectTrigger className="w-[120px] h-9 rounded-xl text-[10px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-[11px]">Tidak ada</SelectItem>
                <SelectItem value="sm" className="text-[11px]">Kecil</SelectItem>
                <SelectItem value="md" className="text-[11px]">Sedang</SelectItem>
                <SelectItem value="lg" className="text-[11px]">Besar</SelectItem>
                <SelectItem value="xl" className="text-[11px]">Sangat Besar</SelectItem>
                 <SelectItem value="2xl" className="text-[11px]">Maksimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Posisi</Label>
            <Select
              value={settings.position}
              onValueChange={(val) => handleSettingChange('position', val)}
            >
              <SelectTrigger className="w-[120px] h-9 rounded-xl text-[10px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left" className="text-[11px]">Kiri</SelectItem>
                <SelectItem value="center" className="text-[11px]">Tengah</SelectItem>
                <SelectItem value="right" className="text-[11px]">Kanan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      title: 'Screenshot',
      icon: Scissors,
      content: (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Mode Browser</Label>
                <Switch
                    id="dark-mode-switch"
                    checked={settings.darkMode}
                    onCheckedChange={(val) => handleSettingChange('darkMode', val)}
                />
            </div>
             <div className="flex items-center justify-between">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Sudut Gambar</Label>
            <Select
              value={settings.screenshotRadius}
              onValueChange={(val) => handleSettingChange('screenshotRadius', val)}
            >
              <SelectTrigger className="w-[120px] h-9 rounded-xl text-[10px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-[11px]">Tidak ada</SelectItem>
                <SelectItem value="sm" className="text-[11px]">Kecil</SelectItem>
                <SelectItem value="md" className="text-[11px]">Sedang</SelectItem>
                <SelectItem value="lg" className="text-[11px]">Besar</SelectItem>
                <SelectItem value="xl" className="text-[11px]">Sangat Besar</SelectItem>
                <SelectItem value="2xl" className="text-[11px]">Maksimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <Accordion type="multiple" defaultValue={['Preset', 'Latar']} className="w-full">
        {sections.map(({title, icon: Icon, content}) => (
          <AccordionItem value={title} key={title} className="border-b border-white/10">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className='flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.1em]'>
                <Icon className="h-4 w-4 text-accent" />
                <span>{title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">{content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button variant="ghost" size="sm" className="w-full text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-4" onClick={resetSettings}>
        <RefreshCcw className="mr-2 h-3 w-3" /> Reset Pengaturan
      </Button>
    </div>
  );
}