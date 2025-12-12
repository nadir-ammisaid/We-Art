// import { useMemo, useState, useEffect, useCallback } from "react";
// import CardArt from "../components/CardArt";
// import Compteur from "../components/Compteur";
// import SearchBar from "../components/SearchBar";
// import { useArtworks } from "../hooks/useArtworks";
// import { useDebounce } from "../hooks/useDebounce";
// import "./HomePage.css";

// // Collections populaires du Met Museum
// const DEPARTMENTS = [
//   1, // American Decorative Arts
//   11, // European Paintings
//   6, // Asian Art
//   21, // Modern Art
//   19, // Photographs
// ];

// const HomePage = () => {
//   const [searchText, setSearchText] = useState("");
//   const [allArtworkIds, setAllArtworkIds] = useState<string[]>([]);
//   const [displayedIds, setDisplayedIds] = useState<string[]>([]);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);

//   const debouncedSearchText = useDebounce(searchText, 300);
//   const { artworks, loading, error } = useArtworks(displayedIds);

//   // Charger un pool d'IDs au démarrage (sans les afficher tous)
//   useEffect(() => {
//     const loadArtworkPool = async () => {
//       try {
//         setInitialLoad(true);

//         // Charger des œuvres de différents départements
//         const promises = DEPARTMENTS.map((deptId) =>
//           fetch(
//             `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${deptId}`
//           )
//             .then((res) => {
//               if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//               return res.json();
//             })
//             .catch((err) => {
//               console.warn(`Failed to load department ${deptId}:`, err);
//               return { objectIDs: [] };
//             })
//         );

//         const results = await Promise.all(promises);

//         // Collecter TOUS les IDs disponibles
//         const allIds: string[] = [];
//         results.forEach((result) => {
//           if (result.objectIDs && result.objectIDs.length > 0) {
//             // Prendre beaucoup d'IDs de chaque département
//             const ids = result.objectIDs
//               .sort(() => Math.random() - 0.5)
//               .slice(0, 50) // 50 par département = ~250 IDs total
//               .map(String);
//             allIds.push(...ids);
//           }
//         });

//         // Mélanger tous les IDs
//         const shuffledIds = allIds.sort(() => Math.random() - 0.5);

//         // Stocker TOUS les IDs
//         setAllArtworkIds(shuffledIds);

//         // Afficher seulement les 20 premiers
//         setDisplayedIds(shuffledIds.slice(0, 20));
//       } catch (err) {
//         console.error("Error loading artworks:", err);
//         // Fallback
//         const fallbackIds = [
//           "392000",
//           "897121",
//           "199313",
//           "447797",
//           "247009",
//           "437326",
//           "436535",
//           "411913",
//           "36548",
//           "435860",
//           "11730",
//           "436532",
//           "438817",
//           "459080",
//           "45734",
//           "436105",
//           "437853",
//           "438012",
//           "459055",
//           "436121",
//         ];
//         setAllArtworkIds(fallbackIds);
//         setDisplayedIds(fallbackIds.slice(0, 20));
//       } finally {
//         setInitialLoad(false);
//       }
//     };

//     loadArtworkPool();
//   }, []);

//   // Fonction pour charger plus d'œuvres
//   const handleLoadMore = useCallback(() => {
//     setLoadingMore(true);

//     // Calculer combien on en affiche actuellement
//     const currentCount = displayedIds.length;

//     // Prendre les 20 prochains du pool
//     const nextIds = allArtworkIds.slice(currentCount, currentCount + 20);

//     // Si on a épuisé le pool, mélanger et recommencer
//     if (nextIds.length < 20 && allArtworkIds.length > 0) {
//       // Mélanger à nouveau le pool
//       const reshuffled = [...allArtworkIds].sort(() => Math.random() - 0.5);
//       setAllArtworkIds(reshuffled);

//       // Prendre les 20 premiers du nouveau pool
//       const freshIds = reshuffled.slice(0, 20);
//       setDisplayedIds(freshIds);
//     } else {
//       // Ajouter les nouveaux IDs aux existants
//       setDisplayedIds([...displayedIds, ...nextIds]);
//     }

//     // Simuler un petit délai pour l'UX
//     setTimeout(() => setLoadingMore(false), 300);
//   }, [allArtworkIds, displayedIds]);

//   // Filtrer les œuvres affichées
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

//   // Calculer s'il reste des œuvres à charger
//   const hasMore =
//     displayedIds.length < allArtworkIds.length || allArtworkIds.length >= 100;

//   return (
//     <div className="sbhomepage">
//       <div className="searchcarcl">
//         <SearchBar searchText={searchText} setSearchText={setSearchText} />
//       </div>

//       <div className="compteur">
//         <Compteur />
//       </div>

//       <div className="cardart">
//         {error ? (
//           <div className="error-message">
//             <p>Error loading artworks: {error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               style={{
//                 marginTop: "1rem",
//                 padding: "0.5rem 1rem",
//                 cursor: "pointer",
//                 backgroundColor: "#333",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//               }}
//             >
//               Reload Page
//             </button>
//           </div>
//         ) : initialLoad || loading ? (
//           <div className="loading-container">
//             <p>Loading artworks...</p>
//           </div>
//         ) : filteredArtworks.length > 0 ? (
//           <>
//             {filteredArtworks.map((artwork) => (
//               <CardArt key={artwork.objectID} artwork={artwork} />
//             ))}
//             {!searchText && hasMore && (
//               <div
//                 style={{
//                   gridColumn: "1 / -1",
//                   textAlign: "center",
//                   padding: "2rem",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: "1rem",
//                 }}
//               >
//                 <p style={{ color: "#666", fontSize: "0.9rem" }}>
//                   Showing {displayedIds.length} artworks
//                 </p>
//                 <button
//                   onClick={handleLoadMore}
//                   disabled={loadingMore}
//                   style={{
//                     padding: "0.75rem 1.5rem",
//                     fontSize: "1rem",
//                     cursor: loadingMore ? "not-allowed" : "pointer",
//                     backgroundColor: loadingMore ? "#666" : "#333",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "4px",
//                     opacity: loadingMore ? 0.6 : 1,
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   {loadingMore ? "⏳ Loading..." : "🔄 Load 20 More Artworks"}
//                 </button>
//               </div>
//             )}
//           </>
//         ) : searchText ? (
//           <p>No results for "{searchText}"</p>
//         ) : (
//           <div style={{ textAlign: "center", padding: "2rem" }}>
//             <p>No artworks available</p>
//             <button
//               onClick={() => window.location.reload()}
//               style={{
//                 marginTop: "1rem",
//                 padding: "0.75rem 1.5rem",
//                 fontSize: "1rem",
//                 cursor: "pointer",
//                 backgroundColor: "#333",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "4px",
//               }}
//             >
//               Reload Page
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;
