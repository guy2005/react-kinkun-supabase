import React from 'react'
import { BrowserRouter, Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import AddKinkun from './pages/AppKinkun'
import EditKinkun from './pages/EditKinkun'
import ShowAllkinkun from './pages/ShowAllKinkun'
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/addkinkun' element={<AddKinkun/>}/>
          <Route path='/editkinkun/:id' element={<EditKinkun/>}/>
          <Route path='/showallkinkun' element={<ShowAllkinkun/>}/>
        </Routes>
      
      </BrowserRouter>
    </div>
  )
}

export default App
