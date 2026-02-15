/**
 * Admin sayfası
 * - Sadece admin rolü sahip kullanıcıların erişebileceği yönetim paneli
 * - Yeni kategori ekleme ve yeni kitap ekleme formları
 * - Her form başarı/hata mesajını gösterir
 */
import React, { useState, useEffect } from 'react';
import api from '../utils/api';


export default function Admin() {
  const [catName, setCatName] = useState('');
  const [catMessage, setCatMessage] = useState('');
  const [catMsgType, setCatMsgType] = useState<'success' | 'error' | ''>('');

  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCategoryId, setBookCategoryId] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]); // Admin paneli için kitap listesi (silme vs.)
  const [bookMessage, setBookMessage] = useState('');
  const [bookMsgType, setBookMsgType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/categories');
        setCategories(Array.isArray(res.data) ? res.data : [res.data]);
        if (res.data?.length) setBookCategoryId(res.data[0].id);
        // Admin sayfasında kitap silme için kitap listesini de alıyoruz
        const bres = await api.get('/books');
        setBooks(Array.isArray(bres.data) ? bres.data : [bres.data]);
      } catch (err: any) {
        setCatMessage(err?.response?.data?.message || 'Kategoriler yüklenmedi');
        setCatMsgType('error');
      }
    })();
  }, []);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!catName.trim()) {
      setCatMessage('Kategori adı boş olamaz');
      setCatMsgType('error');
      return;
    }
    try {
      await api.post('/categories', { name: catName });
      setCatMessage('Kategori başarıyla eklendi');
      setCatMsgType('success');
      setCatName('');
      // Listeyi yenile
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err: any) {
      setCatMessage(err?.response?.data?.message || 'Kategori eklenirken hata');
      setCatMsgType('error');
    }
  }

  async function addBook(e: React.FormEvent) {
    e.preventDefault();
    if (!bookTitle.trim() || !bookAuthor.trim()) {
      setBookMessage('Kitap başlığı ve yazar adı gereklidir');
      setBookMsgType('error');
      return;
    }
    try {
      await api.post('/books', {
        title: bookTitle,
        author: bookAuthor,
        publishedAt: '2024',
        categoryId: bookCategoryId,
      });
      setBookMessage('Kitap başarıyla eklendi');
      setBookMsgType('success');
      setBookTitle('');
      setBookAuthor('');
    } catch (err: any) {
      setBookMessage(err?.response?.data?.message || 'Kitap eklenirken hata');
      setBookMsgType('error');
    }
  }

  return (
    <div>
      <h2>Admin Paneli</h2>

      <form onSubmit={addCategory} style={{ marginBottom: 30 }}>
        <h3>Yeni Kategori Ekle</h3>
        <input
          placeholder="Kategori adı"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
        />
        <button type="submit">Kategori Ekle</button>
        <div className={`message ${catMsgType}`}>{catMessage}</div>
      </form>

      <form onSubmit={addBook}>
        <h3>Yeni Kitap Ekle</h3>
        <input
          placeholder="Kitap Başlığı"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <input
          placeholder="Yazar"
          value={bookAuthor}
          onChange={(e) => setBookAuthor(e.target.value)}
        />
        <label>Kategori Seç</label>
        <select
          value={bookCategoryId}
          onChange={(e) => setBookCategoryId(Number(e.target.value))}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit">Kitap Ekle</button>
        <div className={`message ${bookMsgType}`}>{bookMessage}</div>
      </form>

      {/* Admin: mevcut kategorileri ve kitapları listeler, silme butonları */}
      <div style={{ marginTop: 40 }}>
        <h3>Mevcut Kategoriler</h3>
        <ul>
          {categories.map((c) => (
            <li key={c.id}>
              {c.name}{' '}
              <button
                onClick={async () => {
                  if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
                  try {
                    await api.delete(`/categories/${c.id}`);
                    const res = await api.get('/categories');
                    setCategories(res.data);
                  } catch (err: any) {
                    setCatMessage(err?.response?.data?.message || 'Kategori silinemedi');
                    setCatMsgType('error');
                    setTimeout(() => setCatMsgType(''), 3000);
                  }
                }}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>

        <h3>Mevcut Kitaplar</h3>
        <ul>
          {books.map((b) => (
            <li key={b.id}>
              <strong>{b.title}</strong> — {b.author} ({b.category?.name}){' '}
              <button
                onClick={async () => {
                  if (!confirm('Bu kitabı silmek istediğinize emin misiniz?')) return;
                  try {
                    await api.delete(`/books/${b.id}`);
                    const r = await api.get('/books');
                    setBooks(r.data);
                  } catch (err: any) {
                    setBookMessage(err?.response?.data?.message || 'Kitap silinemedi');
                    setBookMsgType('error');
                    setTimeout(() => setBookMsgType(''), 3000);
                  }
                }}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
