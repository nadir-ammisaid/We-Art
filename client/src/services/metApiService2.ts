// /**
//  * Service API optimisé pour le Metropolitan Museum
//  * Inclut un système de cache pour réduire les requêtes
//  */

// export interface Artwork {
//   objectID: number;
//   title: string;
//   primaryImageSmall: string;
//   artistDisplayName: string;
//   country: string;
//   artistBeginDate?: string;
//   artistEndDate?: string;
//   medium?: string;
//   creditLine?: string;
//   geographyType?: string;
//   city?: string;
// }

// // Cache simple en mémoire
// const cache = new Map<string, { data: Artwork; timestamp: number }>();
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// class MetApiService {
//   private baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1';

//   /**
//    * Récupère une œuvre par son ID avec cache
//    */
//   async getArtwork(id: string | number): Promise<Artwork | null> {
//     const cacheKey = `artwork-${id}`;

//     // Vérifier le cache
//     const cached = cache.get(cacheKey);
//     if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return cached.data;
//     }

//     try {
//       const response = await fetch(`${this.baseUrl}/objects/${id}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: Artwork = await response.json();

//       // Mettre en cache
//       cache.set(cacheKey, { data, timestamp: Date.now() });

//       return data;
//     } catch (error) {
//       console.error(`Error fetching artwork ${id}:`, error);
//       return null;
//     }
//   }

//   /**
//    * Récupère plusieurs œuvres en parallèle avec optimisation
//    */
//   async getArtworks(ids: (string | number)[]): Promise<Artwork[]> {
//     // Filtrer les IDs déjà en cache pour éviter les requêtes inutiles
//     const results: (Artwork | null)[] = [];
//     const idsToFetch: (string | number)[] = [];
//     const indexMap = new Map<string | number, number>();

//     ids.forEach((id, index) => {
//       const cacheKey = `artwork-${id}`;
//       const cached = cache.get(cacheKey);

//       if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//         results[index] = cached.data;
//       } else {
//         idsToFetch.push(id);
//         indexMap.set(id, index);
//       }
//     });

//     // Récupérer seulement les œuvres non cachées
//     if (idsToFetch.length > 0) {
//       const fetchPromises = idsToFetch.map(id => this.getArtwork(id));
//       const fetchedArtworks = await Promise.all(fetchPromises);

//       // Placer les résultats aux bons indices
//       fetchedArtworks.forEach((artwork, i) => {
//         const originalId = idsToFetch[i];
//         const originalIndex = indexMap.get(originalId);
//         if (originalIndex !== undefined) {
//           results[originalIndex] = artwork;
//         }
//       });
//     }

//     // Filtrer les résultats null
//     return results.filter((artwork): artwork is Artwork => artwork !== null);
//   }

//   /**
//    * Recherche des œuvres par mot-clé
//    */
//   async searchArtworks(query: string): Promise<number[]> {
//     try {
//       const response = await fetch(
//         `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data.objectIDs || [];
//     } catch (error) {
//       console.error('Error searching artworks:', error);
//       return [];
//     }
//   }

//   /**
//    * Nettoie le cache (utile pour les tests ou libérer la mémoire)
//    */
//   clearCache() {
//     cache.clear();
//   }

//   /**
//    * Pré-charge des œuvres en arrière-plan
//    */
//   async preloadArtworks(ids: (string | number)[]) {
//     // Lancer les requêtes sans attendre
//     ids.forEach(id => this.getArtwork(id));
//   }
// }

// export const metApiService = new MetApiService();
