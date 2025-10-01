import { Button, Col, List, Row } from 'antd';
import Duty from '../interfaces/duty';

/**
 * `TodoItem` is a functional component that displays a single todo item.
 *
 * @component
 * @param {Duty} item - The todo item to be displayed.
 * @param {Function} onDeleteTodo - Function to call when the delete button is clicked.
 *                                  It takes the id of the todo item as a parameter.
 * @param {Function} onEditTodo - Function to call when the edit button is clicked.
 *                                It takes the todo item as a parameter.
 */
const TodoItem: React.FC<{
    item: Duty;
    onDeleteTodo: (id: string) => void;
    onEditTodo: (item: Duty) => void;
}> = ({ item, onDeleteTodo, onEditTodo }) => {
    return (
        <List.Item>
            <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                <Col>{item.name}</Col>
                <Col>
                    <Button type="default" size="small" onClick={() => onEditTodo(item)}>
                        Edit
                    </Button>
                    <Button type="default" size="small" onClick={() => onDeleteTodo(item.id)} style={{ marginLeft: '10px' }}>
                        Delete
                    </Button>
                </Col>
            </Row>
        </List.Item>
    );
};

export default TodoItem;
