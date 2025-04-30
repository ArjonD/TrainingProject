export async function getCustomers() {
    const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    try {
        const data = await response.json();
        return data._embedded.customers;
    } catch (err) {
        console.error('Error parsing JSON:', err);
        throw err;
    }
}

export async function getTrainings() {
    const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    try {
        const data = await response.json();
        if (Array.isArray(data._embedded.trainings)) {
            if (data._embedded.trainings.length === 1 && Array.isArray(data._embedded.trainings[0].trainings)) {
                return data._embedded.trainings[0].trainings;
            }
            return data._embedded.trainings;
        }
        return [];
    } catch (err) {
        console.error('Error parsing JSON:', err);
        throw err;
    }
}

