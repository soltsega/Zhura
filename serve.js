const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend', 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  let fp = path.join(dir, url);

  // Try to serve the exact file
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
    const ext = path.extname(fp);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(fp).pipe(res);
    return;
  }

  // SPA fallback: serve index.html for all routes
  const indexPath = path.join(dir, 'index.html');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream(indexPath).pipe(res);
});

server.listen(4181, () => console.log('SPA server ready at http://localhost:4181'));
