import React from 'react'
import './index.css'; // Adjust the path if necessary
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Home from './Component/Home'
import Register from './Component/Register'
import Login from './Component/Login';
import Event from './Component/Event';

function App() {
  return (
    <Router>
        <div>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/event" element={<Event />} />
          </Routes>
        </div>
    </Router>

  )
}

export default App