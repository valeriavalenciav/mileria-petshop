
// This is a mock database for favorites.
// In a real application, you would use a proper database.
interface UserFavorites {
  [userId: string]: string[]; // Array of product IDs
}

const favorites: UserFavorites = {
  'mileria@example.com': ['1', '3'], // Mock data: User 'mileria@example.com' has favorited products with ID '1' and '3'
};

export const getFavorites = (userId: string): string[] => {
  return favorites[userId] || [];
};

export const addFavorite = (userId: string, productId: string): void => {
  if (!favorites[userId]) {
    favorites[userId] = [];
  }
  if (!favorites[userId].includes(productId)) {
    favorites[userId].push(productId);
  }
};

export const removeFavorite = (userId: string, productId: string): void => {
  if (favorites[userId]) {
    favorites[userId] = favorites[userId].filter(id => id !== productId);
  }
};
