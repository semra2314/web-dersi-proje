// Kitap listesini getirip gösterir
// - Her kitap için category bilgisi de gösterilir (backend'de eager: true olarak ayarlandı)
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { getUser } from '../utils/auth';// burası ne demek?

export default function BookList() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get('/books');
      setBooks(Array.isArray(res.data) ? res.data : [res.data]);
    })();
  }, []);

  const user = getUser();// burası ne demek?

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <strong>{b.title}</strong> — {b.author} ({b.publishedAt}) — Category: {b.category?.name}
            {user?.role === 'admin' ? (
              <button
                style={{ marginLeft: 10 }}
                onClick={async () => {
                  if (!confirm('Bu kitabı silmek istediğinize emin misiniz?')) return;
                  await api.delete(`/books/${b.id}`);
                  const r = await api.get('/books');
                  setBooks(Array.isArray(r.data) ? r.data : [r.data]);
                }}
              >
                Sil
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
