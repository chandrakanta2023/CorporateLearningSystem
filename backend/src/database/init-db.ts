import 'reflect-metadata';
import { Client } from 'pg';
import { getDbEnv } from './db-config';

async function initDb() {
  const db = getDbEnv();
  const adminClient = new Client({
    host: db.host,
    port: db.port,
    user: db.username,
    password: db.password,
    database: 'postgres',
  });

  await adminClient.connect();
  const existsResult = await adminClient.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [db.database],
  );

  if (existsResult.rowCount === 0) {
    await adminClient.query(`CREATE DATABASE "${db.database}"`);
    // eslint-disable-next-line no-console
    console.log(`Database created: ${db.database}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Database already exists: ${db.database}`);
  }

  await adminClient.end();
}

initDb().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
