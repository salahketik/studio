'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  AlertCircle, 
  Copy, 
  X, 
  RefreshCcw, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface AppError {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
}

export function GlobalErrorHandler() {
  const [error, setError] = useState<AppError | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handleGlobalError = useCallback((event: ErrorEvent | PromiseRejectionEvent) => {
    const message = 'reason' in event 
      ? (event.reason?.message || String(event.reason))
      : event.message;
    
    const stack = 'reason' in event
      ? event.reason?.stack
      : event.error?.stack;

    setError({
      message,
      stack,
      timestamp: new Date().toISOString(),
    });
  }, []);

  useEffect(() => {
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [handleGlobalError]);

  const copyToClipboard = () => {
    if (!error) return;
    const log = `ERROR LOG [${error.timestamp}]\nMessage: ${error.message}\nStack: ${error.stack || 'N/A'}`;
    navigator.clipboard.writeText(log).then(() => {
      toast({ title: "Log Berhasil Disalin", description: "Anda dapat mengirimkan log ini ke tim teknis." });
    });
  };

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md w-full animate-in slide-in-from-right-8 duration-300">
      <Alert variant="destructive" className="bg-destructive text-destructive-foreground shadow-2xl border-none">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-bold flex items-center justify-between">
          Sesuatu Terjadi
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/20 text-white" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p className="text-xs opacity-90 leading-relaxed truncate">{error.message}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="text-[10px] h-7 bg-white/10 hover:bg-white/20 text-white border-none" onClick={() => setShowDetails(true)}>
              Lihat Detail & Salin Log
            </Button>
            <Button size="sm" variant="secondary" className="text-[10px] h-7 bg-white/10 hover:bg-white/20 text-white border-none" onClick={() => window.location.reload()}>
              <RefreshCcw className="h-3 w-3 mr-1" /> Segarkan
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Laporan Kesalahan Teknis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
             <div className="p-3 bg-muted rounded-lg border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Pesan Kesalahan</p>
                <p className="text-sm font-medium">{error.message}</p>
             </div>
             <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Stack Trace</p>
                <ScrollArea className="h-60 bg-black text-green-500 p-4 rounded-lg font-mono text-[10px] leading-relaxed">
                  {error.stack || 'Informasi stack tidak tersedia.'}
                </ScrollArea>
             </div>
          </div>
          <DialogFooter className="mt-4 flex flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDetails(false)}>Tutup</Button>
            <Button className="flex-1 bg-accent hover:bg-accent/90" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" /> Salin Log Error
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
