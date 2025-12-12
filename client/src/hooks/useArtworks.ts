import { useCallback, useEffect, useState } from "react";
import { type Artwork, metApiService } from "../services/metApiService";

interface UseArtworksReturn {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook custom pour charger plusieurs œuvres
 */
export function useArtworks(ids: (string | number)[]): UseArtworksReturn {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = useCallback(async () => {
    if (ids.length === 0) {
      setArtworks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await metApiService.getArtworks(ids);
      setArtworks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Error in useArtworks:", err);
    } finally {
      setLoading(false);
    }
  }, [ids]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return {
    artworks,
    loading,
    error,
    refetch: fetchArtworks,
  };
}

interface UseArtworkReturn {
  artwork: Artwork | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook custom pour charger une seule œuvre
 */
export function useArtwork(id: string | number | undefined): UseArtworkReturn {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtwork = useCallback(async () => {
    if (!id) {
      setArtwork(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await metApiService.getArtwork(id);
      setArtwork(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Error in useArtwork:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArtwork();
  }, [fetchArtwork]);

  return {
    artwork,
    loading,
    error,
    refetch: fetchArtwork,
  };
}
