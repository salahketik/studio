
'use client';

import { useState, useEffect } from 'react';

export function useUserData() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedFavs = localStorage.getItem('vcs_favorites');
    const storedRecent = localStorage.getItem('vcs_recent');
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
    if (storedRecent) setRecent(JSON.parse(storedRecent));
    setMounted(true);
  }, []);

  const toggleFavorite = (toolTitle: string) => {
    const updated = favorites.includes(toolTitle)
      ? favorites.filter(f => f !== toolTitle)
      : [...favorites, toolTitle];
    setFavorites(updated);
    localStorage.setItem('vcs_favorites', JSON.stringify(updated));
  };

  const trackRecent = (toolTitle: string) => {
    const updated = [toolTitle, ...recent.filter(r => r !== toolTitle)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('vcs_recent', JSON.stringify(updated));
  };

  return { favorites, recent, toggleFavorite, trackRecent, mounted };
}
