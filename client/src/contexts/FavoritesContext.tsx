import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

interface ArtType {
  objectID: string;
}

interface FavoritesContextType {
  favorites: ArtType[];
  isArtLiked: (objectID: string) => boolean;
  toggleFavorite: (art: ArtType) => void;
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "weart_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<ArtType[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

  const isArtLiked = useCallback(
    (objectID: string) => {
      return favorites.some((artWork) => artWork.objectID === objectID);
    },
    [favorites],
  );

  const toggleFavorite = useCallback((art: ArtType) => {
    if (!art?.objectID) {
      console.error("Invalid art object");
      return;
    }

    setFavorites((prev) => {
      const alreadyLiked = prev.some(
        (artWork) => artWork.objectID === art.objectID,
      );

      if (alreadyLiked) {
        return prev.filter((artWork) => artWork.objectID !== art.objectID);
      }

      return [...prev, art];
    });
  }, []);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isArtLiked, toggleFavorite, clearAllFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const value = useContext(FavoritesContext);
  if (value == null) {
    throw new Error("useFavorites must be used within <FavoritesProvider>");
  }
  return value;
};
