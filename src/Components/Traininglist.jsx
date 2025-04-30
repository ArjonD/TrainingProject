import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { getCustomers } from '../Api/generalAPI';
import dayjs from 'dayjs';
import './grid-components.css';

function Traininglist() {
    const [trainings, setTrainings] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [filteredTrainings, setFilteredTrainings] = useState([]);

    useEffect(() => {
        const fetchTrainingsWithCustomers = async () => {
            try {
                const customers = await getCustomers();
                console.log('Fetched customers:', customers);

                const allTrainings = await Promise.all(
                    customers.map(async (customer) => {
                        const customerHref = customer._links?.self?.href;
                        if (!customerHref) {
                            console.error('Customer href is undefined:', customer);
                            return [];
                        }

                        const customerId = customerHref.split('/').pop();
                        if (!customerId) {
                            console.error('Customer ID is undefined:', customer);
                            return [];
                        }

                        const customerTrainingsUrl = `https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers/${customerId}/trainings`;
                        try {
                            const response = await fetch(customerTrainingsUrl);
                            if (response.ok) {
                                const data = await response.json();
                                console.log(`Fetched training data for customer ${customerId}:`, data);
                                if (data._embedded?.trainings) {
                                    return data._embedded.trainings.map(training => ({
                                        date: training.date,
                                        duration: training.duration,
                                        activity: training.activity,
                                        customerName: `${customer.firstname} ${customer.lastname}`,
                                    }));
                                } else {
                                    console.error('Training data is not in the expected format:', data);
                                    return [];
                                }
                            } else {
                                console.error(`Failed to fetch trainings for customer ${customerId}:`, response.status);
                                return [];
                            }
                        } catch (err) {
                            console.error(`Error fetching trainings for customer ${customerId}:`, err);
                            return [];
                        }
                    })
                );

                const flattenedTrainings = allTrainings.flat();
                console.log('All trainings:', flattenedTrainings);
                setTrainings(flattenedTrainings);
                setFilteredTrainings(flattenedTrainings);
            } catch (error) {
                console.error('Error fetching customers or trainings:', error);
            }
        };

        fetchTrainingsWithCustomers();
    }, []);

    useEffect(() => {
        if (!filterText) {
            setFilteredTrainings(trainings);
            return;
        }

        const lowerCaseFilter = filterText.toLowerCase();
        const filtered = trainings.filter(training => {
            return (
                training.activity.toLowerCase().includes(lowerCaseFilter) ||
                training.customerName.toLowerCase().includes(lowerCaseFilter) ||
                (training.date && dayjs(training.date).format('DD.MM.YYYY HH:mm').includes(lowerCaseFilter)) ||
                (training.duration && training.duration.toString().includes(lowerCaseFilter))
            );
        });

        setFilteredTrainings(filtered);
    }, [filterText, trainings]);

    const columnDefs = [
        { headerName: 'Date', field: 'date', flex: 1.5, valueFormatter: params => params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : '' },
        { headerName: 'Duration (min)', field: 'duration', flex: 1 },
        { headerName: 'Activity', field: 'activity', flex: 1.5 },
        { headerName: 'Customer', field: 'customerName', flex: 1.5 },
    ];

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    return (
        <div className="grid-container">
            <h2>Training List</h2>

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
                    rowData={filteredTrainings}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: true, sortable: true, filter: true }}
                    pagination={true}
                    paginationPageSize={10}
                    animateRows={true}
                    modules={[ClientSideRowModelModule]}
                />
            </div>
        </div>
    );
}

export default Traininglist;
