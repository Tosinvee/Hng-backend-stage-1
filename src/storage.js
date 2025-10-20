import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export async function initDb() {
  const dataDir = path.join(__dirname, '..', 'data');
  const file = path.join(dataDir, 'db.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const adapter = new JSONFile(file);
  db = new Low(adapter, { strings: [] });

  await db.read();
  db.data ||= { strings: [] };
  await db.write();

  console.log(' Database initialized successfully');
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
