import { SQL } from 'bun';

const db = new SQL({
  url: process.env.DATABASE_URL,
});
