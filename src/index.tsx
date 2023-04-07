import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.less'

const root = createRoot(document.getElementById('app'))

const APP: React.FC = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>Plus</button>
    </>
  )
}

root.render(<APP />)
