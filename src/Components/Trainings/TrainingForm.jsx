import React, { useState, useEffect } from 'react';
import CustomDialog from '../Shared/CustomDialog';
import { addTraining, getCustomers } from '../../Api/generalAPI';
import dayjs from 'dayjs';

function TrainingForm({ open, onClose, onSave }) {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        date: dayjs().format('YYYY-MM-DDTHH:mm'),
        duration: '',
        activity: '',
        customer: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setError('Failed to load customer list');
            }
        };

        if (open) {
            fetchCustomers();
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setFormData({
                date: dayjs().format('YYYY-MM-DDTHH:mm'),
                duration: '',
                activity: '',
                customer: ''
            });
            setError('');
        }
    }, [open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const newTraining = {
                date: new Date(formData.date).toISOString(),
                duration: parseInt(formData.duration),
                activity: formData.activity,
                customer: formData.customer
            };

            await addTraining(newTraining);
            setLoading(false);
            onSave(); 
            onClose();
        } catch (error) {
            console.error('Error saving training:', error);
            setError('Failed to save training. Please try again.');
            setLoading(false);
        }
    };

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title="Add New Training"
        >
            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Date and Time:</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Duration (minutes):</label>
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Activity:</label>
                    <input
                        type="text"
                        name="activity"
                        value={formData.activity}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Customer:</label>
                    <select
                        name="customer"
                        value={formData.customer}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a customer</option>
                        {customers.map(customer => (
                            <option key={customer._links.self.href} value={customer._links.self.href}>
                                {customer.firstname} {customer.lastname}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Add Training'}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </CustomDialog>
    );
}

export default TrainingForm;