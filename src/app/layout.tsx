import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { AppHeader } from '@/components/app-header';


export const metadata: Metadata = {
  title: 'WebPGator',
  description: 'Konversi gambar massal ke WebP dengan optimisasi berbantuan AI.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full bg-background">
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
            <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} WebPGator. Hak cipta dilindungi undang-undang.</p>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
