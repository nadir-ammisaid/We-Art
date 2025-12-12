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
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "weart_favorites";

/**
 * Context amélioré avec persistance localStorage
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Initialisation depuis localStorage
  const [favorites, setFavorites] = useState<ArtType[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      return [];
    }
  });

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

  // Mémoïser la fonction de vérification
  const isArtLiked = useCallback(
    (objectID: string) => {
      return favorites.some((artWork) => artWork.objectID === objectID);
    },
    [favorites],
  );

  // Mémoïser la fonction de toggle
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

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isArtLiked, toggleFavorite, clearFavorites }}
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
