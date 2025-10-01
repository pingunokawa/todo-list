import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import TodoApp from './todoApp';

// Replace the original axios with the mock axios
jest.mock('axios', () => mockAxios);

// Clear all instances and calls to constructor and all methods:
afterEach(() => {
    mockAxios.reset();
});

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

// test suite for listing
test('fetches todos and renders them on mount', async () => {
    const todos = [
        { id: '1', name: 'Todo 1' },
        { id: '2', name: 'Todo 2' },
    ];

    // Mock the response for a GET request
    mockAxios.get.mockResolvedValueOnce({
        data: todos,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });
    const { getByText } = render(<TodoApp />);

    // Wait for the todos to be rendered
    await waitFor(() => expect(getByText('Todo 1')).toBeInTheDocument());
    expect(getByText('Todo 2')).toBeInTheDocument();
});

// test suite for add and delete a duty
test('can add and delete a todo', async () => {
    // since the app will list on render we need to mock the list
    // Mock the response for a GET request
    mockAxios.get.mockResolvedValueOnce({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });

    // Mock the POST request for adding a todo
    mockAxios.post.mockResolvedValueOnce({
        data: { id: '1', name: 'Test task' },
        status: 201,
        statusText: 'OK',
        headers: {},
        config: {},
    });

    // Mock the DELETE request for deleting a todo
    mockAxios.delete.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });
    render(<TodoApp />);

    // Find the input field and button
    const input = screen.getByPlaceholderText('Enter a Duty');
    const addButton = screen.getByText('ADD');

    // Type into the input field
    fireEvent.change(input, { target: { value: 'Test task' } });

    // Click the add button
    fireEvent.click(addButton);

    // prepare the data for mocking the added duty
    const todos = [
        { id: '1', name: 'Test task' },
    ];
    mockAxios.get.mockResolvedValueOnce({
        data: todos,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });

    // Wait for the todo to be added and rendered
    await waitFor(() => expect(screen.getByText('Test task')).toBeInTheDocument());

    // Find the delete button for the task and click it
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // mock the listing with empty todo-list
    mockAxios.get.mockResolvedValueOnce({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });

    // Wait for the todo to be deleted and removed from the document
    await waitFor(() => expect(screen.queryByText('Test task')).toBeNull());
});

// test suite for edit a todo
test('can edit a todo', async () => {
    // Mock the initial GET request for fetching the list of todos
    mockAxios.get.mockResolvedValueOnce({
        data: [{ id: '1', name: 'Test task' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });

    render(<TodoApp />);

    // Wait for the todo to be rendered
    await waitFor(() => expect(screen.getByText('Test task')).toBeInTheDocument());

    // Find the edit button for the task and click it
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Find the input field in the modal and type the new task name
    const input = screen.getByPlaceholderText('Enter a new Duty');
    fireEvent.change(input, { target: { value: 'Updated task' } });

    // Mock the PUT request for updating the todo
    mockAxios.put.mockResolvedValueOnce({
        data: { id: '1', name: 'Updated task' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });

    // Find the OK button in the modal and click it
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);

    // Mock the GET request for fetching the list of todos after the todo is updated
    mockAxios.get.mockResolvedValueOnce({
        data: [{ id: '1', name: 'Updated task' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });

    // Wait for the updated todo to be rendered
    await waitFor(() => expect(screen.getByText('Updated task')).toBeInTheDocument());
});
