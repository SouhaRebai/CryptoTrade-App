import { useState } from 'react'
import { Footer, Home, Loader, Navbar, Services, Transactions } from './components'
import './App.css'

const App = () => {

  return (
    <div className='min-h-screen'>
      <div className='gradient-bg-welcome'>
        <Navbar/>
        <Home/>
      </div>
      <Services/>
      <Transactions/>
      <Footer/>
  </div>
  )
}

export default App
