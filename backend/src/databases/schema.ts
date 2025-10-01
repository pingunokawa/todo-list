// schema.ts
import { Pool } from 'pg';

export const createSchema = async (pool: Pool) => {
  const createTable = `
    CREATE TABLE IF NOT EXISTS todos (
      id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTable);

  // Create an index on the 'created_at' column
  const createIndex = `
    CREATE INDEX IF NOT EXISTS todos_created_at_index ON todos (created_at);
  `;
  await pool.query(createIndex);
  
};
