import {
  analyze,
  filterStrings,
  parseNaturalLanguage,
} from './string.service.js';
import { getDb } from './storage.js';

export async function createString(req, res, next) {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: 'Missing value' });

    const db = getDb();
    await db.read();

    const existing = db.data.strings.find((s) => s.value === value);
    if (existing)
      return res
        .status(409)
        .json({ error: 'String already exists in the system' });

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
  if (!string)
    return res
      .status(404)
      .json({ error: 'String does not exist in the system' });

  res.json(string);
}

export async function getStrings(req, res) {
  try {
    const db = getDb();
    await db.read();
    const filters = {};
    if (req.query.is_palindrome !== undefined)
      filters.is_palindrome = req.query.is_palindrome === 'true';
    if (req.query.min_length)
      filters.min_length = parseInt(req.query.min_length);
    if (req.query.max_length)
      filters.max_length = parseInt(req.query.max_length);
    if (req.query.word_count)
      filters.word_count = parseInt(req.query.word_count);
    if (req.query.contains_character)
      filters.contains_character = req.query.contains_character;

    const filtered = filterStrings(db.data.strings, filters);

    res.json({
      data: filtered,
      count: filtered.length,
      filters_applied: filters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch strings' });
  }
}

export async function filterByNaturalLanguage(req, res) {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ error: 'Missing query parameter' });

    const filters = parseNaturalLanguage(query);

    const db = getDb();
    await db.read();

    const filtered = filterStrings(db.data.strings, filters);

    res.json({
      data: filtered,
      count: filtered.length,
      interpreted_query: {
        original: query,
        parsed_filters: filters,
      },
    });
  } catch (err) {
    if (err.message.includes('Unable to parse naatural language query'))
      return res.status(400).json({ error: err.message });
    res
      .status(422)
      .json({ error: 'Query parsed but resulted in conflicting filters' });
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

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete string' });
  }
}
