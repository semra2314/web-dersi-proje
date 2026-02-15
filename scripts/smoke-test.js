// Simple smoke test script
const axios = require('axios');
(async () => {
  const base = 'http://localhost:3000';
  try {
    console.log('1) Register user');
    const email = `smoke_${Date.now()}@example.com`;
    const reg = await axios.post(`${base}/auth/register`, { name: 'Smoke User', email, password: 'smoke123' });
    console.log(' register:', reg.data.message || reg.data);

    console.log('2) Admin login');
    const adminLogin = await axios.post(`${base}/auth/login`, { name: 'ADMİN1', password: 'a123456' });
    const adminToken = adminLogin.data.access_token;

    console.log('3) Create category');
    const catRes = await axios.post(`${base}/categories`, { name: 'SmokeCat' }, { headers: { Authorization: 'Bearer ' + adminToken } });
    console.log(' category:', catRes.data);
    const catId = catRes.data.id || catRes.data?.id;

    console.log('4) Create book');
    const bookRes = await axios.post(`${base}/books`, { title: 'Smoke Book', author: 'Test', publishedAt: '2020', categoryId: catId }, { headers: { Authorization: 'Bearer ' + adminToken } });
    console.log(' book:', bookRes.data);
    const bookId = bookRes.data.id || bookRes.data?.id;

    console.log('5) User login');
    const login = await axios.post(`${base}/auth/login`, { name: 'Smoke User', password: 'smoke123' });
    const token = login.data.access_token;

    console.log('6) Borrow book');
    const borrow = await axios.post(`${base}/borrowing`, { bookId }, { headers: { Authorization: 'Bearer ' + token } });
    console.log(' borrow:', borrow.data);

    console.log('7) Get my borrows');
    const my = await axios.get(`${base}/borrowing`, { headers: { Authorization: 'Bearer ' + token } });
    console.log(' my borrows:', JSON.stringify(my.data, null, 2));
    const borrowId = my.data && my.data[0] ? my.data[0].id : borrow.data?.id;

    console.log('8) Return borrow');
    await axios.post(`${base}/borrowing/${borrowId}/return`, {}, { headers: { Authorization: 'Bearer ' + token } });
    console.log(' returned');

    console.log('9) Admin delete book');
    await axios.delete(`${base}/books/${bookId}`, { headers: { Authorization: 'Bearer ' + adminToken } });
    console.log(' deleted book');

    console.log('10) Admin delete category');
    await axios.delete(`${base}/categories/${catId}`, { headers: { Authorization: 'Bearer ' + adminToken } });
    console.log(' deleted category');

    console.log('SMOKE-TEST OK');
  } catch (e) {
    console.error('SMOKE-TEST ERR', e.response?.data || e.message);
    process.exit(1);
  }
})();