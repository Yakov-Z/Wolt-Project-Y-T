import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar({ user, isDarkMode, toggleTheme }) {
    
   
    let displayAddress;
    if (user) {
        displayAddress = user.address.city;
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
                <span>היי, {user.name} 👋</span>
            </div>
        );
    }

    return (
        <nav className={`top-navbar ${themeClass}`}>
            
            <div className="navbar-right">
                <Link to="/" className="brand-name">chikobyte</Link>
                
                <div className="address-badge">
                    <span className="icon">📍</span>
                    <span>{displayAddress}</span>
                </div>
            </div>

            
            <div className="navbar-center">
                
            </div>

            <div className="navbar-left">
                <button className="theme-toggle" onClick={toggleTheme}>
                    {themeText}
                </button>

                {userSection}
            </div>
        </nav>
    );
}