import express from 'express';
import {
  createString,
  getString,
  getStrings,
  deleteString,
  filterByNaturalLanguage,
} from './string.controller.js';

const router = express.Router();

router.post('/strings', createString);
router.get('/strings/filter-by-natural-language', filterByNaturalLanguage);

router.get('/strings/:id', getString);
router.get('/strings', getStrings);
router.delete('/strings/:id', deleteString);

export default router;
