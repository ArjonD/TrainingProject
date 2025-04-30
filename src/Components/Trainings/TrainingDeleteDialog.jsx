import React, { useState } from 'react';
import CustomDialog from '../Shared/CustomDialog';
import { deleteTraining } from '../../Api/generalAPI';
import dayjs from 'dayjs';

function TrainingDelete({ open, onClose, training, onDelete }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!training) return;

        setLoading(true);
        setError('');

        try {
            await deleteTraining(training);
            setLoading(false);
            onDelete(); 
            onClose(); 
        } catch (error) {
            console.error('Error deleting training:', error);
            setError('Failed to delete training. Please try again.');
            setLoading(false);
        }
    };

    if (!training) return null;

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="Confirm Deletion"
        >
            {error && <div className="error-message">{error}</div>}
            <p>Are you sure you want to delete this training session?</p>
            <p>
                <strong>{training.activity}</strong> on {dayjs(training.date).format('DD.MM.YYYY HH:mm')}
                <br />
                for {training.customerName}
            </p>
            <p className="warning-text">This action cannot be undone.</p>

            <div className="form-actions">
                <button
                    onClick={handleDelete}
                    className="btn-primary"
                    style={{ backgroundColor: '#dc3545' }}
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete Training'}
                </button>
                <button
                    onClick={onClose}
                    className="btn-secondary"
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>
        </CustomDialog>
    );
}

export default TrainingDelete;