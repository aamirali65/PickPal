import React from 'react'
import ColorPicker from './components/home'
import { Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<ColorPicker/>}/>
    </Routes>
  )
}

export default App