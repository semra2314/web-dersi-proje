// Basit Register formu
// - name, email, password alır
// - role alanı geliştirme kolaylığı için opsiyonel (admin oluşturmak için kullanılabilir)
import React, { useState } from 'react';
import api from '../utils/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Basit client-side doğrulama
    if (!name.trim() || !email.trim() || password.length < 6) {
      setMessage('Lütfen tüm alanları doldurun ve şifre en az 6 karakter olmalıdır');
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/; //burda yıl
    if (!emailRegex.test(email)) {
      setMessage('Geçerli bir email girin');
      return;
    }

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      setMessage('Kayıt başarılı');
    } catch (err: any) {
      // Daha açıklayıcı hata mesajı göster
      const data = err?.response?.data;
      if (data) {
        if (Array.isArray(data.message)) {
          setMessage(data.message.join('. '));
          return;
        }
        if (typeof data.message === 'string') {
          setMessage(data.message);
          return;
        }
        if (typeof data.error === 'string') {
          setMessage(`${data.error}: ${data.message ?? ''}`.trim());
          return;
        }
        // Eğer beklenmedik bir JSON geliyorsa kısa stringleştirip göster
        setMessage(JSON.stringify(data).slice(0, 200));
        return;
      }

      // Ağ hatası veya beklenmedik hata: err.message varsa onu göster
      setMessage(err?.message || 'Kayıt sırasında beklenmeyen bir hata oluştu');
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Role </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <button type="submit">Register</button>
      <div className="message">{message}</div>
    </form>
  );
}
