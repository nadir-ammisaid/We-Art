/**
 * Types partagés pour l'application WeArt
 */

// Type pour les œuvres d'art du Metropolitan Museum
export interface Artwork {
  objectID: number;
  title: string;
  primaryImageSmall: string;
  primaryImage?: string;
  artistDisplayName: string;
  country: string;
  artistBeginDate?: string;
  artistEndDate?: string;
  medium?: string;
  creditLine?: string;
  geographyType?: string;
  city?: string;
  department?: string;
  culture?: string;
  period?: string;
  dynasty?: string;
  reign?: string;
  portfolio?: string;
  constituents?: Constituent[];
  classification?: string;
  objectDate?: string;
  objectBeginDate?: number;
  objectEndDate?: number;
  accessionNumber?: string;
  accessionYear?: string;
  isPublicDomain?: boolean;
  dimensions?: string;
  metadataDate?: string;
  repository?: string;
  objectURL?: string;
  tags?: Tag[];
  objectWikidata_URL?: string;
  isTimelineWork?: boolean;
  GalleryNumber?: string;
}

export interface Constituent {
  constituentID: number;
  role: string;
  name: string;
  constituentULAN_URL?: string;
  constituentWikidata_URL?: string;
  gender?: string;
}

export interface Tag {
  term: string;
  AAT_URL?: string;
  Wikidata_URL?: string;
}

// Type pour les recherches
export interface SearchResponse {
  total: number;
  objectIDs: number[] | null;
}

// Type pour les favoris (version simplifiée)
export interface FavoriteArt {
  objectID: string;
}

// Type pour les états de requête
export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
