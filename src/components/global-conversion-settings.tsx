
'use client';

import { useMemo } from 'react';
import type { ConversionOptions, ConversionFormat } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { Settings, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalConversionSettingsProps {
    options: ConversionOptions;
    onOptionsChange: (options: ConversionOptions) => void;
    onApplyToAll: () => void;
    disabled?: boolean;
}

export function GlobalConversionSettings({ options, onOptionsChange, onApplyToAll, disabled }: GlobalConversionSettingsProps) {
    const handleFormatChange = (format: ConversionFormat) => {
        onOptionsChange({ ...options, format });
    }

    const handleQualityChange = (quality: number[]) => {
        onOptionsChange({ ...options, quality: quality[0] / 100 });
    }

    const showQualitySlider = useMemo(() => options.format === 'image/jpeg' || options.format === 'image/jpg' || options.format === 'image/webp', [options.format]);

    return (
        <Card className="bg-muted/50">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6" />
                    <div>
                        <CardTitle className="text-xl">Pengaturan Global</CardTitle>
                        <CardDescription>Pengaturan default untuk gambar baru. Terapkan ke semua untuk menimpa yang sudah ada.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                    <div className='flex-grow'>
                        <Label>Format</Label>
                        <Select value={options.format} onValueChange={(v) => handleFormatChange(v as ConversionFormat)} disabled={disabled}>
                            <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Pilih format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="image/webp">WebP</SelectItem>
                                <SelectItem value="image/jpeg">JPEG</SelectItem>
                                <SelectItem value="image/jpg">JPG</SelectItem>
                                <SelectItem value="image/png">PNG</SelectItem>
                                <SelectItem value="image/x-icon">ICO (via PNG 32x32)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={cn('flex-grow', !showQualitySlider && 'opacity-50')}>
                        <Label>Kualitas: {Math.round(options.quality * 100)}%</Label>
                        <Slider
                            value={[options.quality * 100]}
                            onValueChange={handleQualityChange}
                            max={100}
                            step={1}
                            className="mt-2"
                            disabled={disabled || !showQualitySlider}
                        />
                    </div>
                    
                    <Button onClick={onApplyToAll} disabled={disabled} className="w-full">
                        <Check className="mr-2 h-4 w-4" />
                        Terapkan ke Semua
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
