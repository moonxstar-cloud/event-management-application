import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Register from './Component/Register'
import Login from './Component/Login'
import Event from './Component/Event'
import Profile from './Component/Profile'
import MyEvent from './Component/Home'
import Main from './Component/Main'
import Discover from './Component/Discover'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom';

function App() {
  const { user } = useSelector((state) => state.auth)
  // Configure QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Only retry failed queries once
      staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache data for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  },
})
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Router>     
        <div>
          <Routes>
            <Route exact path="/" element={user ? <MyEvent /> : <Main />} />
            <Route path="/main" element={<Main />} />   
            <Route path="/discover" element={<Discover />} />         
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/event" element={<Event />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App