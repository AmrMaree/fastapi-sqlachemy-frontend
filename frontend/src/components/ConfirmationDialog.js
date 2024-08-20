import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirmation-dialog">
            <div className="confirmation-dialog-content">
                <p className='confirmation-dialog-message'>{message}</p>
                <div className="confirmation-dialog-buttons">
                    <button className='confirm' onClick={onConfirm}>OK</button>
                    <button className='cancel' onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
