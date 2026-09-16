import { useCallback, useEffect, useState } from 'react';
import { briefsService } from '../services/briefsService';
import type { Brief, CreateBriefFormData } from '../types/brief';
import { useAuth } from '../context/AuthContext';

export function useBriefs() {
  const { user } = useAuth();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBriefs = useCallback(async () => {
    if (!user) {
      setBriefs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await briefsService.getBriefs();
      setBriefs(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load your briefs. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBriefs();
  }, [fetchBriefs]);

  const analyzeBrief = async (formData: CreateBriefFormData): Promise<Brief> => {
    if (!user) throw new Error('User is not authenticated.');
    const newBrief = await briefsService.analyzeBrief(formData);
    setBriefs((prev) => [newBrief, ...prev]);
    return newBrief;
  };

  const deleteBrief = async (id: string): Promise<void> => {
    await briefsService.deleteBrief(id);
    setBriefs((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    briefs,
    isLoading,
    error,
    refetch: fetchBriefs,
    analyzeBrief,
    deleteBrief,
  };
}

