const http = require('http');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', message: 'Simple server is running!' }));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Simple server is running!');
  }
});

// Try binding to localhost instead of 0.0.0.0
server.listen(PORT, () => {
  console.log(`Simple server listening on port ${PORT}`);
});
