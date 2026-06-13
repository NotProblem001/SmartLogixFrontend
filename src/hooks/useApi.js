import { useCallback, useEffect, useState } from 'react';

export const useApi = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetcher();
      setData(response);
    } catch (err) {
      setError(err?.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, retry: load };
};
