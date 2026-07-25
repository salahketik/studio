'use client';

import { useState, useEffect } from 'react';

export function AppFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
      <p>&copy; {year || '...'} Visual Creative Suite. Hak cipta dilindungi undang-undang.</p>
    </footer>
  );
}
