// Hook to encapsulate client business logic
import { useEffect, useState, useCallback } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../services/clientService';
import type { Client, ClientInput } from '../types/clients.types';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (e) {
      console.error('Failed to fetch clients', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = useCallback(async (clientData: ClientInput): Promise<boolean> => {
    try {
      const newClient = await createClient(clientData);
      setClients((prev) => [...prev, newClient]);
      return true;
    } catch (e) {
      console.error('Failed to add client', e);
      return false;
    }
  }, []);

  const modifyClient = useCallback(async (id: string, clientData: Partial<ClientInput>): Promise<boolean> => {
    try {
      const updated = await updateClient(id, clientData);
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return true;
    } catch (e) {
      console.error('Failed to update client', e);
      return false;
    }
  }, []);

  const removeClient = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (e) {
      console.error('Failed to delete client', e);
      return false;
    }
  }, []);

  return { clients, loading, fetchClients, addClient, modifyClient, removeClient };
};
