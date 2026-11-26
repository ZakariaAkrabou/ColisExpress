//colisServece.ts

import { api } from './api';
import type {
  Colis,
  CreateColisInput,
  UpdateColisInput,
  ColisFilters,
} from '../types/colis.types';

interface ColisApiResponse {
  _id?: string;
  id?: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  weight: number;
  price: number;
  quantity: number;
  orderInCommand: number;
  ncommand: string;
  isPaid: boolean;
  isADomicile: boolean;
  status: Colis['status'];
  date?: string;
  description?: string;
  image?: string;
  direction?: Colis['direction'];
  createdAt?: string;
  updatedAt?: string;
}

interface GetColisResponse {
  message: string;
  count: number;
  colis: ColisApiResponse[];
}

interface SingleColisResponse {
  message: string;
  colis: ColisApiResponse;
}

interface DeleteResponse {
  message: string;
  deletedCount?: number;
}

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
const DEFAULT_PARCEL_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500';

export const getColisImage = (image?: string): string => {
  if (!image) return DEFAULT_PARCEL_IMAGE;

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('file://') ||
    image.startsWith('data:')
  ) {
    return image;
  }

  if (!API_BASE_URL) return DEFAULT_PARCEL_IMAGE;

  return `${API_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
};

const normalizeColis = (item: ColisApiResponse): Colis => ({
  ...item,
  id: item._id || item.id || '',
});

export const getColis = async (
  filters?: ColisFilters
): Promise<Colis[]> => {
  const response = await api.get<GetColisResponse>('/colis', {
    params: filters,
  });

  return (response.data.colis || []).map(normalizeColis);
};

export const getColisById = async (id: string): Promise<Colis> => {
  const response = await api.get<SingleColisResponse>(`/colis/${id}`);
  return normalizeColis(response.data.colis);
};

const isLocalImageUri = (image?: string): boolean =>
  Boolean(image) &&
  !image!.startsWith('http://') &&
  !image!.startsWith('https://') &&
  !image!.startsWith('/uploads/');

const buildColisFormData = (
  data: CreateColisInput | UpdateColisInput
): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || key === 'image') return;
    formData.append(key, String(value));
  });

  if (data.image && isLocalImageUri(data.image)) {
    const uri = data.image;
    const filename = uri.split('/').pop() || `colis-${Date.now()}.jpg`;
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeType =
      ext === 'png'
        ? 'image/png'
        : ext === 'webp'
        ? 'image/webp'
        : 'image/jpeg';

    formData.append('image', {
      uri,
      name: filename,
      type: mimeType,
    } as any);
  }

  return formData;
};

export const createColis = async (
  data: CreateColisInput
): Promise<Colis> => {
  if (!isLocalImageUri(data.image)) {
    const response = await api.post<SingleColisResponse>('/colis', data);
    return normalizeColis(response.data.colis);
  }

  const formData = buildColisFormData(data);
  const response = await api.post<SingleColisResponse>('/colis', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return normalizeColis(response.data.colis);
};

export const updateColis = async (
  id: string,
  data: UpdateColisInput
): Promise<Colis> => {
  if (!isLocalImageUri(data.image)) {
    const response = await api.put<SingleColisResponse>(
      `/colis/${id}`,
      data
    );

    return normalizeColis(response.data.colis);
  }

  const formData = buildColisFormData(data);
  const response = await api.put<SingleColisResponse>(
    `/colis/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return normalizeColis(response.data.colis);
};

export const deleteColis = async (id: string): Promise<void> => {
  await api.delete(`/colis/${id}`);
};

export const deleteColisBulk = async (
  ids: string[]
): Promise<number> => {
  const response = await api.delete<DeleteResponse>('/colis/bulk', {
    data: { ids },
  });

  return response.data.deletedCount || 0;
};

export const deleteAllColis = async (): Promise<number> => {
  const response = await api.delete<DeleteResponse>('/colis/all');
  return response.data.deletedCount || 0;
};
