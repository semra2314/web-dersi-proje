/**
 * api.ts
 * - Sunucuya yapılan HTTP isteklerinin merkezi (ortak) yönetildiği yer
 * - Her isteğe otomatik olarak Authorization header'ı (token) eklenir
 * - Böylece bileşenler sadece 'api.get/post' çağırır, token'ı kendilerinin eklemesine gerek kalmaz
 */
import axios from 'axios';

let API_URL = 'http://localhost:3000';
try {
  const env = (import.meta as any).env;
  if (env && env.VITE_API_URL) API_URL = env.VITE_API_URL;
} catch (_) {
  // import.meta erişimi tip sorunlarına karşı güvenli fallback
}

const api = axios.create({ baseURL: API_URL });

// Her istekten önce localStorage'dan token alıp Authorization header'ına ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
