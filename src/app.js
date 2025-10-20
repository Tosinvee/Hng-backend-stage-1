import express from 'express';
import { initDb } from './storage.js';
import stringRoutes from './string.routes.js';

export const app = express();

app.use(express.json());

initDb();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/', stringRoutes);
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
