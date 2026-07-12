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
import { RefreshCcw, Palette, Image as ImageIcon, Framer, Scissors, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { runAIGenerateBackground } from '@/app/actions';


export function ControlPanel() {
  const { settings, setSettings, resetSettings, applyPreset } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

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

  const handleAiBackgroundGenerate = async () => {
    if (!aiPrompt) {
        toast({ title: "Prompt Kosong", description: "Tuliskan deskripsi latar belakang yang Anda inginkan." });
        return;
    }

    setIsGeneratingAi(true);
    try {
        const result = await runAIGenerateBackground({ prompt: aiPrompt });
        if (result.error) throw new Error(result.error);
        if (result.imageUrl) {
            setSettings(prev => ({
                ...prev,
                background: {
                    type: 'image',
                    value: result.imageUrl!
                }
            }));
            toast({ title: "Latar AI Berhasil", description: "Latar belakang unik telah dibuat." });
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'AI Gagal',
            description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        });
    } finally {
        setIsGeneratingAi(false);
    }
  }

  const backgroundValue = settings.background.type === 'gradient' ? settings.background.value as { from: string, to: string } : { from: '#000000', to: '#000000' };

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
                <TabsTrigger value="image">Gambar/AI</TabsTrigger>
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
            <TabsContent value="image" className="pt-4 space-y-4">
                <div className="p-3 border rounded-lg bg-primary/5 space-y-3">
                    <Label className="text-xs font-bold flex items-center gap-2"><Sparkles className="h-3 w-3 text-primary" /> AI Magic Background</Label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="cth: 'luxury studio with soft light'..." 
                            className="h-8 text-xs" 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        <Button size="sm" onClick={handleAiBackgroundGenerate} disabled={isGeneratingAi} className="h-8">
                            {isGeneratingAi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        </Button>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                />
                <Button variant="outline" className="w-full h-9 text-xs" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="mr-2 h-4 w-4" /> Pilih Gambar Lokal
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
                <Switch
                    id="dark-mode-switch"
                    checked={settings.darkMode}
                    onCheckedChange={(val) => handleSettingChange('darkMode', val)}
                />
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
      <Accordion type="multiple" defaultValue={['Preset', 'Latar']} className="w-full">
        {sections.map(({title, icon: Icon, content}) => (
          <AccordionItem value={title} key={title} className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-2">
              <div className='flex items-center gap-2 text-sm font-semibold'>
                <Icon className="h-4 w-4 text-primary" />
                <span>{title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">{content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={resetSettings}>
        <RefreshCcw className="mr-2 h-3 w-3" /> Reset Pengaturan
      </Button>
    </div>
  );
}
