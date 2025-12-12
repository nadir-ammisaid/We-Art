import { useLocation, useParams } from "react-router-dom";
import { useArtwork } from "../hooks/useArtworks";
import type { Artwork } from "../services/metApiService";
import "./Article.css";

/**
 * Page Article optimisée
 * - Utilise d'abord le state du router si disponible
 * - Sinon, fetch les données depuis l'API (avec cache)
 * - Gère le refresh de la page correctement
 */
function Article() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Essayer de récupérer les données depuis le state du router
  const stateArtwork = (location.state as { artwork?: Artwork })?.artwork;

  // Si pas de données dans le state, utiliser le hook pour fetcher
  const {
    artwork: fetchedArtwork,
    loading,
    error,
  } = useArtwork(stateArtwork ? undefined : id);

  // Utiliser les données du state en priorité, sinon les données fetchées
  const artDetails = stateArtwork || fetchedArtwork;

  // Gestion des états de chargement
  if (loading) {
    return (
      <div className="articleStyle">
        <p>Loading artwork details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articleStyle">
        <div className="error-message">
          <h2>Error loading artwork</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!artDetails) {
    return (
      <div className="articleStyle">
        <div className="error-message">
          <h2>Artwork not found</h2>
          <p>The requested artwork could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="articleStyle">
      <section id="imageContainer">
        <img
          className="imgContainer"
          src={artDetails.primaryImageSmall}
          alt={artDetails.title || "Untitled artwork"}
          loading="lazy"
        />
      </section>

      <section id="articleTextContainer">
        <h1>{artDetails.title || "Untitled"}</h1>

        {artDetails.artistDisplayName && (
          <h2>Artist: {artDetails.artistDisplayName}</h2>
        )}

        <h3>Description</h3>

        <p>
          {artDetails.artistDisplayName && (
            <>
              {artDetails.artistDisplayName}
              {artDetails.artistBeginDate &&
                ` born in ${artDetails.artistBeginDate}`}
              {artDetails.artistEndDate &&
                ` and died in ${artDetails.artistEndDate}`}
              .{" "}
            </>
          )}

          {artDetails.medium && (
            <>
              The materials used for this work of art are {artDetails.medium}.{" "}
            </>
          )}

          {artDetails.creditLine && <>{artDetails.creditLine}. </>}

          {artDetails.geographyType && `${artDetails.geographyType} `}

          {artDetails.city && `${artDetails.city} `}

          {artDetails.country && artDetails.country}
        </p>

        {artDetails.country && <p>Country: {artDetails.country}</p>}
      </section>
    </div>
  );
}

export default Article;
