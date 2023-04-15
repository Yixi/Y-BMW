import { createBrowserRouter } from 'react-router-dom'
import Home from '@root/pages/Home'
import React from 'react'
import App from '@root/pages/App'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{ index: true, element: <Home /> }],
  },
])

export default routes
