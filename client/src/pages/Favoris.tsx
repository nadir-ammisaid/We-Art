import { useMemo } from "react";
import CardArt from "../components/CardArt";
import { useFavorites } from "../contexts/FavoritesContext";
import { useArtworks } from "../hooks/useArtworks";
import "./Favoris.css";

const Favoris = () => {
  const { favorites, clearAllFavorites } = useFavorites();

  const favoriteIds = useMemo(
    () => favorites.map((fav) => fav.objectID),
    [favorites],
  );

  const { artworks, loading, error } = useArtworks(favoriteIds);

  const handleClearAll = () => {
    if (
      window.confirm(
        `Are you sure you want to remove all ${favorites.length} favorites?`,
      )
    ) {
      clearAllFavorites();
    }
  };

  return (
    <div className="sbhomepage">
      <h1 className="page-title">YOUR FAVORITES</h1>

      {error && (
        <div className="error-banner">
          <p>⚠️ Error loading favorites. Please try again later.</p>
        </div>
      )}

      {loading && (
        <div className="loading-banner">
          <div className="loader" />
          <p>Loading your favorites...</p>
        </div>
      )}

      <div className="cardart">
        {!loading && artworks.length > 0 ? (
          <>
            <div
              className="favorites-header"
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <p>Below your favorite art pieces:</p>
              <button
                type="button"
                onClick={handleClearAll}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff6b6b";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = "#2997fd";
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff6b6b";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#2997fd";
                }}
                style={{
                  backgroundColor: "#2997fd",
                  color: "#000",
                  border: "3px solid #000",
                  padding: "0.6rem 1.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  fontFamily: '"Lucida Sans", sans-serif',
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  boxShadow: "2px 2px 0 0 #000",
                  transition: "all 0.2s ease",
                }}
              >
                Clear All
              </button>
            </div>
            {artworks.map((artwork) => (
              <CardArt key={artwork.objectID} artwork={artwork} />
            ))}
          </>
        ) : !loading && artworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💔</div>
            <h3>No favorites yet</h3>
            <p>Start adding artworks to your favorites!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Favoris;
