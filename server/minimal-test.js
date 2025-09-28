// Minimal test server to diagnose Render issues
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🧪 MINIMAL TEST SERVER STARTING...');
console.log(`📋 Environment: ${process.env.NODE_ENV || 'not set'}`);
console.log(`🔌 Port: ${PORT}`);
console.log(`📦 DATABASE_URL: ${process.env.DATABASE_URL ? 'set' : 'not set'}`);

app.get('/', (req, res) => {
  res.send('Minimal test server is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Minimal test server health check',
    env: process.env.NODE_ENV,
    port: PORT
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Minimal test server listening on port ${PORT}`);
});

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});
