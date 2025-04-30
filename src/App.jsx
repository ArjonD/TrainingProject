import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <nav>
        <div className="nav-container">
          <h1>Welcome to your Personal Trainer App</h1>
          <div className="nav-links">
            <NavLink
              to={"/"}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Home
            </NavLink>
            <NavLink
              to={"/Customerlist"}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Customers
            </NavLink>
            <NavLink
              to={"/Traininglist"}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Trainings
            </NavLink>
          </div>
        </div>
      </nav>
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
}

export default App;
