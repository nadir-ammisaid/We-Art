import { useFavorites } from "../contexts/FavoritesContext";

export default function Compteur() {
  const { favorites } = useFavorites();

  return (
    <div className="compteur-wrapper">
      <p className="compteur-text">
        You liked {favorites.length} artwork{favorites.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}
