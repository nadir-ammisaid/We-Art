// import { useMemo, useState } from "react";
// import CardArt from "../components/CardArt";
// import Compteur from "../components/Compteur";
// import SearchBar from "../components/SearchBar";
// import { useArtworks } from "../hooks/useArtworks";
// import { useDebounce } from "../hooks/useDebounce";
// import "./HomePage.css";

// // Constantes en dehors du composant pour éviter les re-créations
// const FEATURED_ARTWORKS_IDS = [
//   "392000",
//   "897121",
//   "199313",
//   "447797",
//   "247009",
//   "437326",
//   "436535",
//   "411913",
//   "36548",
//   "435860",
// ] as const;

// const HomePage = () => {
//   const [searchText, setSearchText] = useState("");

//   // Debouncer la recherche pour éviter les re-renders inutiles
//   const debouncedSearchText = useDebounce(searchText, 300);

//   // Charger les œuvres avec le hook custom (avec cache)
//   const { artworks, loading, error } = useArtworks(FEATURED_ARTWORKS_IDS);

//   // Filtrer les œuvres de manière optimisée avec useMemo
//   const filteredArtworks = useMemo(() => {
//     if (!debouncedSearchText.trim()) {
//       return artworks;
//     }

//     const searchLower = debouncedSearchText.toLowerCase();

//     return artworks.filter((artwork) => {
//       const titleMatch = artwork.title?.toLowerCase().includes(searchLower);
//       const artistMatch = artwork.artistDisplayName
//         ?.toLowerCase()
//         .includes(searchLower);
//       return titleMatch || artistMatch;
//     });
//   }, [artworks, debouncedSearchText]);

//   return (
//     <div className="sbhomepage">
//       <div className="searchcarcl">
//         <SearchBar searchText={searchText} setSearchText={setSearchText} />
//       </div>

//       <div className="compteur">
//         <Compteur />
//       </div>

//       <div className="cardart">
//         {/* Gestion des états de chargement et d'erreur */}
//         {error ? (
//           <div className="error-message">
//             <p>Error loading artworks: {error}</p>
//           </div>
//         ) : loading ? (
//           <div className="loading-container">
//             <p>Loading artworks...</p>
//           </div>
//         ) : filteredArtworks.length > 0 ? (
//           filteredArtworks.map((artwork) => (
//             <CardArt key={artwork.objectID} artwork={artwork} />
//           ))
//         ) : searchText ? (
//           <p>No results for "{searchText}"</p>
//         ) : (
//           <p>No artworks available</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;
