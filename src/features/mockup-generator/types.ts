// Mockup Generator Types
export type MockupSettings = {
  padding: string;
  background: {
    type: 'gradient' | 'image';
    value: { from: string; to: string } | string;
  };
  darkMode: boolean;
  shadow: string;
  radius: string;
  screenshotRadius: string;
  noise: boolean;
  position: string;
};

export const MOCKUP_PRESETS: Record<string, MockupSettings> = {
  "Minimalist": {
    padding: "64",
    background: { type: 'gradient', value: { from: "#e5e7eb", to: "#d1d5db" } },
    darkMode: false,
    shadow: "2xl",
    radius: "xl",
    screenshotRadius: "lg",
    noise: false,
    position: "center",
  },
  "Gradient Soft": {
    padding: "80",
    background: { type: 'gradient', value: { from: "#ec4899", to: "#f59e0b" } },
    darkMode: true,
    shadow: "2xl",
    radius: "2xl",
    screenshotRadius: "xl",
    noise: false,
    position: "center",
  },
  "Dark Mode Focus": {
    padding: "64",
    background: { type: 'gradient', value: { from: "#111827", to: "#1f2937" } },
    darkMode: true,
    shadow: "2xl",
    radius: "xl",
    screenshotRadius: "lg",
    noise: true,
    position: "center",
  },
};
