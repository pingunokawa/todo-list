// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerDocs from './swagger';
import { pool } from './databases/databasePool';
import { initDatabase } from './databases/initDatabase';
import cors from "cors";
import { validate as isUuid } from 'uuid';

// Call the initDatabase function to initialize database schema and seed
initDatabase(pool).then(() => {
  console.log('Database setup completed.');
})

const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON requests
app.use(express.json());

// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  next();
}, cors({ maxAge: 84600 }));

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todo Duties
 *     description: Retrieve a list of todo Duties from the database.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The id of the Duty.
 *                   name:
 *                     type: string
 *                     description: The name of the Duty.
 */

app.get('/api/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching todos' });
  }
});

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Add a new todo Duty
 *     description: Add a new todo Duty to the database.
 *     requestBody:
 *       description: New todo Duty data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the Duty.
 *     responses:
 *       201:
 *         description: Successfully added the new Duty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The id of the Duty.
 *                 name:
 *                   type: string
 *                   description: The name of the Duty.
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Internal server error
 */
app.post('/api/todos', async (req: Request, res: Response) => {
  try {
    const newDutyName: string = req.body.name;

    // Validate newDutyName
    if (!newDutyName || newDutyName.trim() === '') {
      return res.status(400).json({ error: 'Duty name is required and should not be empty' });
    }

    // Insert the newDuty into the database
    const query = 'INSERT INTO todos (name) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [newDutyName]);

    // Return the created todo
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo Duty by ID
 *     description: Update a todo Duty in the database based on its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo Duty to be updated
 *         schema:
 *           type: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Duty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Duty updated successfully
 *       500:
 *         description: Internal server error
 */
app.put('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const DutyId = req.params.id;
    const { name } = req.body;
    // Validate that DutyId is a valid uuid
    if (!isUuid(DutyId)) {
      return res.status(400).json({ error: 'Invalid Duty ID' });
    }
    // Validate newDuty properties (e.g., name)
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Duty name is required and should not be empty' });
    }
    // Perform the update operation
    const updateQuery = 'UPDATE todos SET name = $1 WHERE id = $2';
    const result = await pool.query(updateQuery, [name, DutyId]);
    // Check if any rows were affected (i.e., if an Duty was actually updated)
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Duty updated failed' });
    }
    res.json({ message: 'Duty updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo Duty by ID
 *     description: Delete a todo Duty from the database based on its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo Duty to be deleted
 *         schema:
 *           type: uuid
 *     responses:
 *       200:
 *         description: Duty deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Duty deleted successfully
 *       500:
 *         description: Internal server error
 */
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const DutyId = req.params.id; // Parse the Duty ID from the URL
    // Validate that DutyId is a valid uuid
    if (!isUuid(DutyId)) {
      return res.status(400).json({ error: 'Invalid Duty ID' });
    }
    // Perform the deletion operation
    const deleteQuery = 'DELETE FROM todos WHERE id = $1';
    const result = await pool.query(deleteQuery, [DutyId]);
    // Check if any rows were affected (i.e., if an Duty was actually deleted)
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Duty not found' });
    }
    res.json({ message: 'Duty deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// swagger API docs
app.use('/api-docs', swaggerUiExpress.serve, swaggerDocs);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// End the pool when the application shutting down
process.on('exit', () => {
  pool.end();
});

export { app, server };