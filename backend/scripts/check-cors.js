// Bu script CORS başlıklarını kontrol etmek için yazılmıştır.
// Kullanım: node backend/scripts/check-cors.js
// Not: Bu test sunucunun CORS yapılandırmasını kontrol eder (preflight ve POST response).

const axios = require('axios');

(async () => {
  const url = 'http://localhost:3000/auth/register';
  try {
    console.log('OPTIONS (preflight) isteği gönderiliyor...');
    const opt = await axios({ method: 'options', url, headers: { Origin: 'http://localhost:5173' }, validateStatus: () => true });
    console.log('OPTIONS durum kodu:', opt.status);
    console.log('Access-Control-Allow-Origin:', opt.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Methods:', opt.headers['access-control-allow-methods']);

    console.log('\nPOST isteği (test) gönderiliyor (beklenen 409 veya 400 olabilir)...');
    const post = await axios.post(url, { name: 'CORS Test', email: 'cors-test@example.com', password: 'test123' }, { headers: { Origin: 'http://localhost:5173' }, validateStatus: () => true });
    console.log('POST durum kodu:', post.status);
    console.log('Response Access-Control-Allow-Origin:', post.headers['access-control-allow-origin']);
    console.log('POST response body sample:', JSON.stringify(post.data).slice(0, 300));
  } catch (err) {
    console.error('Hata:', err.message);
  }
})();