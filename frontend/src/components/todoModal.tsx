import { useEffect } from 'react';
import { Input, Modal, Form } from 'antd';
import Duty from '../interfaces/duty';

/**
 * `TodoModal` is a functional component that displays a modal for editing a todo item.
 *
 * @component
 * @param {boolean} isVisible - Whether the modal is visible.
 * @param {Function} onOk - Function to call when the save button is clicked.
 *                           It takes the input duty as a parameter.
 * @param {Function} onCancel - Function to call when the cancel button is clicked.
 * @param {Duty} todo - The todo item to be edited.
 */
const TodoModal: React.FC<{
    isVisible: boolean;
    onOk: (inputDuty: string) => void;
    onCancel: () => void;
    todo: Duty;
}> = ({ isVisible, onOk, onCancel, todo }) => {
    const [form] = Form.useForm();

    // Sets the form value to the current todo name whenever the todo changes.
    useEffect(() => {
        form.setFieldsValue({ duty: todo.name });
    }, [form, todo.name]);

    /**
     * Validates the form and calls onOk with the current input duty.
     * Resets the form fields after saving the todo in parent component
     */
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                onOk(values.duty);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal title="Edit Todo" open={isVisible} onOk={handleOk} onCancel={onCancel}>
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
                            max: 255,
                            message: 'Duty must be at most 255 characters',
                        },
                    ]}
                >
                    <Input placeholder="Enter a new Duty" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TodoModal;
