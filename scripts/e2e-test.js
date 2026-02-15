// Basit E2E test script'i - Node.js ile çalıştırın
// Kullanım: node scripts/e2e-test.js
// Not: Bu script, backend'in http://localhost:3000 üzerinde çalıştığını varsayar.

const axios = require('axios');

(async () => {
  const base = 'http://localhost:3000';
  const out = {};
  try {
    // 1) Register
    const email = 'e2e_user@example.com';
    await axios.post(`${base}/auth/register`, { name: 'E2E User', email, password: 'e2e-pass-123' })
      .then(r => out.register = r.data)
      .catch(e => out.registerErr = e.response?.data || String(e));

    // 2) Login
    await axios.post(`${base}/auth/login`, { name: 'E2E User', password: 'e2e-pass-123' })
      .then(r => { out.login = r.data; out.token = r.data.access_token; })
      .catch(e => out.loginErr = e.response?.data || String(e));

    // 3) Create category (try as admin may fail unless promoted)
    const headers = { Authorization: `Bearer ${out.token}` };
    await axios.post(`${base}/categories`, { name: 'E2E Category' }, { headers })
      .then(r => out.createCategory = r.data)
      .catch(e => out.createCategoryErr = e.response?.data || String(e));

    // 4) Create book (admin only)
    await axios.post(`${base}/books`, { title: 'E2E Book', author: 'E2E Author', categoryId: 1 }, { headers })
      .then(r => out.createBook = r.data)
      .catch(e => out.createBookErr = e.response?.data || String(e));

    // 5) Borrow a book
    await axios.post(`${base}/borrowing`, { bookId: 1 }, { headers })
      .then(r => out.borrow = r.data)
      .catch(e => out.borrowErr = e.response?.data || String(e));

    // 6) Get my borrows
    await axios.get(`${base}/borrowing`, { headers })
      .then(r => out.myBorrows = r.data)
      .catch(e => out.myBorrowsErr = e.response?.data || String(e));

    require('fs').writeFileSync('e2e-results.json', JSON.stringify(out, null, 2));
    console.log('E2E test complete. Results saved to e2e-results.json');
  } catch (err) {
    console.error('E2E script error', err);
    process.exit(1);
  }
})();