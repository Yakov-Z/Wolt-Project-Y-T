import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import CustomButton from '../CustomButton';

export default function Navbar({ user, isDarkMode, toggleTheme, setUser }) {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({ restaurants: [], products: [] });

    const navigate = useNavigate(); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);

        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };


    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults({ restaurants: [], products: [] });
            return;
        }

        const fetchResults = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/search/${searchTerm}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data); 
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchResults();
        
    }, [searchTerm]);

    let displayAddress;
    if (user) {
        displayAddress = user.address.street + ' ' + user.address.number;
    } else {
        displayAddress = 'Earth 🌍';
    }

    let themeClass;
    let themeText;
    if (isDarkMode) {
        themeClass = 'dark-mode';
        themeText = '☀️ מצב יום';
    } else {
        themeClass = 'light-mode';
        themeText = '🌙 מצב לילה';
    }

    let userSection;
    if (!user) {
        userSection = (
    <div className="auth-links">
        <Link to="/login" className="login-link">התחברות</Link>
        <Link to="/register" className="register-btn">הרשמה</Link>
    </div>
    );
    } else {
        userSection = (
            <div className="user-profile">
                <span>היי, {user.realname}</span>
                <button onClick={handleLogout} className="logout-btn" style={{ marginLeft: '15px', padding: '5px 10px', cursor: 'pointer' }}>
                    התנתק
                </button>
                <CustomButton
                 text="איזור אישי"
                 colorId="2"
                 onClickHandler={handleProfileClick}
                />
            </div>
        );
    }

    const hasResults = searchResults.restaurants.length > 0 || searchResults.products.length > 0;

    return (
        <nav className={`top-navbar ${themeClass}`}>
            
            <div className="navbar-content">
                
                <div className="navbar-right">
                    <Link to="/" className="brand-name">Chikobyte</Link>
                    
                    <div className="address-badge">
                        <span className="icon">📍</span>
                        <span>{displayAddress}</span>
                    </div>

                    <div>
                        <Link to="/orders/cart" className="cart-link">
                            🛒 עגלת קניות
                        </Link>
                    </div>

                </div>

                <div className="navbar-center" style={{ position: 'relative' }}>
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="מה אוכלים היום?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {hasResults && (
                        <div className="search-results-dropdown">
                            
                            {searchResults.restaurants.length > 0 && (
                                <div className="search-section">
                                    <h4 style={{ margin: '5px 10px', color: 'gray' }}>מסעדות:</h4>
                                    {searchResults.restaurants.map((rest, index) => (
                                        <div key={`rest-${index}`} className="search-item">
                                            🍽️ {rest.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {searchResults.products.length > 0 && (
                                <div className="search-section">
                                    <h4 style={{ margin: '10px 10px 5px', color: 'gray' }}>מנות:</h4>
                                    {searchResults.products.map((prod, index) => (
                                        <div key={`prod-${index}`} className="search-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span> {prod.productName} - {prod.restaurantName}</span>
                                            <span style={{ fontWeight: 'bold' }}>₪{prod.price}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    )}
                </div>

                <div className="navbar-left">
                    <button className="theme-toggle" onClick={toggleTheme}>
                        {themeText}
                    </button>

                    {userSection}
                </div>

            </div> 
            
        </nav>
    );
}