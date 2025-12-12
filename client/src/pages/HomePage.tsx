import { useEffect, useState } from "react";
import CardArt from "../components/CardArt";
import Compteur from "../components/Compteur";
import SearchBar from "../components/SearchBar";
import { useArtworks } from "../hooks/useArtworks";
import { useDebounce } from "../hooks/useDebounce";
import "./HomePage.css";

const DEFAULT_ARTWORKS_IDS = [
  "436535",
  "438817",
  "459080",
  "436105",
  "247009",
  "45734",
  "36700",
  "267934",
  "544757",
  "24975",
  "447797",
  "336327",
  "313256",
  "207785",
  "392000",
  "438012",
  "437329",
  "437853",
  "254890",
  "543864",
] as const;

const HomePage = () => {
  const [searchText, setSearchText] = useState("");
  const [artworkIds, setArtworkIds] = useState<string[]>([
    ...DEFAULT_ARTWORKS_IDS,
  ]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchText = useDebounce(searchText, 300);
  const { artworks, loading, error, progress } = useArtworks(artworkIds);

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

  const progressPercentage = progress
    ? Math.round((progress.loaded / progress.total) * 100)
    : 0;

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
        <div className="loading-banner-enhanced">
          <div className="loader-content">
            <div className="loader-spinner" />
            <div className="loader-text-container">
              <p className="loader-main-text">
                {isSearching
                  ? "Searching the collection..."
                  : "Loading artworks..."}
              </p>
              {progress && !isSearching && (
                <div className="progress-info">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="progress-text">
                    {progress.loaded} / {progress.total} artworks loaded (
                    {progressPercentage}%)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="cardart">
        {!loading && !isSearching && artworks.length > 0 ? (
          <>
            {artworks.map((artwork, index) => (
              <div
                key={artwork.objectID}
                className="card-fade-in"
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <CardArt artwork={artwork} />
              </div>
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
