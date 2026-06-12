
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './filterRestaurants.css';

export default function FilterRestaurants({ isDarkMode }) {
    const [popularRestaurants, setPopularRestaurants] = useState([]);
    
    useEffect(() => {
        const fetchPopularRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/restaurants/popular');
                if (response.ok) {
                    const data = await response.json();
                    setPopularRestaurants(data);
                }
            } catch (error) {
                console.error("שגיאה: נסו שנית אחר כך", error);
            }
        };

        fetchPopularRestaurants();
    }, []);

    let themeClass;
    if (isDarkMode) {
        themeClass = 'dark-mode';
    } else {
        themeClass = 'light-mode';
    }

    let popularRestaurantsContent;
    
    if (popularRestaurants.length === 0) {
        popularRestaurantsContent = (
            <div className="empty-state">
                <p>כרגע עדיין אין מסעדות. רוצה לשווק את המסעדה המטורפת שלך?</p>
                <Link to="/add-restaurant" className="add-restaurant-btn">
                    לחץ כאן להוספת הלהיט הבא 
                </Link>
            </div>
        );
    } else {
        popularRestaurantsContent = popularRestaurants.map((restaurant) => {
            return (
                <div key={restaurant.id} className="restaurant-card">
                    
                    <div className="card-image-container">
                        <img 
                            src={restaurant.image} 
                            alt={restaurant.name} 
                            className="restaurant-image"
                        />
                        <img 
                            src={restaurant.logo} 
                            alt="logo" 
                            className="restaurant-logo" 
                        />
                    </div>
                    
                    <div className="card-content">
                        <div className="card-title-row">
                            <h3>{restaurant.name}</h3>
                        </div>
                        <p className="category-text">{restaurant.category}</p>

                    </div>

                </div>
            );
        });
    }

    return (
        <div className={`filter-restaurants-container ${themeClass}`}>
            
            <section className="restaurants-section">
                <div className="section-header">
                    <h2> מסעדות קרובות אליך</h2>
                </div>
                
                <div className="restaurants-scroll-container">
                    <div className="placeholder-card">
                        <span className="placeholder-icon"></span>
                        <p>המסעדות הקרובות יוצגו כאן בקרוב...</p>
                    </div>
                </div>
            </section>

            <section className="restaurants-section">
                <div className="section-header">
                    <h2>המסעדות הפופולריות: גיוון זה אוברייטד</h2>
                </div>
                
                <div className="restaurants-scroll-container">
                    {popularRestaurantsContent}
                </div>
            </section>

        <div className="bottom-actions">
                <Link to="/all-restaurants" className="action-btn outline-btn">
                    לצפייה בכל המסעדות לחץ כאן 
                </Link>
                <Link to="/add-restaurant" className="action-btn primary-btn">
                   בעל מסעדה? רוצה לכבוש את המדינה? לחץ כאן!
                </Link>
            </div>

            </div>
    );
}