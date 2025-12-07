'use client';

import { useRef } from 'react';
import { useSettings } from '@/context/settings-context';
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
import { MOCKUP_PRESETS } from '@/types';
import { RefreshCcw, Palette, Image as ImageIcon, AspectRatio, AlignHorizontalDistributeCenter, Blend, CircleDot, Framer, Scissors } from 'lucide-react';
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
      // Clean up old object URL if switching away from image
      if (prev.background.type === 'image' && type !== 'image') {
        URL.revokeObjectURL(prev.background.value as string);
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
        const currentGradient = prev.background.value as { from: string, to: string };
        return {
            ...prev,
            background: {
                ...prev.background,
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
       // Clean up old object URL before creating a new one
      if (prev.background.type === 'image' && prev.background.value) {
        URL.revokeObjectURL(prev.background.value as string);
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

  const backgroundValue = settings.background.value as { from: string, to: string };

  const sections = [
    {
      title: 'Preset',
      icon: Palette,
      content: (
        <div className="grid grid-cols-2 gap-2">
            {Object.keys(MOCKUP_PRESETS).map((preset) => (
                <Button key={preset} variant="outline" size="sm" onClick={() => applyPreset(preset as keyof typeof MOCKUP_PRESETS)}>
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
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gradient">Warna</TabsTrigger>
                <TabsTrigger value="image">Gambar</TabsTrigger>
            </TabsList>
            <TabsContent value="gradient" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                    <Label>Mulai</Label>
                    <ColorPicker
                        background={backgroundValue.from}
                        setBackground={(val) => handleGradientColorChange('from', val)}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Label>Selesai</Label>
                    <ColorPicker
                        background={backgroundValue.to}
                        setBackground={(val) => handleGradientColorChange('to', val)}
                    />
                </div>
            </TabsContent>
            <TabsContent value="image" className="pt-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                />
                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="mr-2 h-4 w-4" /> Pilih Gambar
                </Button>
            </TabsContent>
            <div className="flex items-center justify-between pt-4 border-t mt-4">
                <Label htmlFor="noise-switch">Efek Noise</Label>
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
            <Label>Padding</Label>
            <Select
              value={settings.padding}
              onValueChange={(val) => handleSettingChange('padding', val)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="32">Kecil</SelectItem>
                <SelectItem value="64">Sedang</SelectItem>
                <SelectItem value="80">Besar</SelectItem>
                <SelectItem value="100">Sangat Besar</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center justify-between">
            <Label>Bayangan</Label>
            <Select
              value={settings.shadow}
              onValueChange={(val) => handleSettingChange('shadow', val)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada</SelectItem>
                <SelectItem value="md">Kecil</SelectItem>
                <SelectItem value="lg">Sedang</SelectItem>
                <SelectItem value="xl">Besar</SelectItem>
                <SelectItem value="2xl">Sangat Besar</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center justify-between">
            <Label>Sudut Frame</Label>
            <Select
              value={settings.radius}
              onValueChange={(val) => handleSettingChange('radius', val)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada</SelectItem>
                <SelectItem value="sm">Kecil</SelectItem>
                <SelectItem value="md">Sedang</SelectItem>
                <SelectItem value="lg">Besar</SelectItem>
                <SelectItem value="xl">Sangat Besar</SelectItem>
                 <SelectItem value="2xl">Maksimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Posisi</Label>
            <Select
              value={settings.position}
              onValueChange={(val) => handleSettingChange('position', val)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Kiri</SelectItem>
                <SelectItem value="center">Tengah</SelectItem>
                <SelectItem value="right">Kanan</SelectItem>
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
                <Label>Mode Browser</Label>
                <div className="flex items-center">
                    <Switch
                        id="dark-mode-switch"
                        checked={settings.darkMode}
                        onCheckedChange={(val) => handleSettingChange('darkMode', val)}
                    />
                </div>
            </div>
             <div className="flex items-center justify-between">
            <Label>Sudut Gambar</Label>
            <Select
              value={settings.screenshotRadius}
              onValueChange={(val) => handleSettingChange('screenshotRadius', val)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada</SelectItem>
                <SelectItem value="sm">Kecil</SelectItem>
                <SelectItem value="md">Sedang</SelectItem>
                <SelectItem value="lg">Besar</SelectItem>
                <SelectItem value="xl">Sangat Besar</SelectItem>
                <SelectItem value="2xl">Maksimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <Accordion type="multiple" defaultValue={sections.map(s => s.title)} className="w-full">
        {sections.map(({title, icon: Icon, content}) => (
          <AccordionItem value={title} key={title}>
            <AccordionTrigger>
              <div className='flex items-center gap-2'>
                <Icon className="h-4 w-4" />
                <span>{title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>{content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button variant="outline" className="w-full" onClick={resetSettings}>
        <RefreshCcw className="mr-2 h-4 w-4" /> Reset Pengaturan
      </Button>
    </div>
  );
}
