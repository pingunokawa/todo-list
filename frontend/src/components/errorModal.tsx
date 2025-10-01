import { Modal } from 'antd';

/**
 * `ErrorModal` is a functional component that displays an error message in a modal.
 * Error communication to inform user about the error
 *
 * @component
 * @param {boolean} isVisible - Whether the modal is visible.
 * @param {Function} handleOk - Function to call when the OK button is clicked.
 * @param {Function} handleCancel - Function to call when the Cancel button is clicked.
 * @param {string} errorMessage - The error message to display.
 */
const ErrorModal: React.FC<{
    isVisible: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    errorMessage: string;
}> = ({ isVisible, handleOk, handleCancel, errorMessage }) => {
    return (
        <Modal title="Error" open={isVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>{errorMessage}</p>
        </Modal>
    );
};

export default ErrorModal;
