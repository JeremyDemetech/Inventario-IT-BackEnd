import app from './server';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const sslKeyPath = process.env.SSL_KEY_PATH || '';
const sslCertPath = process.env.SSL_CERT_PATH || '';

const tryStartHttps = (): boolean => {
  if (!sslKeyPath || !sslCertPath) return false;

  try {
    const key = fs.readFileSync(path.resolve(sslKeyPath));
    const cert = fs.readFileSync(path.resolve(sslCertPath));
    const server = https.createServer({ key, cert }, app);
    server.listen(PORT, () => {
      console.log(`HTTPS server listening on port ${PORT}`);
    });
    return true;
  } catch (err) {
    console.error('Failed to start HTTPS server:', err);
    return false;
  }
};

if (!tryStartHttps()) {
  // Fallback to HTTP if HTTPS not configured or fails
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT} (HTTPS not configured)`);
  });
}
