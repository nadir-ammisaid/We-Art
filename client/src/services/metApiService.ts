export interface Artwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  artistBeginDate?: string;
  artistEndDate?: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  creditLine: string;
  primaryImage: string;
  primaryImageSmall: string;
  department: string;
  culture: string;
  period: string;
  dynasty: string;
  reign: string;
  portfolio: string;
  classification: string;
  objectName: string;
  objectURL: string;
  tags: Array<{ term: string; AAT_URL: string; Wikidata_URL: string }>;
  geographyType?: string;
  city?: string;
  country?: string;
}

const CACHE_DURATION = 5 * 60 * 1000;
const INVALID_CACHE_DURATION = 30 * 1000;
const MAX_RETRY_COUNT = 3;
const BATCH_SIZE = 5;
const BATCH_DELAY = 150;

interface CachedArtwork {
  data: Artwork;
  timestamp: number;
}

interface InvalidIdEntry {
  timestamp: number;
  retryCount: number;
}

const artworkCache = new Map<string, CachedArtwork>();
const invalidIdsCache = new Map<string, InvalidIdEntry>();

function cleanupInvalidCache() {
  if (Math.random() > 0.9) {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of invalidIdsCache.entries()) {
      if (now - entry.timestamp > INVALID_CACHE_DURATION) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      invalidIdsCache.delete(key);
    }
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class MetApiService {
  private baseUrl = "https://collectionapi.metmuseum.org/public/collection/v1";

  async getArtwork(id: string | number): Promise<Artwork> {
    const idStr = String(id);
    cleanupInvalidCache();

    const invalidEntry = invalidIdsCache.get(idStr);
    if (invalidEntry) {
      const now = Date.now();
      const isExpired = now - invalidEntry.timestamp > INVALID_CACHE_DURATION;

      if (!isExpired && invalidEntry.retryCount >= MAX_RETRY_COUNT) {
        throw new Error(`Artwork ${idStr} permanently unavailable`);
      }

      if (isExpired) {
        invalidIdsCache.delete(idStr);
      }
    }

    const cached = artworkCache.get(idStr);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}/objects/${idStr}`);

      if (!response.ok) {
        if (response.status === 404 || response.status === 403) {
          const currentEntry = invalidIdsCache.get(idStr);
          const retryCount = currentEntry ? currentEntry.retryCount + 1 : 1;
          invalidIdsCache.set(idStr, {
            timestamp: Date.now(),
            retryCount,
          });
          throw new Error(`Artwork not found (${response.status})`);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const artwork: Artwork = await response.json();

      if (!artwork.primaryImageSmall) {
        const currentEntry = invalidIdsCache.get(idStr);
        const retryCount = currentEntry ? currentEntry.retryCount + 1 : 1;
        invalidIdsCache.set(idStr, {
          timestamp: Date.now(),
          retryCount,
        });
        throw new Error("No image available");
      }

      artworkCache.set(idStr, {
        data: artwork,
        timestamp: Date.now(),
      });

      invalidIdsCache.delete(idStr);

      return artwork;
    } catch (error) {
      console.error(`Error fetching artwork ${idStr}:`, error);
      throw error;
    }
  }

  async getArtworks(
    ids: (string | number)[],
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<Artwork[]> {
    const results: Artwork[] = [];
    const total = ids.length;
    let loaded = 0;

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map((id) =>
        this.getArtwork(id)
          .then((artwork) => {
            loaded++;
            if (onProgress) {
              onProgress(loaded, total);
            }
            return artwork;
          })
          .catch((error) => {
            console.error(`Failed to fetch artwork ${id}:`, error);
            loaded++;
            if (onProgress) {
              onProgress(loaded, total);
            }
            return null;
          }),
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(
        ...(batchResults.filter((artwork) => artwork !== null) as Artwork[]),
      );

      if (i + BATCH_SIZE < ids.length) {
        await delay(BATCH_DELAY);
      }
    }

    return results;
  }
}

export const metApiService = new MetApiService();
