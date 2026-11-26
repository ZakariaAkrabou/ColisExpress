//useColis.ts

import { useCallback, useEffect, useState } from 'react';

import {
  getColis,
  createColis,
  updateColis,
  deleteColis,
  deleteColisBulk,
  deleteAllColis,
} from '../services/colisServece';

import type {
  Colis,
  CreateColisInput,
  UpdateColisInput,
  ColisFilters,
} from '../types/colis.types';

export const useColis = () => {
  const [colis, setColis] = useState<Colis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColis = useCallback(async (filters?: ColisFilters) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getColis(filters);
      setColis(data);

      return data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch colis';

      setError(message);
      console.error('Fetch Colis Error:', err);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addColis = useCallback(async (data: CreateColisInput) => {
    try {
      setError(null);

      const newColis = await createColis(data);

      setColis((previous) => [...previous, newColis]);

      return newColis;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create colis';

      setError(message);
      console.error('Create Colis Error:', err);

      throw err;
    }
  }, []);

  const modifyColis = useCallback(
    async (id: string, data: UpdateColisInput) => {
      try {
        setError(null);

        const updatedColis = await updateColis(id, data);

        setColis((previous) =>
          previous.map((item) =>
            item.id === id ? updatedColis : item
          )
        );

        return updatedColis;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to update colis';

        setError(message);
        console.error('Update Colis Error:', err);

        throw err;
      }
    },
    []
  );

  const removeColis = useCallback(async (id: string) => {
    try {
      setError(null);

      await deleteColis(id);

      setColis((previous) => previous.filter((item) => item.id !== id));

      // Backend renumbers the remaining colis after deletion.
      await fetchColis();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete colis';

      setError(message);
      console.error('Delete Colis Error:', err);

      throw err;
    }
  }, [fetchColis]);

  const removeColisBulk = useCallback(async (ids: string[]) => {
    try {
      setError(null);

      const deletedCount = await deleteColisBulk(ids);

      // Refresh because the backend renumbers remaining commands.
      await fetchColis();

      return deletedCount;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete selected colis';

      setError(message);
      console.error('Bulk Delete Colis Error:', err);

      throw err;
    }
  }, [fetchColis]);

  const removeAllColis = useCallback(async () => {
    try {
      setError(null);

      const deletedCount = await deleteAllColis();
      setColis([]);

      return deletedCount;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete all colis';

      setError(message);
      console.error('Delete All Colis Error:', err);

      throw err;
    }
  }, []);

  useEffect(() => {
    fetchColis().catch(() => {
      // Error is already stored in the hook state.
    });
  }, [fetchColis]);

  return {
    colis,
    loading,
    error,
    fetchColis,
    addColis,
    modifyColis,
    removeColis,
    removeColisBulk,
    removeAllColis,
  };
};
