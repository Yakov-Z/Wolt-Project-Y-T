import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/navbar'; 
import FilterRestaurants from './components/FilterRestaurants/filterRestaurants';
import AllRestaurantsWithFilters from './components/AllRestaurantsWithFilters/allRestaurantsWithFilters';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';



function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <BrowserRouter>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: isDarkMode ? '#121111' : '#ffffff',
        transition: 'background-color 0.3s ease'
      }}>
        
        <Navbar 
          user={user} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />

        
      <Routes>
        <Route path="/" element={<FilterRestaurants isDarkMode={isDarkMode} user={user} />} />
        {/* Public routes - anyone can access these */}
        <Route path="/all-restaurants" element={<AllRestaurantsWithFilters />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage/>} />
        
        {/* Catch-all route for undefined URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </BrowserRouter>    
  );
}

export default App;