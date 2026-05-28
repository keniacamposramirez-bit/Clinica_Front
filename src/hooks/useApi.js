import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFn, params = null, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await (params ? apiFn(params) : apiFn());
      setData(res.data?.data ?? res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), ...deps]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const execute = async (fn) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await fn();
      setSuccess(true);
      return result;
    } catch (e) {
      setError(e.response?.data?.message || 'Ocurrió un error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, execute };
}
