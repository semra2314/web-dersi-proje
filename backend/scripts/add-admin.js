// Bu script 'ADMİN1' adlı bir admin kullanıcı oluşturur veya var ise mevcut kullanıcıyı admin yapar.
// Kullanım: node backend/scripts/add-admin.js
// Not: Bu script development amaçlıdır; production'da migrate/seed mekanizması veya /auth/make-admin endpoint'i kullanılmalıdır.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'db.sqlite');
const db = new sqlite3.Database(dbPath);

const name = 'ADMİN1';
const email = 'admin1@e.com';
const plainPassword = 'a123456'; // Basit parola (geliştirme için)
const hashed = bcrypt.hashSync(plainPassword, 10);
const role = 'admin';

db.serialize(() => {
  db.get('SELECT * FROM user WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('DB hatası:', err.message);
      process.exit(1);
    }
    if (row) {
      console.log('Kullanıcı zaten var. Rol güncelleniyor...');
      db.run('UPDATE user SET role = ?, name = ? WHERE email = ?', [role, name, email], function (uErr) {
        if (uErr) console.error('Güncelleme hatası:', uErr.message);
        else console.log('Kullanıcı rolü admin olarak ayarlandı.');
        process.exit(0);
      });
    } else {
      console.log('Yeni admin oluşturuluyor...');
      db.run('INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role], function (iErr) {
        if (iErr) {
          console.error('Ekleme hatası:', iErr.message);
          process.exit(1);
        }
        console.log('ADMİN1 oluşturuldu. E-posta:', email, 'Parola:', plainPassword);
        process.exit(0);
      });
    }
  });
});
