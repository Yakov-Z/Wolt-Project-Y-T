import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/navbar'; 
import LoginPage from './pages/LoginPage';

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

        <h1 style={{ textAlign: 'center', marginTop: '50px', color: isDarkMode ? 'white' : '#353434' }}>
         
        </h1>
        
      </div>
      <Routes>
        {/* Public routes - anyone can access these */}
        <Route path="/tokens" element={<LoginPage/>} />
        
        {/* Catch-all route for undefined URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>    
  );
}

export default App;