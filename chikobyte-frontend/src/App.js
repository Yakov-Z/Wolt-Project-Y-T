import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './components/Navbar/navbar'; 

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
    </BrowserRouter>
  );
}

export default App;