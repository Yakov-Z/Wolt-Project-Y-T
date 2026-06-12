import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/navbar'; 
import FilterRestaurants from './components/FilterRestaurants/filterRestaurants';
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
        minHeight: 'auto', 
        backgroundColor: isDarkMode ? '#121111' : '#ffffff',
        transition: 'background-color 0.3s ease'
      }}>
        
        <Navbar 
          user={user} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />

        <FilterRestaurants isDarkMode={isDarkMode} />
        
      </div>
      <Routes>
        {/* Public routes - anyone can access these */}
        <Route path="/tokens" element={<LoginPage setUser={setUser} />} />
        <Route path="/users/" element={<RegisterPage/>} />
        
        {/* Catch-all route for undefined URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>    
  );
}

export default App;