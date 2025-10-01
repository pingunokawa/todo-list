import { useState } from 'react';
import { Input, Button, Row, Col, Form } from 'antd';

/**
 * `TodoInput` is a functional component that allows users to input and add a new todo item.
 *
 * @component
 * @param {Function} onAddTodo - Function to call when the add button is clicked.
 *                               It takes the input duty as a parameter.
 */
const TodoInput: React.FC<{
    onAddTodo: (inputDuty: string) => void;
}> = ({ onAddTodo }) => {
    const [form] = Form.useForm();
    const [inputDuty, setInputDuty] = useState('');

    /**
     * Updates the inputDuty state with the current input value.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputDuty(event.target.value);
    };

    /**
     * Validates the form and calls onAddTodo with the current input duty.
     * Resets the input duty and form fields after adding the todo.
     */
    const handleAddTodo = () => {
        form.validateFields()
            .then(() => {
                onAddTodo(inputDuty);
                setInputDuty('');
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Row>
            <Col flex="auto">
                <Form form={form}>
                    <Form.Item
                        name="duty"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your duty!',
                            },
                            {
                                min: 1,
                                message: 'Duty must be at least 1 character',
                            },
                            {
                                max: 100,
                                message: 'Duty must be at most 255 characters',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter a Duty"
                            value={inputDuty}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                </Form>
            </Col>
            <Col flex="none">
                <Button type="primary" onClick={handleAddTodo}>ADD</Button>
            </Col>
        </Row>
    );
};

export default TodoInput;
