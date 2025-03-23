import { sql, SQL } from 'bun';

const connectionString = process.env.DATABASE_URL!;

const db = new SQL({
  url: connectionString,
});

async function ensureDatabaseExists() {
  const defaultSql = new SQL({
    url: connectionString.replace(/\/[^\/]+$/, '/postgres'),
  });

  const dbName = connectionString.split('/').pop();

  const result =
    await defaultSql`SELECT 1 FROM pg_database WHERE datname = ${dbName}`;

  if (result.length === 0) {
    await defaultSql`CREATE DATABASE ${sql(dbName)}`;
    console.log(`Database "${dbName}" created.`);
  } else {
    console.log(`Database "${dbName}" already exists.`);
  }
}

async function ensureTablesExist() {
  const targetSql = new SQL({ url: connectionString });

  await targetSql`
    CREATE TABLE IF NOT EXISTS plan (
    id             TEXT       PRIMARY KEY,
    plan           TEXT       NOT NULL,
    pricePaid      INTEGER    NOT NULL,
    endDate        TIMESTAMP,
    "user"         TEXT       NOT NULL,
    eventName      TEXT       NOT NULL,
    pauseUploads   BOOLEAN    DEFAULT false NOT NULL,
    url            TEXT       UNIQUE,
    pin            TEXT
)`;

  await targetSql`
    CREATE TABLE IF NOT EXISTS image (
    plan_id        TEXT       NOT NULL,
    guest          TEXT       NOT NULL,
    url            TEXT       NOT NULL,
    key            TEXT       NOT NULL,
    createdAt      TIMESTAMP  NOT NULL,
    size           INTEGER    NOT NULL,
    PRIMARY KEY (plan_id),
    CONSTRAINT image_plan_id_plan_id_fk FOREIGN KEY (plan_id) REFERENCES plan(id) ON DELETE CASCADE
)`;

  console.log('Tables ensured.');
}

export async function initializeDatabase() {
  await ensureDatabaseExists();
  await ensureTablesExist();
}
