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

// Customer CRUD operations
export async function deleteCustomer(customer) {
    const response = await fetch(customer._links.self.href, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
}

export async function addCustomer(customer) {
    console.log("function addCustomer");
    const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(customer),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
}

export async function updateCustomer(url, customer) {
    console.log("function updateCustomer");
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(customer),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
}

// Training CRUD operations
export async function deleteTraining(training) {
    const response = await fetch(training._links.self.href, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
}

export async function addTraining(training) {
    console.log("function addTraining");
    const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(training),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
}

