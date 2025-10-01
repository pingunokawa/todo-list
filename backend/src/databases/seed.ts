// seed.ts
import { Pool } from 'pg';

export const seedData = async (pool: Pool) => {
  const seed = `
    INSERT INTO todos (name) VALUES ('First Item'), ('Second Item');
  `;
  await pool.query(seed);
};
