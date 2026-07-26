
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/footer';
import { GlobalErrorHandler } from '@/components/global-error-handler';
import { CookieBanner } from '@/components/cookie-banner';


export const metadata: Metadata = {
  title: 'Visual Creative Suite - Ultimate 150-in-1 Workstation',
  description: 'Workstation digital murni terlengkap dengan 150+ alat visual, audio studio, subtitle generator, dan utilitas dev lokal oleh Ran Dev.',
  keywords: 'image converter, audio cleaner, subtitle generator, qr code generator, barcode maker, photo filters, metadata cleaner, privacy tools, local workstation, 150-in-1 tools, ran dev',
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
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col min-h-screen">
              <AppHeader />
              <main className="flex-grow">
                {children}
              </main>
              <AppFooter />
            </SidebarInset>
          </SidebarProvider>
          <CookieBanner />
          <GlobalErrorHandler />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
