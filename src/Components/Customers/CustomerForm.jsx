import React, { useState, useEffect } from 'react';
import CustomDialog from '../Shared/CustomDialog';
import { addCustomer, updateCustomer } from '../../Api/generalAPI';

function CustomerForm({ open, onClose, customer, isEdit, onSave }) {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (customer && isEdit) {
            setFormData({
                firstname: customer.firstname || '',
                lastname: customer.lastname || '',
                email: customer.email || '',
                phone: customer.phone || '',
                streetaddress: customer.streetaddress || '',
                postcode: customer.postcode || '',
                city: customer.city || ''
            });
        } else {
            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                streetaddress: '',
                postcode: '',
                city: ''
            });
        }
        setError('');
    }, [customer, isEdit]);

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
            if (isEdit) {
                await updateCustomer(customer._links.self.href, {
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                    phone: formData.phone,
                    streetaddress: formData.streetaddress,
                    postcode: formData.postcode,
                    city: formData.city
                });
            } else {
                await addCustomer(formData);
            }
            setLoading(false);
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving customer:', error);
            setError('Failed to save customer. Please try again.');
            setLoading(false);
        }
    };

    return (
        <CustomDialog
            open={open}
            onClose={onClose}
            title={isEdit ? 'Edit Customer' : 'Add New Customer'}
        >
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        name="streetaddress"
                        value={formData.streetaddress}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Postal Code:</label>
                    <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Customer'}
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

export default CustomerForm;