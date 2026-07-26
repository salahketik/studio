import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/footer';
import { GlobalErrorHandler } from '@/components/global-error-handler';


export const metadata: Metadata = {
  title: 'Visual Creative Suite - Professional Visual Workstation',
  description: 'Workstation digital profesional untuk pengolahan gambar, konversi massal, dan proteksi aset desain dengan pemrosesan 100% lokal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full bg-background selection:bg-accent/20 selection:text-accent">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-full">
            <AppHeader />
            <main className="flex-grow">
              {children}
            </main>
            <AppFooter />
          </div>
          <GlobalErrorHandler />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}