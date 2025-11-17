
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  favorites: string[];
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (propertyId) =>
        set((state) => ({
          favorites: [...state.favorites, propertyId],
        })),
      removeFavorite: (propertyId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== propertyId),
        })),
      isFavorite: (propertyId) => {
        const { favorites } = get();
        return favorites.includes(propertyId);
      },
    }),
    {
      name: 'imovel-app-storage', // name of the item in the storage (must be unique)
    }
  )
);
