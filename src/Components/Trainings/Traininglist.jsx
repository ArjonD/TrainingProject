import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { getCustomers } from '../../Api/generalAPI';
import dayjs from 'dayjs';
import '../Shared/grid-components.css';
import TrainingForm from './TrainingForm';
import TrainingDelete from './TrainingDeleteDialog';

function Traininglist() {
    const [trainings, setTrainings] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [filteredTrainings, setFilteredTrainings] = useState([]);

    const [formOpen, setFormOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);

    const fetchTrainingsWithCustomers = async () => {
        try {
            const customers = await getCustomers();

            const allTrainings = await Promise.all(
                customers.map(async (customer) => {
                    const customerHref = customer._links?.self?.href;
                    if (!customerHref) return [];

                    const customerId = customerHref.split('/').pop();
                    if (!customerId) return [];

                    const customerTrainingsUrl = `https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers/${customerId}/trainings`;
                    try {
                        const response = await fetch(customerTrainingsUrl);
                        if (response.ok) {
                            const data = await response.json();
                            if (data._embedded?.trainings) {
                                return data._embedded.trainings.map(training => ({
                                    ...training,
                                    customerName: `${customer.firstname} ${customer.lastname}`,
                                }));
                            }
                            return [];
                        }
                        return [];
                    } catch (err) {
                        console.error(`Error fetching trainings for customer ${customerId}:`, err);
                        return [];
                    }
                })
            );

            const flattenedTrainings = allTrainings.flat();
            setTrainings(flattenedTrainings);
            setFilteredTrainings(flattenedTrainings);
        } catch (error) {
            console.error('Error fetching customers or trainings:', error);
        }
    };

    useEffect(() => {
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

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    const handleAddTraining = () => {
        setFormOpen(true);
    };

    const handleDeleteTraining = (training) => {
        setSelectedTraining(training);
        setDeleteOpen(true);
    };

    const columnDefs = [
        {
            headerName: 'Date',
            field: 'date',
            flex: 1.5,
            valueFormatter: params => params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ''
        },
        { headerName: 'Duration (min)', field: 'duration', flex: 1 },
        { headerName: 'Activity', field: 'activity', flex: 1.5 },
        { headerName: 'Customer', field: 'customerName', flex: 1.5 },
        {
            headerName: 'Actions',
            sortable: false,
            filter: false,
            flex: 1,
            cellRenderer: params => (
                <div>
                    <button onClick={() => handleDeleteTraining(params.data)}>Delete</button>
                </div>
            )
        }
    ];

    return (
        <div className="grid-container">
            <h2>Training List</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div className="filter-container">
                    <input
                        type="text"
                        placeholder="Filter by any field..."
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                </div>
                <button
                    onClick={handleAddTraining}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Add New Training
                </button>
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

            {formOpen && (
                <TrainingForm
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSave={fetchTrainingsWithCustomers}
                />
            )}
            {deleteOpen && (
                <TrainingDelete
                    open={deleteOpen}
                    onClose={() => setDeleteOpen(false)}
                    training={selectedTraining}
                    onDelete={fetchTrainingsWithCustomers}
                />
            )}
        </div>
    );
}

export default Traininglist;
