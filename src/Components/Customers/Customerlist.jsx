import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { getCustomers } from '../../Api/generalAPI';
import '../Shared/grid-components.css';
import CustomerForm from './CustomerForm';
import CustomerDelete from './CustomerDeleteDialog';

function Customerlist() {
    const [customers, setCustomers] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
            setFilteredCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        filterCustomers();
    }, [filterText, customers]);

    const filterCustomers = () => {
        if (!filterText) {
            setFilteredCustomers(customers);
            return;
        }

        const lowerCaseFilter = filterText.toLowerCase();
        const filtered = customers.filter(customer => {
            return (
                customer.firstname.toLowerCase().includes(lowerCaseFilter) ||
                customer.lastname.toLowerCase().includes(lowerCaseFilter) ||
                (customer.email && customer.email.toLowerCase().includes(lowerCaseFilter)) ||
                (customer.phone && customer.phone.includes(lowerCaseFilter)) ||
                (customer.streetaddress && customer.streetaddress.toLowerCase().includes(lowerCaseFilter)) ||
                (customer.city && customer.city.toLowerCase().includes(lowerCaseFilter)) ||
                (customer.postcode && customer.postcode.includes(lowerCaseFilter))
            );
        });

        setFilteredCustomers(filtered);
    };

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    const handleAddCustomer = () => {
        setSelectedCustomer(null);
        setIsEditing(false);
        setFormOpen(true);
    };

    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setIsEditing(true);
        setFormOpen(true);
    };

    const handleDeleteCustomer = (customer) => {
        setSelectedCustomer(customer);
        setDeleteOpen(true);
    };

    const exportToCsv = () => {
        const csvData = customers.map(customer => {
            const { firstname, lastname, email, phone, streetaddress, city, postcode } = customer;
            return { firstname, lastname, email, phone, streetaddress, city, postcode };
        });

        const headers = [
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Street Address',
            'City',
            'Postal Code'
        ];

        const csvHeader = headers.join(',') + '\r\n';

        const csvRows = csvData.map(customer => {
            const values = [
                customer.firstname || '',
                customer.lastname || '',
                customer.email || '',
                customer.phone || '',
                customer.streetaddress || '',
                customer.city || '',
                customer.postcode || ''
            ];

            return values.map(value =>
                `"${value.toString().replace(/"/g, '""')}"`
            ).join(',');
        }).join('\r\n');

        const csvString = csvHeader + csvRows;

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'customers.csv');
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const columnDefs = [
        { headerName: 'First Name', field: 'firstname', flex: 1 },
        { headerName: 'Last Name', field: 'lastname', flex: 1 },
        { headerName: 'Email', field: 'email', flex: 1.5 },
        { headerName: 'Phone', field: 'phone', flex: 1 },
        { headerName: 'Address', field: 'streetaddress', flex: 1.5 },
        { headerName: 'City', field: 'city', flex: 1 },
        { headerName: 'Postal Code', field: 'postcode', flex: 1 },
        {
            headerName: 'Actions',
            sortable: false,
            filter: false,
            flex: 1.2,
            cellRenderer: params => (
                <div>
                    <button
                        style={{ marginRight: '5px' }}
                        onClick={() => handleEditCustomer(params.data)}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteCustomer(params.data)}
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="grid-container">
            <h2>Customer List</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div className="filter-container">
                    <input
                        type="text"
                        placeholder="Filter by any field..."
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                </div>
                <div>
                    <button
                        onClick={exportToCsv}
                        style={{
                            marginRight: '10px',
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Export to CSV
                    </button>
                    <button
                        onClick={handleAddCustomer}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Add New Customer
                    </button>
                </div>
            </div>

            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
                <AgGridReact
                    rowData={filteredCustomers}
                    columnDefs={columnDefs}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: true,
                    }}
                    pagination={true}
                    paginationPageSize={10}
                    animateRows={true}
                    modules={[ClientSideRowModelModule]}
                />
            </div>

            <CustomerForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                customer={selectedCustomer}
                isEdit={isEditing}
                onSave={fetchCustomers}
            />

            <CustomerDelete
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                customer={selectedCustomer}
                onDelete={fetchCustomers}
            />
        </div>
    );
}

export default Customerlist;