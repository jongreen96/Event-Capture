import app from './app';

Bun.serve({
  fetch: app.fetch,
  port: 3001,
});

console.log('Server is running on port 3001');
