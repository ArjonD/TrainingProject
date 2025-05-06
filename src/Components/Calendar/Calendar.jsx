import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getCustomers } from '../../Api/generalAPI';
import './Calendar.css';

const EventComponent = ({ event }) => {
    return (
        <div className="rbc-event-content" title={`${event.activity} / ${event.customer}\nDuration: ${event.duration} min`}>
            <div className="event-title">{event.activity}</div>
            <div className="event-customer">{event.customer}</div>
        </div>
    );
};

const localizer = momentLocalizer(moment);

function Calendar() {
    const [events, setEvents] = useState([]);
    const [view, setView] = useState('week');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            setLoading(true);
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
            
            const calendarEvents = flattenedTrainings.map(training => {
                const startDate = new Date(training.date);
                const endDate = new Date(startDate);
                
                endDate.setMinutes(endDate.getMinutes() + training.duration);
                
                return {
                    id: training.id,
                    title: `${training.activity} / ${training.customerName}`,
                    start: startDate,
                    end: endDate,
                    customer: training.customerName,
                    activity: training.activity,
                    duration: training.duration
                };
            });
            
            setEvents(calendarEvents);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trainings:', error);
            setLoading(false);
        }
    };

    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: '#3174ad',
                borderRadius: '5px',
                color: 'white',
                border: 'none'
            }
        };
    };

    const CustomToolbar = (toolbar) => {
        const goToToday = () => {
            toolbar.date.setTime(new Date().getTime());
            toolbar.onNavigate('current');
        };
        
        const goToPrev = () => {
            toolbar.onNavigate('PREV');
        };
        
        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };
        
        const label = () => {
            const date = moment(toolbar.date);
            return (
                <span><b>{date.format('MMMM YYYY')}</b></span>
            );
        };
        
        return (
            <div className="calendar-toolbar">
                <div className="calendar-toolbar-navigation">
                    <button onClick={goToToday}>Today</button>
                    <button onClick={goToPrev}>&lt;</button>
                    <button onClick={goToNext}>&gt;</button>
                    <span className="calendar-toolbar-label">{label()}</span>
                </div>
                <div className="calendar-toolbar-views">
                    <button 
                        onClick={() => toolbar.onView('month')}
                        className={toolbar.view === 'month' ? 'active' : ''}
                    >
                        Month
                    </button>
                    <button 
                        onClick={() => toolbar.onView('week')}
                        className={toolbar.view === 'week' ? 'active' : ''}
                    >
                        Week
                    </button>
                    <button 
                        onClick={() => toolbar.onView('day')}
                        className={toolbar.view === 'day' ? 'active' : ''}
                    >
                        Day
                    </button>
                    <button 
                        onClick={() => toolbar.onView('agenda')}
                        className={toolbar.view === 'agenda' ? 'active' : ''}
                    >
                        Agenda
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="calendar-container">
            <h2>Training Calendar</h2>
            {loading ? (
                <div className="loading">Loading calendar data...</div>
            ) : (
                <div className="calendar-wrapper">
                    <BigCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 700 }}
                        defaultView={view}
                        views={['month', 'week', 'day', 'agenda']}
                        step={60}
                        showMultiDayTimes
                        eventPropGetter={eventStyleGetter}
                        onView={setView}
                        onNavigate={date => setDate(date)}
                        components={{
                            toolbar: CustomToolbar
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Calendar;