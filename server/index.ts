import app from './app';

const server = Bun.serve({
  fetch: app.fetch,
});

console.log(`Server listening on port ${server.port}...`);
