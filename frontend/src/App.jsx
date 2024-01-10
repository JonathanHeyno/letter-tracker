import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import DeliveryView from './views/DeliveryView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        HOLA FRONTEND
        <DeliveryView />
      </div>
    </>
  )
}

export default App
