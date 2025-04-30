import React, { useState } from 'react';
import CustomDialog from '../Shared/CustomDialog';
import { deleteCustomer } from '../../Api/generalAPI';

function CustomerDelete({ open, onClose, customer, onDelete }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!customer) return;

        setLoading(true);
        setError('');

        try {
            await deleteCustomer(customer);
            setLoading(false);
            onDelete();
            onClose();
        } catch (error) {
            console.error('Error deleting customer:', error);
            setError('Failed to delete customer. Please try again.');
            setLoading(false);
        }
    };

    if (!customer) return null;

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="Confirm Deletion"
        >
            {error && <div className="error-message">{error}</div>}
            <p>Are you sure you want to delete this customer?</p>
            <p>
                <strong>{customer.firstname} {customer.lastname}</strong>
            </p>
            <p className="warning-text">This action cannot be undone.</p>

            <div className="form-actions">
                <button
                    onClick={handleDelete}
                    className="btn-primary"
                    style={{ backgroundColor: '#dc3545' }}
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete Customer'}
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

export default CustomerDelete;