'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Fitur Vision Analyst telah dihapus sesuai instruksi pengguna (tanpa AI).
 * File ini dipertahankan hanya sebagai stub untuk mencegah error build 
 * dan secara otomatis mengalihkan pengguna kembali ke Dashboard.
 */
export default function RemovedFeaturePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground font-medium animate-pulse">Mengalihkan ke Dashboard...</p>
      </div>
    </div>
  );
}
