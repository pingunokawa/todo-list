import request from 'supertest'; // Install supertest for making HTTP requests
import { app, server}  from './server'; 
import { Pool } from 'pg';

afterAll(done => {
  server.close(done);
});

jest.mock('pg', () => {
  // Create a mock pool object
  const pool = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
  };

  return {
    Pool: jest.fn(() => pool),
  };
});

// mock and bypass init database
jest.mock('./databases/initDatabase', () => ({
    initDatabase: jest.fn().mockResolvedValue(undefined),
}));

// This test verifies that the GET /api/todos endpoint
describe('GET /api/todos', () => {
  // This test verify that the correct list of todo Duties should be return
  it('should return a list of todo Duties', async () => {
    // We're mocking the database query result to return a specific set of todo Duties.
    const mockQueryResult = {
      rows: [
        { id: "3019c036-ab9f-40d1-979d-219e9a54fd36", name: 'Buy groceries' },
        { id: "bc2d95d7-6084-4dac-ad04-6ccb754354e9", name: 'Do laundry' },
      ],
    };
    (new Pool().query as jest.Mock<any>).mockResolvedValue(mockQueryResult);
    // We're making a GET request to the /api/todos endpoint.
    const response = await request(app).get('/api/todos');
    // We expect the response status to be 200 (OK).
    expect(response.status).toBe(200);
    // We expect the response body to be an array that matches our mock data.
    expect(response.body).toEqual(mockQueryResult.rows);
  });
  it('should return 500 Internal Server Error if there is a database error', async () => {
    // Mock the pool.query function to throw an error.
    (new Pool().query as jest.Mock<any>).mockRejectedValue(new Error('Database error'));
    // Make a GET request to the /api/todos endpoint.
    const response = await request(app).get('/api/todos');
    // We expect the response status to be 500 (Error fetching todos).
    expect(response.status).toBe(500);
    // We expect the response body to be an object with an 'error' property.
    expect(response.body).toEqual({ error: 'Error fetching todos' });
  });  
});

// This test verifies that the POST /api/todos enpoint
describe('POST /api/todos', () => {
  // This test verifies that a new todo Duty can be added
  it('should add a new todo Duty', async () => {
    // Define a new Duty that we want to add
    const newDuty = { name: 'Buy groceries' }; 
    // We're mocking the database query result to simulate adding a new Duty
    const mockQueryResult = {
      rows: [{ id: "8f8c9668-33e9-4a8a-8eb6-43978ae75c8c", name: newDuty.name }],
    };
    // Mock the pool.query function to return our mockQueryResult when called
    (new Pool().query as jest.Mock<any>).mockResolvedValue(mockQueryResult);
    // Make a POST request to the /api/todos endpoint with our new Duty
    const response = await request(app)
      .post('/api/todos')
      .send(newDuty);
    // We expect the response status to be 201 (Created)
    expect(response.status).toBe(201);
    // We expect the name of the returned Duty to be the same as the name of our new Duty
    expect(response.body.name).toBe(newDuty.name);
    // We expect the id of the returned Duty to be defined
    expect(response.body.id).toBeDefined();
  });

  it('should return 400 Duty name is required and should not be empty', async () => {
    // Define a new Duty that we want to add
    const newDuty = { name: '' }; 
    // Make a POST request to the /api/todos endpoint with our new Duty
    const response = await request(app)
      .post('/api/todos')
      .send(newDuty);
    // We expect the response status to be 400
    expect(response.status).toBe(400);
    // We expect an error of Duty name is required and should not be empty
    expect(response.body).toEqual({ error: 'Duty name is required and should not be empty' });
  });

  it('should return 500 Internal Server Error if there is a database error', async () => {
    // Define a new Duty that we want to add
    const newDuty = { name: 'Buy groceries' }; 
    // Mock the pool.query function to throw an error.
    (new Pool().query as jest.Mock<any>).mockRejectedValue(new Error('Database error'));
    // Make a POST request to the /api/todos endpoint with our new Duty
    const response = await request(app)
      .post('/api/todos')
      .send(newDuty);
    // We expect the response status to be 500 (Internal Server Error).
    expect(response.status).toBe(500);
    // We expect the response body to be an object with an 'error' property.
    expect(response.body).toEqual({ error: 'Internal server error' });
  });  
});

