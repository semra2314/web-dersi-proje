// Bu script geliştirme ortamındaki SQLite veritabanını kontrol etmek için yazılmıştır.
// Amaç: tabloları listelemek ve belirli tabloların ilk birkaç satırını göstermek.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db.sqlite');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Veritabanı açılamadı:', err.message);
    process.exit(1);
  }
});

function listTables() {
  return new Promise((resolve, reject) => {
    db.all("SELECT name, type FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'", (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(r => r.name));
    });
  });
}

async function dumpSample(table) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${table} LIMIT 10`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

(async () => {
  try {
    console.log('DB dosyası:', dbPath);
    const tables = await listTables();
    if (tables.length === 0) {
      console.log('Veritabanında tablo yok veya veritabanı boş.');
      process.exit(0);
    }
    console.log('Tablolar:', tables.join(', '));
    for (const t of tables) {
      console.log('\n== ' + t + ' (örnek 10 satır) ==');
      const rows = await dumpSample(t);
      if (rows.length === 0) console.log('  (Bu tabloda satır yok)');
      else console.table(rows);
    }
    process.exit(0);
  } catch (err) {
    console.error('Hata:', err.message);
    process.exit(1);
  }
})();
