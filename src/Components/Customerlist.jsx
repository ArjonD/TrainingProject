import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { getCustomers } from '../Api/generalAPI';
import './grid-components.css';

function Customerlist() {
    const [customers, setCustomers] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await getCustomers();
                setCustomers(data);
                setFilteredCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
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
    }, [filterText, customers]);

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    const columnDefs = [
        { headerName: 'First Name', field: 'firstname', flex: 1 },
        { headerName: 'Last Name', field: 'lastname', flex: 1 },
        { headerName: 'Email', field: 'email', flex: 1.5 },
        { headerName: 'Phone', field: 'phone', flex: 1 },
        { headerName: 'Address', field: 'streetaddress', flex: 1.5 },
        { headerName: 'City', field: 'city', flex: 1 },
        { headerName: 'Postal Code', field: 'postcode', flex: 1 },
    ];

    return (
        <div className="grid-container">
            <h2>Customer List</h2>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Filter by any field..."
                    value={filterText}
                    onChange={handleFilterChange}
                />
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
        </div>
    );
}

export default Customerlist;