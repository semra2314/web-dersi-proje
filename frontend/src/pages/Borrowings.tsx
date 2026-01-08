/**
 * Borrowings sayfası
 * - Giriş yapan kullanıcının ödünç aldığı kitapları listeler
 * - Yeni kitap ödünç alma formunu sunar
 * - JWT korumalı: sadece giriş yapan kullanıcılar erişebilir
 */
import React, { useState, useEffect } from 'react';
import api from '../utils/api';


export default function Borrowings() {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/borrowing');
        setBorrowings(res.data);
        const bres = await api.get('/books');
        setBooks(bres.data);
        if (bres.data.length) setSelectedBook(bres.data[0].id);
      } catch (err: any) {
        setMessage(err?.response?.data?.message || 'Veriler yüklenemedi');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function borrow(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBook) {
      setMessage('Lütfen bir kitap seçin');
      setMessageType('error');
      return;
    }
    try {
      await api.post('/borrowing', { bookId: selectedBook });
      setMessage('✓ Kitap başarıyla ödünç alındı');
      setMessageType('success');
      // Listeyi yenile
      const res = await api.get('/borrowing');
      setBorrowings(res.data);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Ödünç alma başarısız');
      setMessageType('error');
    }
  }

  return (
    <div>
      <h2>Kitap Ödünç Al</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <>
          <form onSubmit={borrow}>
            <label>Ödünç almak istediğiniz kitabı seçin</label>
            <select value={selectedBook || ''} onChange={(e) => setSelectedBook(Number(e.target.value))}>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
            <button type="submit">Ödünç Al</button>
            <div className={`message ${messageType}`}>{message}</div>
          </form>

          <div style={{ marginTop: 30 }}>
            <h3>Ödünç Aldığım Kitaplar</h3>
            {borrowings.length === 0 ? (
              <p>Henüz ödünç aldığınız kitap yok.</p>
            ) : (
              <ul>
                {borrowings.map((br) => (
                  <li key={br.id}>
                    <strong>{br.book.title}</strong> — {br.book.author}
                    <br />
                    <small>{new Date(br.borrowedAt).toLocaleString('tr-TR')}</small>// burdan aşağısı ne demek?
                    {br.returnedAt ? (
                      <div><em>İade edildi: {new Date(br.returnedAt).toLocaleString('tr-TR')}</em></div>
                    ) : (
                      <div>
                        <button
                          onClick={async () => {
                            try {
                              await api.post(`/borrowing/${br.id}/return`);
                              const r = await api.get('/borrowing');
                              setBorrowings(r.data);
                            } catch (err: any) {
                              setMessage(err?.response?.data?.message || 'İade işlemi başarısız');
                              setMessageType('error');
                            }
                          }}
                        >
                          Teslim Et
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
