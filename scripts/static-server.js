// Basit static sunucu: geliştirme sırasında `frontend/dist` klasörünü 5173 portunda sunar.
// Türkçe açıklama: Bu dosya CI veya yerel testler için kullanılır; puppeteer gibi araçların
// frontend dosyalarına erişebilmesi için basit bir HTTP sunucusu sağlar.
const http = require('http');
const path = require('path');
const fs = require('fs');

const distDir = path.join(__dirname, '..', 'frontend', 'dist');
const port = 5173;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Eğer istenen dosya bulunamazsa, SPA rotaları için index.html döndürülür
      fs.readFile(path.join(distDir, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(500);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath);
    const type = mime[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Static server serving ${distDir} on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});