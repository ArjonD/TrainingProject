import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Customerlist from './Components/Customers/Customerlist.jsx'
import Traininglist from './Components/Trainings/Traininglist.jsx'
import Home from './Components/Home.jsx'
import Calendar from './Components/Calendar/Calendar.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "Customerlist",
        element: <Customerlist />
      },
      {
        path: "Traininglist",
        element: <Traininglist />
      },
      {
        path: "Calendar",
        element: <Calendar />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
