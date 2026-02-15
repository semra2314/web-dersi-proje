// Basit Login formu
// - isim & şifre alır
// - başarılı olursa localStorage'a token kaydeder
import React, { useState } from 'react';
import api from '../utils/api';
import { setAuth } from '../utils/auth';

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success'|'error'|''>('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    if (!name.trim() || !password) {
      setMessage('İsim ve şifre gereklidir');
      setMessageType('error');
      return;
    }

    try {
      const res = await api.post('/auth/login', { name, password });
      // token ve kullanıcı bilgisini kaydet
      setAuth(res.data.access_token, res.data.user);
      setMessage('Giriş başarılı');
      setMessageType('success');
      // Basitçe anasayfaya yönlendir
      window.location.href = '/';
    } catch (err: any) {
      const data = err?.response?.data;
      if (data) {
        if (Array.isArray(data.message)) {
          setMessage(data.message.join('. '));
          setMessageType('error');
          return;
        }
        if (typeof data.message === 'string') {
          setMessage(data.message);
          setMessageType('error');
          return;
        }
        if (typeof data.error === 'string') {
          setMessage(`${data.error}: ${data.message ?? ''}`.trim());
          setMessageType('error');
          return;
        }
        setMessage(JSON.stringify(data).slice(0, 200));
        setMessageType('error');
        return;
      }
      setMessage(err?.message || 'Giriş sırasında beklenmeyen bir hata oluştu');
      setMessageType('error');
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Giriş</h2>
      <div>
        <label>İsim</label>
        <input name="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Şifre</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Giriş</button>
      <div className={`message ${messageType}`}>{message}</div>
    </form>
  );
}
