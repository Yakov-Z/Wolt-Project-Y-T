import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './components/Navbar/navbar'; 
import FilterRestaurants from './components/FilterRestaurants/filterRestaurants';

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

        <FilterRestaurants isDarkMode={isDarkMode} />
        
      </div>
    </BrowserRouter>
  );
}

export default App;