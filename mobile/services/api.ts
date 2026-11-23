
import axios from 'axios';

export const API_BASE_URL = 'http://192.168.1.122:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export default api;
