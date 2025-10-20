import { analyze } from './string.service.js';
import { getDb } from './storage.js';

export async function createString(req, res, next) {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Missing value' });

    const db = getDb();
    await db.read();

    const existing = db.data.strings.find((s) => s.value === value);
    if (existing) return res.status(409).json({ error: 'Already exists' });

    const analysis = analyze(value);

    const newString = {
      id: analysis.sha256_hash,
      value,
      properties: analysis,
      created_at: new Date().toISOString(),
    };

    db.data.strings.push(newString);
    await db.write();

    res.status(201).json(newString);
  } catch (err) {
    next(err);
  }
}

export async function getString(req, res) {
  const { id } = req.params;
  const db = getDb();
  await db.read();

  const string = db.data.strings.find((s) => s.id === id);
  if (!string) return res.status(404).json({ error: 'String not found' });

  res.json(string);
}

export async function getStrings(req, res) {
  try {
    const db = getDb();
    const allStrings = db.data.strings || [];
    res.json({ count: allStrings.length, data: allStrings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch strings' });
  }
}

export async function deleteString(req, res) {
  try {
    const { id } = req.params;
    const db = getDb();
    const index = db.data.strings.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'String not found' });
    }

    db.data.strings.splice(index, 1);
    await db.write();

    res.status(200).json({ message: 'String deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete string' });
  }
}
