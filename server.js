const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 3000;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function send(res, status, file) {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      return res.end('500 - Server error');
    }
    res.writeHead(status, {'Content-Type': mime[path.extname(file)] || 'application/octet-stream'});
    res.end(data);
  });
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Every URL under /broken/ is intentionally a REAL HTTP 404.
  if (urlPath.startsWith('/broken/')) {
    return send(res, 404, path.join(root, '404.html'));
  }

  const requested = urlPath === '/' ? '/index.html' : urlPath;
  const safePath = path.normalize(requested).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    return send(res, 404, path.join(root, '404.html'));
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) return send(res, 200, filePath);
    return send(res, 404, path.join(root, '404.html'));
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`QA mimic site listening on port ${port}`);
});
