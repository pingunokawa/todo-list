import { List } from 'antd';
import Duty from '../interfaces/duty';
import TodoItem from './todoItem';

/**
 * `TodoList` is a functional component that displays a list of todo items.
 *
 * @component
 * @param {Duty[]} todos - An array of todo items to be displayed.
 * @param {Function} onDeleteTodo - Function to call when the delete button of a todo item is clicked.
 *                                  It takes the id of the todo item as a parameter.
 * @param {Function} onEditTodo - Function to call when the edit button of a todo item is clicked.
 *                                It takes the todo item as a parameter.
 */
const TodoList: React.FC<{
    todos: Duty[];
    onDeleteTodo: (id: string) => void;
    onEditTodo: (item: Duty) => void;
}> = ({ todos, onDeleteTodo, onEditTodo }) => {
    return (
        <List
            bordered
            dataSource={todos}
            renderItem={(item) => (
                <TodoItem item={item} onDeleteTodo={onDeleteTodo} onEditTodo={onEditTodo} />
            )}
        />
    );
};

export default TodoList;
