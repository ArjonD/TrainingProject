import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Customerlist from './Components/Customerlist.jsx'
import Traininglist from './Components/Traininglist.jsx'
import Home from './Components/Home.jsx'

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
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
