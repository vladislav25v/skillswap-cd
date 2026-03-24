const FAVORITES_KEY = 'favoriteUsers';

export const getFavoriteUserIds = (): number[] => {
  const data = localStorage.getItem(FAVORITES_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as number[];
  } catch {
    return [];
  }
};

export const toggleFavoriteUser = (userId: number): number[] => {
  const favorites = getFavoriteUserIds();

  const updatedFavorites = favorites.includes(userId)
    ? favorites.filter((id) => id !== userId)
    : [...favorites, userId];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

  return updatedFavorites;
};