import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/navbar'; 
import FilterRestaurants from './components/FilterRestaurants/filterRestaurants';
import AllRestaurantsWithFilters from './components/AllRestaurantsWithFilters/allRestaurantsWithFilters';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddRestaurantPage from './pages/AddRestaurantPage';
import ProtectedRoute from './components/ProtectedRoute';
import IsUserLoggedProtect from './components/IsUserLoggedProtect';
import ProfilePage from './pages/ProfilePage';



function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUserString = localStorage.getItem('user');

    if (token && savedUserString) {
      try {
        const parsedUser = JSON.parse(savedUserString);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from local storage", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

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
          setUser={setUser}
        />

        
      <Routes>
        <Route path="/" element={<FilterRestaurants isDarkMode={isDarkMode} user={user} />} />
        {/* Public routes - anyone can access these */}
        <Route path="/all-restaurants" element={<AllRestaurantsWithFilters />} />
        <Route path="/login" 
          element={
            <IsUserLoggedProtect user={user}>
              <LoginPage setUser={setUser} />
            </IsUserLoggedProtect>
          } />
        <Route path="/register"
         element={
          <IsUserLoggedProtect user={user}>
            <RegisterPage/>
         </IsUserLoggedProtect>} />
        <Route path="/add-restaurant"
         element={
          <ProtectedRoute user={user} isAdminRoute={true}>
            <AddRestaurantPage/>
          </ProtectedRoute>} 
        />
        <Route path="/profile"
         element={
          <ProtectedRoute user={user} isAdminRoute={false}>
            <ProfilePage user={user} />
          </ProtectedRoute>} 
        />
        
        {/* Catch-all route for undefined URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </BrowserRouter>    
  );
}

export default App;