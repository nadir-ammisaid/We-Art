import { useCallback, useEffect, useMemo, useState } from "react";
import { type Artwork, metApiService } from "../services/metApiService";

interface UseArtworksReturn {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  progress: { loaded: number; total: number } | null;
}

export function useArtworks(ids: (string | number)[]): UseArtworksReturn {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    loaded: number;
    total: number;
  } | null>(null);

  const idsString = useMemo(() => JSON.stringify(ids), [ids]);

  const fetchArtworks = useCallback(async () => {
    const parsedIds = JSON.parse(idsString);

    if (parsedIds.length === 0) {
      setArtworks([]);
      setLoading(false);
      setProgress(null);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress({ loaded: 0, total: parsedIds.length });

    try {
      const data = await metApiService.getArtworks(
        parsedIds,
        (loaded, total) => {
          setProgress({ loaded, total });
        },
      );
      setArtworks(data);
      setProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Error in useArtworks:", err);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [idsString]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return {
    artworks,
    loading,
    error,
    refetch: fetchArtworks,
    progress,
  };
}

interface UseArtworkReturn {
  artwork: Artwork | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

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
