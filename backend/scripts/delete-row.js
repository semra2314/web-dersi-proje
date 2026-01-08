// Bu script doğrudan SQLite DB üzerinde bir satırı siler (GELİŞTİRME İÇİN)
// Kullanım: node backend/scripts/delete-row.js <table> <id>
// ÖNEMLİ: Sunucu (backend) çalışıyorsa önce durdurun, aksi halde DB dosyası kilitlenebilir veya değişiklikler beklenmeyebilir.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const [,, table, id] = process.argv;
if (!table || !id) {
  console.error('Kullanım: node backend/scripts/delete-row.js <table> <id>');
  process.exit(1);
}

const dbPath = path.join(__dirname, '..', 'db.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Veritabanı açılamadı:', err.message);
    process.exit(1);
  }
});

console.log(`Silme: tablonun ${table} id=${id} satırı...`);

db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function (err) {
  if (err) {
    console.error('Silme hatası:', err.message);
    process.exit(1);
  }
  console.log(`Silindi. Etkilenen satır sayısı: ${this.changes}`);
  process.exit(0);
});