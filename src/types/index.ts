import type { PixelCrop } from 'react-image-crop';

export type ConversionStatus = 'pending' | 'converting' | 'converted' | 'ai_optimizing' | 'error';

export type ConversionFormat = 'image/webp' | 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/x-icon';

export interface ConversionOptions {
  format: ConversionFormat;
  quality: number;
}

export interface ResizeOptions {
    enabled: boolean;
    width: number;
    height: number;
}

export interface CropOptions {
    enabled: boolean;
    crop: PixelCrop | null;
}

export interface ImageFile {
  id: string;
  file: File;
  originalSize: number;
  originalUrl?: string;
  originalDimensions?: { width: number; height: number };
  status: ConversionStatus;
  convertedFile?: Blob;
  convertedSize?: number;
  convertedUrl?: string;
  error?: string;
  conversionOptions: ConversionOptions;
  resize?: ResizeOptions;
  crop?: CropOptions;
}

export type PdfConversionStatus = 'pending' | 'converting' | 'converted' | 'error';

export interface PdfFile {
    id: string;
    file: File;
    status: PdfConversionStatus;
    error?: string;
}


// Mockup Generator Types
export type MockupSettings = {
  padding: string;
  background: {
    from: string;
    to: string;
  };
  darkMode: boolean;
  shadow: string;
  radius: string;
  screenshotRadius: string;
  noise: boolean;
  position: string;
};

export const MOCKUP_PRESETS = {
  "Minimalist": {
    padding: "64",
    background: { from: "#e5e7eb", to: "#d1d5db" },
    darkMode: false,
    shadow: "2xl",
    radius: "xl",
    screenshotRadius: "lg",
    noise: false,
    position: "center",
  },
  "Gradient Soft": {
    padding: "80",
    background: { from: "#ec4899", to: "#f59e0b" },
    darkMode: true,
    shadow: "2xl",
    radius: "2xl",
    screenshotRadius: "xl",
    noise: false,
    position: "center",
  },
  "Dark Mode Focus": {
    padding: "64",
    background: { from: "#111827", to: "#1f2937" },
    darkMode: true,
    shadow: "2xl",
    radius: "xl",
    screenshotRadius: "lg",
    noise: true,
    position: "center",
  },
};
