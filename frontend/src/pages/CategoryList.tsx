// Kategori listesini gösterir ve admin ise kategori ekle butonunu Admin sayfasına yönlendirir
/**
 * CategoryList sayfası
 * - Backend'den kategorileri getirip basit liste olarak gösterir
 * - Admin sayfasında yeni kategori eklemek mümkündür
 */
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function CategoryList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err: any) {
        setError('Kategoriler yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Kategoriler</h2>
      {loading ? <p>Yükleniyor...</p> : null}
      {error ? <div className="message error">{error}</div> : null}
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
