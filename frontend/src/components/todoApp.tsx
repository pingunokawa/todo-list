import { useEffect, useState } from 'react';
import { Layout, Typography } from "antd";
import TodoModal from "./todoModal";
import Duty from '../interfaces/duty';
import TodoList from './todoList';
import TodoInput from './todoInput';
// es conflicts with jest, use antd/lib instead of antd/es
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import axios from 'axios';
import ErrorModal from './errorModal';

const baseURL = process.env.REACT_APP_NODE_BACKEND_URI;

/**
 * `TodoApp` is the parent functional component that holds all the child components.
 * It manages the state and functions for adding, deleting, and updating todos.
 */
function TodoApp() {

    // State variable for todos
    const [todos, setTodos] = useState<Duty[]>([]);

    // State variable for controlling the visibility of the todo modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // State variable for currentTodo
    const [currentTodo, setCurrentTodo] = useState<Duty | null>(null);

    // State variable for controlling the visibility of the error modal
    const [isErrorVisible, setIsErrorVisible] = useState(false);

    // State variable for storing the error message to display in the modal
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Shows the error modal with a given message.
     *
     * @param {string} message - The error message to display.
     */
    const showError = (error: unknown) => {
        let message: string;
        if (error instanceof Error) {
            // It's an Error object, use its message property
            message = error.message;
        } else if (typeof error === 'string') {
            // It's a string, use it directly
            message = error;
        } else if (error === null) {
            // It's null, use a default message
            message = 'An error occurred';
        } else {
            // It's some other type (number, boolean, object, undefined, function), convert it to a string
            message = String(error);
        }
        setErrorMessage(message);
        setIsErrorVisible(true);
    };


    /**
     * Handles the OK button click in the error modal.
     * Hides the error modal.
     */
    const handleErrorOk = () => {
        setIsErrorVisible(false);
    };

    /**
     * Handles the Cancel button click in the error modal.
     * Hides the error modal.
     */
    const handleErrorCancel = () => {
        setIsErrorVisible(false);
    };

    /**
     * Fetches the list of todos from the backend and updates the todos state.
     */
    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/todos`);
            if (response.status != 200) {
                throw new Error('Network response was not ok');
            }
            setTodos(response.data);
        } catch (error) {
            showError('Error fetching todos: ' + (error as Error).message);
        }
    };

    // Fetches the todos when the component mounts.
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Adds a new todo by making a POST request to the backend.
     * Then fetches the updated list of todos.
     *
     * @param {string} inputDuty - The name of the new todo.
     */
    const handleAddTodo = async (inputDuty: string) => {
        try {
            // Make a POST request to add the new todo
            const response = await axios.post(`${baseURL}/api/todos`, { name: inputDuty });
            // Check if the request was successful
            if (response.status != 201) {
                throw new Error('Failed to add todo');
            }
            // reuse fetchData to list latest todo
            // it is not a good idea to add the response to existing list, as there will be concurrent user adding data to database
            fetchData();
        } catch (error) {
            showError('Error adding todos: ' + (error as Error).message);
        }
    };

    /**
     * Deletes a todo by making a DELETE request to the backend.
     * Then updates the todos state to remove the deleted todo.
     *
     * @param {string} id - The id of the todo to delete.
     */
    const handleDeleteTodo = async (id: string) => {
        try {
            await axios.delete(`${baseURL}/api/todos/${id}`);
            // reuse fetchData to list latest todo
            // it is not a good idea to update the state locally because there will be concurrent user adding data to database
            fetchData();
        } catch (error) {
            showError('Error deleting todo: ' + (error as Error).message);
        }
    };

    /**
     * Updates a todo by making a PUT request to the backend.
     * Then fetches the updated list of todos.
     *
     * @param {string} id - The id of the todo to update.
     * @param {string} updatedTodo - The new name of the todo.
     */
    const handleUpdateTodo = async (id: string, updatedTodo: string) => {
        try {
            await axios.put(`${baseURL}/api/todos/${id}`, { name: updatedTodo });
            // reuse fetchData to list latest todo
            // it is not a good idea to add the response to existing list, as there will be concurrent user adding data to database
            fetchData();
        } catch (error) {
            showError('Error updating todo: ' + (error as Error).message);
        }
    };

    /**
     * Shows the modal for editing a todo.
     *
     * @param {Duty} todo - The todo to edit.
     */
    const showModal = (todo: Duty) => {
        setCurrentTodo(todo);
        setIsModalVisible(true);
    };

    /**
     * Handles the save button click in the modal.
     * Calls handleUpdateTodo with the current todo id and the new name.
     * Then hides the modal.
     *
     * @param {string} inputDuty - The new name of the todo.
     */
    const handleOk = (inputDuty: string) => {
        if (currentTodo) {
            handleUpdateTodo(currentTodo.id, inputDuty);
        }
        setIsModalVisible(false);
    };

    /**
     * Hides the modal.
     */
    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <Layout>
            <Header></Header>
            <Content style={{ padding: '0 50px' }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 280, margin: '16px 0' }}>
                    <Typography.Title level={1}>My ToDo List</Typography.Title>
                    <TodoInput onAddTodo={handleAddTodo} />
                    <TodoList todos={todos} onDeleteTodo={handleDeleteTodo} onEditTodo={showModal} />
                    {currentTodo && <TodoModal isVisible={isModalVisible} onOk={handleOk} onCancel={handleCancel} todo={currentTodo} />}
                </div>
                <ErrorModal isVisible={isErrorVisible} handleOk={handleErrorOk} handleCancel={handleErrorCancel} errorMessage={errorMessage} />
            </Content>
            <Footer>Technical Test</Footer>
        </Layout>
    );
}

export default TodoApp;
