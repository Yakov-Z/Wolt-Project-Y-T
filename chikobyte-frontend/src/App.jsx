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
import RestaurantPage from './pages/RestaurantPage';
import UpdateRestaurantPage from './pages/UpdateRestaurantPage';
import OrderPage from './pages/OrderPage';
import OrdersHistoryPage from './pages/OrderHistoryPage';
import { CartProvider } from './pages/Context/CartContext';
import CheckoutPage from './pages/CheckoutPage';
import AddProductPage from './pages/AddProductPage';
import UpdateProductPage from './pages/UpdateProductPage';


function App() {
  const [user, setUser] = useState(() => { const token = localStorage.getItem('token');
  const savedUserString = localStorage.getItem('user');

    if (token && savedUserString) {
      try {
        return JSON.parse(savedUserString);
      } catch (error) {
        console.error("Error parsing user data from local storage", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    }
    return null; // Return null if no valid token/user is found
  });
  

 

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <CartProvider>
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

        <Route path="/restaurant/:id/add-product"
      element={
       <ProtectedRoute user={user} isAdminRoute={true}>
        <AddProductPage user={user} />
         </ProtectedRoute>
      } 
      />

      <Route path="/restaurant/:id/update-product/:productId" 
     element={
    <ProtectedRoute user={user} isAdminRoute={true}>
      <UpdateProductPage user={user} />
      </ProtectedRoute>
    } 
    />

        <Route path="/profile"
         element={
          <ProtectedRoute user={user} isAdminRoute={false}>
            <ProfilePage user={user} />
          </ProtectedRoute>} 
        />

        <Route path="/restaurant/:id" element={<RestaurantPage user={user} />} />

        <Route path="/restaurant/update/:id"
         element={
          <ProtectedRoute user={user} isAdminRoute={true}>
            <UpdateRestaurantPage user={user} />
          </ProtectedRoute>} 
        />

        <Route path="/orders/:id"
         element={
          <ProtectedRoute user={user} isAdminRoute={false}>
            <OrderPage user={user} />
          </ProtectedRoute>}
        />

        <Route path="/orders/history"
         element={
          <ProtectedRoute user={user} isAdminRoute={false}>
            <OrdersHistoryPage user={user} />
          </ProtectedRoute>}
        />

        <Route path="/orders/cart"
         element={
          <ProtectedRoute user={user} isAdminRoute={false}>
            <CheckoutPage user={user} />
          </ProtectedRoute>}
        />
        
        {/* Catch-all route for undefined URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;