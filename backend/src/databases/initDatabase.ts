import { createSchema } from './schema';
import { seedData } from './seed';
import { Pool } from 'pg';

export const initDatabase = async (pool: Pool) => {
    while (true) {
        try {
            // Try to connect to the database
            await pool.query('SELECT 1');

            // If the connection is successful, enable the pgcrypto extension
            await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

            // Check if the 'todos' table already exists
            const tableExists = await pool.query(
                "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'todos');"
            );
            if (!tableExists.rows[0].exists) {
                // If the table doesn't exist, create it and seed data
                await createSchema(pool);
                await seedData(pool);
            } else {
                console.log('Database is already initialized.');
            }

            // If everything is successful, break the loop
            break;
        } catch (err) {
            console.error('Error setting up database:', err);
            console.log('Retrying in 5 seconds...');
            // Wait for 5 seconds before trying again
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};
