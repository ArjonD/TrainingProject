import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="welcome-section">
        <h2>Personal Trainer Management System</h2>
        <p>Access and manage customer information and training sessions</p>
      </section>

      <section className="features-section">
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Customer Management</h3>
            <p>View and manage customer information including contact details and personal data.</p>
            <p>Click on "Customers" in the navigation menu to access the customer list.</p>
          </div>
          
          <div className="feature-card">
            <h3>Training Sessions</h3>
            <p>Track and manage training sessions for all customers.</p>
            <p>Click on "Trainings" in the navigation menu to access the training sessions list.</p>
          </div>
        </div>
          </section>
    </div>
  );
}

export default Home;