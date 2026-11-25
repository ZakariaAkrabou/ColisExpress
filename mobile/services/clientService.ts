
import {api} from './api';
import type { Client } from '../types/clients.types';

export interface ClientInput {
  name: string;
  phone: string;
  city: string;
}

interface ApiClient {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  city: string;
  createdAt?: string;
}

interface ClientsResponse {
  message: string;
  count: number;
  clients: ApiClient[];
}

interface ClientResponse {
  message: string;
  client: ApiClient;
}

const mapClient = (data: ApiClient): Client => {
  const id = data._id ?? data.id;

  if (!id) {
    throw new Error('The server returned a client without an ID.');
  }

  return {
    id: String(id),
    name: data.name,
    phone: data.phone,
    city: data.city,
    totalShipments: 0,
    createdAt: data.createdAt,
  };
};

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get<ClientsResponse>('/clients');

  if (!Array.isArray(response.data.clients)) {
    throw new Error('Invalid clients response from server.');
  }

  return response.data.clients.map(mapClient);
};

export const createClient = async (
  clientData: ClientInput
): Promise<Client> => {
  const response = await api.post<ClientResponse>(
    '/clients',
    clientData
  );

  return mapClient(response.data.client);
};

export const updateClient = async (
  id: string,
  clientData: Partial<ClientInput>
): Promise<Client> => {
  const response = await api.put<ClientResponse>(
    `/clients/${encodeURIComponent(id)}`,
    clientData
  );

  return mapClient(response.data.client);
};

export const deleteClient = async (id: string): Promise<void> => {
  await api.delete(`/clients/${encodeURIComponent(id)}`);
};