describe('PUT /api/todos/:id', () => {
  // Test case for successful update of a todo Duty
  it('should update an existing todo Duty', async () => {
    const DutyIdToUpdate = "7051465b-2d15-47ba-b39d-f5b35e049f5e";
    const newName = 'New Duty Name';
    (new Pool().query as jest.Mock<any>).mockResolvedValue({ rowCount: 1 });
    const response = await request(app)
      .put(`/api/todos/${DutyIdToUpdate}`)
      .send({ name: newName });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Duty updated successfully');
  });

  // Test case for when the Duty to be updated does not exist
  it('should return 404 if Duty does not exist', async () => {
    const nonExistDutyId = "e68b2e08-2ef4-4eab-b20b-f995ed1ebc53";
    const newName = 'New Duty Name';
    (new Pool().query as jest.Mock<any>).mockResolvedValue({ rowCount: 0 });
    const response = await request(app)
      .put(`/api/todos/${nonExistDutyId}`)
      .send({ name: newName });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Duty updated failed');
  });

  // Test case for when the Duty ID provided is invalid
  it('should return 400 Invalid Duty ID', async () => {
    const invalidDutyId = 'test';
    const newName = 'New Duty Name';
    const response = await request(app)
      .put(`/api/todos/${invalidDutyId}`)
      .send({ name: newName });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid Duty ID');
  });

  // Test case for when the new name provided is empty
  it('should return 400 if name is empty', async () => {
    const DutyIdToUpdate = "31908a0d-eaeb-4e8b-a26c-6a7f736ba615";
    const emptyName = '';
    const response = await request(app)
      .put(`/api/todos/${DutyIdToUpdate}`)
      .send({ name: emptyName });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Duty name is required and should not be empty');
  });

  // Test case for when there is a database error during the update operation
  it('should return 500 Internal Server Error if there is a database error', async () => {
    const DutyIdToUpdate = "e5ad14bd-9b46-45ef-9dd6-15b8dcc7cce8";
    const newName = 'New Duty Name';
    (new Pool().query as jest.Mock<any>).mockRejectedValue(new Error('Database error'));
    const response = await request(app)
      .put(`/api/todos/${DutyIdToUpdate}`)
      .send({ name: newName });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});

// This test verify the DELETE /api/todos/:id endpoint
describe('DELETE /api/todos/:id', () => {
  // This test verifies that an existing todo Duty can be deleted
  it('should delete an existing todo Duty', async () => {
    // Assume an existing todo Duty with ID "e68b2e08-2ef4-4eab-b20b-f995ed1ebc53";
    const DutyIdToDelete = "e68b2e08-2ef4-4eab-b20b-f995ed1ebc53";
    // We're mocking the database query result to simulate that the Duty was found and deleted
    // The rowCount property indicates the number of rows affected by a SQL statement
    // A rowCount of 1 indicates that one row was affected, i.e., one Duty was deleted
    (new Pool().query as jest.Mock<any>).mockResolvedValue({ rowCount: 1 });
    // We're making a DELETE request to the /api/todos/:id endpoint to delete the Duty
    const response = await request(app)
      .delete(`/api/todos/${DutyIdToDelete}`);
    // We expect the response status to be 200 (OK)
    expect(response.status).toBe(200);
    // We expect the response body to contain a success message
    expect(response.body.message).toBe('Duty deleted successfully');
  });

  // This test verifies that attempting to delete a non-existing Duty returns a 404 error
  it('should return 404 if Duty does not exist', async () => {
    // Assume an invalid Duty ID (not in the database)
    const nonExistDutyId = "e68b2e08-2ef4-4eab-b20b-f995ed1ebc53";
    // We're mocking the database query result to simulate that the Duty was not found
    // A rowCount of 0 indicates that no rows were affected, i.e., no Duty was found to delete
    (new Pool().query as jest.Mock<any>).mockResolvedValue({ rowCount: 0 });
    // We're making a DELETE request to the /api/todos/:id endpoint to delete the Duty
    const response = await request(app)
      .delete(`/api/todos/${nonExistDutyId}`);
    // We expect the response status to be 404 (Not Found)
    expect(response.status).toBe(404);
    // We expect the response body to contain an error message
    expect(response.body.error).toBe('Duty not found');
  });

  // This test verifies that attempting to delete a non-existing Duty returns a 404 error
  it('should return 400 Invalid Duty ID', async () => {
    // Assume an invalid Duty ID (not in the database)
    const invalidDutyId = 'test';
    // We're making a DELETE request to the /api/todos/:id endpoint to delete the Duty
    const response = await request(app)
      .delete(`/api/todos/${invalidDutyId}`);
    // We expect the response status to be 400 (Invalid Duty ID)
    expect(response.status).toBe(400);
    // We expect the response body to contain an error message
    expect(response.body.error).toBe('Invalid Duty ID');
  });  

  it('should return 500 Internal Server Error if there is a database error', async () => {
    // Assume an invalid Duty ID (not in the database)
    const dutyId = "e68b2e08-2ef4-4eab-b20b-f995ed1ebc53";
    // Mock the pool.query function to throw an error.
    (new Pool().query as jest.Mock<any>).mockRejectedValue(new Error('Database error'));
    // We're making a DELETE request to the /api/todos/:id endpoint to delete the Duty
    const response = await request(app)
      .delete(`/api/todos/${dutyId}`);
    // We expect the response status to be 500 (Internal Server Error).
    expect(response.status).toBe(500);
    // We expect the response body to be an object with an 'error' property.
    expect(response.body).toEqual({ error: 'Internal server error' });
  });    
});