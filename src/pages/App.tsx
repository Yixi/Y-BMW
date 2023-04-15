import React from 'react'
import Titan from '@root/components/Titan'
import { Outlet } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <Titan />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  )
}

export default React.memo(App)
