import { memo } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";
import type { Artwork } from "../services/metApiService";
import "./CardArt.css";

interface CardArtProps {
  artwork: Artwork;
}

function CardArtComponent({ artwork }: CardArtProps) {
  const { toggleFavorite, isArtLiked } = useFavorites();

  const handleLike = () => {
    toggleFavorite({ objectID: artwork.objectID.toString() });
  };

  const imageSrc = artwork.primaryImageSmall || "/placeholder-art.jpg";

  return (
    <article className="cardArtContainer">
      <img
        className="cardArtImg"
        src={imageSrc}
        alt={artwork.title || "Untitled artwork"}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "/placeholder-art.jpg";
        }}
      />

      <h2 className="imgTitle">{artwork.title || "Untitled"}</h2>

      <button
        type="button"
        className="likeButton"
        onClick={handleLike}
        aria-label={
          isArtLiked(artwork.objectID.toString())
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {isArtLiked(artwork.objectID.toString()) ? "❤️" : "🤍"}
      </button>

      <Link to={`/article/${artwork.objectID}`} state={{ artwork }}>
        <button type="button" className="detailsButton">
          See more
        </button>
      </Link>
    </article>
  );
}

export default memo(CardArtComponent, (prevProps, nextProps) => {
  return prevProps.artwork.objectID === nextProps.artwork.objectID;
});
