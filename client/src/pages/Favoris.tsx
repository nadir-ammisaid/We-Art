import CardArt from "../components/CardArt";
import { useFavorites } from "../contexts/FavoritesContext";
import { useArtworks } from "../hooks/useArtworks";
import "./Favoris.css";

/**
 * Page Favoris optimisée
 * - Charge les œuvres favorites avec cache
 * - Gère les états de chargement et d'erreur
 */
export default function Favoris() {
  const { favorites } = useFavorites();

  // Extraire les IDs des favoris
  const favoriteIds = favorites.map((fav) => fav.objectID);

  // Charger les données complètes des œuvres favorites (avec cache)
  const { artworks, loading, error } = useArtworks(favoriteIds);

  return (
    <section className="mainFavoris">
      {error ? (
        <div className="error-message">
          <p>Error loading favorites: {error}</p>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <p>Loading your favorites...</p>
        </div>
      ) : artworks.length > 0 ? (
        <>
          <p>Below your favorite art pieces:</p>
          <div className="cardart">
            {artworks.map((artwork) => (
              <CardArt key={artwork.objectID} artwork={artwork} />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-favorites">
          <p>No liked arts yet! Visit our Home Page.</p>
        </div>
      )}
    </section>
  );
}
