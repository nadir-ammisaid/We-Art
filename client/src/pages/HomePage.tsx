import { useEffect, useState } from "react";
import CardArt from "../components/CardArt";
import Compteur from "../components/Compteur";
import SearchBar from "../components/SearchBar";
import { useArtworks } from "../hooks/useArtworks";
import { useDebounce } from "../hooks/useDebounce";
import "./HomePage.css";

const DEFAULT_ARTWORKS_IDS = [
  "436535", // Van Gogh - Wheat Field with Cypresses
  "438817", // Mary Cassatt - The Dance Class
  "459080", // Erasmus of Rotterdam
  "436105", // The Death of Socrates
  "247009", // Wall painting from Boscoreale
  "45734", // Quail and Millet
  "36700", // Street Scene in Winter
  "267934", // The Crater, Petersburg
  "544757", // Egyptian statue
  "24975", // Armor (Gusoku)
  "447797", // Prince Riding an Elephant
  "336327", // Corridor in the Asylum
  "313256", // Mirror-bearer
  "207785", // Mirror
  "392000", // Abraham's Sacrifice
  "438012", // Bouquet of Chrysanthemums
  "437329", // The Abduction of the Sabine Women
  "437853", // Madame X - John Singer Sargent
  "254890", // Bronze statuette dancer
  "543864", // Sphinx of Senwosret III
] as const;

const HomePage = () => {
  const [searchText, setSearchText] = useState("");
  const [artworkIds, setArtworkIds] = useState<string[]>([
    ...DEFAULT_ARTWORKS_IDS,
  ]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchText = useDebounce(searchText, 300);
  const { artworks, loading, error } = useArtworks(artworkIds);

  useEffect(() => {
    if (debouncedSearchText === "") {
      return;
    }

    if (!debouncedSearchText.trim()) {
      setArtworkIds([...DEFAULT_ARTWORKS_IDS]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(
        debouncedSearchText,
      )}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.objectIDs && data.objectIDs.length > 0) {
          const ids = data.objectIDs.slice(0, 30).map(String);
          setArtworkIds(ids);
        } else {
          setArtworkIds([]);
        }
        setIsSearching(false);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setIsSearching(false);
      });
  }, [debouncedSearchText]);

  return (
    <div className="sbhomepage">
      <div className="searchcarcl">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </div>

      <Compteur />

      {error && (
        <div className="error-banner">
          <p>⚠️ Error loading artworks. Please try again later.</p>
        </div>
      )}

      {(loading || isSearching) && (
        <div className="loading-banner">
          <div className="loader" />
          <p>
            {isSearching
              ? "Searching the collection..."
              : "Loading artworks..."}
          </p>
        </div>
      )}

      <div className="cardart">
        {!loading && !isSearching && artworks.length > 0 ? (
          <>
            {artworks.map((artwork) => (
              <CardArt key={artwork.objectID} artwork={artwork} />
            ))}
            <div className="results-footer">
              {debouncedSearchText ? (
                <p>
                  Found <strong>{artworks.length}</strong> result
                  {artworks.length !== 1 ? "s" : ""} for "{debouncedSearchText}"
                </p>
              ) : (
                <p>
                  Showing <strong>{artworks.length}</strong> artwork
                  {artworks.length !== 1 ? "s" : ""} from the Metropolitan
                  Museum
                </p>
              )}
            </div>
          </>
        ) : !loading && !isSearching && debouncedSearchText ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try searching for "Van Gogh", "Egyptian", or "Samurai"</p>
          </div>
        ) : !loading && !isSearching ? (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h3>No artworks available</h3>
            <p>Please refresh the page</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage;
