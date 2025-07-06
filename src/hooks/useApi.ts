import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

// Hook générique pour les appels API
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
}

// Hooks spécifiques
export function useCandidates(filters?: any) {
  return useApi(() => apiService.getCandidates(filters), [filters]);
}

export function useJobOffers(filters?: any) {
  return useApi(() => apiService.getJobOffers(filters), [filters]);
}

export function useMatches() {
  return useApi(() => apiService.getMatches());
}

export function useChats() {
  return useApi(() => apiService.getChats());
}

export function useNotifications() {
  return useApi(() => apiService.getNotifications());
}