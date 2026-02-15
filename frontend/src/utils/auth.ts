/**
 * Basit kimlik yönetimi yardımcıları
 * - Bu küçük fonksiyonlar token ve kullanıcı bilgisini localStorage'da tutar
 * - Gerçek uygulamalarda token yönetimi, güvenlik ve yenileme (refresh) mekanizmalarını düşünmelisiniz
 */
export function setAuth(token: string, user: any) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
} 

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
