const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_URL = rawApiUrl.replace(/\/$/, '');
export const SERVER_BASE_URL = API_URL.replace(/\/api$/, '');

export const resolveAssetUrl = (path?: string): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80';
  }
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  return `${SERVER_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
