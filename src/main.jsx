import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Customerlist from './Components/Customers/Customerlist.jsx'
import Traininglist from './Components/Trainings/Traininglist.jsx'
import Home from './Components/Home.jsx'
import Calendar from './Components/Calendar/Calendar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="Customerlist" element={<Customerlist />} />
          <Route path="Traininglist" element={<Traininglist />} />
          <Route path="Calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
