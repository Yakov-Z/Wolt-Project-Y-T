import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './filterRestaurants.css';

export default function FilterRestaurants({ isDarkMode, user }) {
    // State variables for storing popular and nearby restaurants data
    const [popularRestaurants, setPopularRestaurants] = useState([]);
    const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
    
    // Fetch data when the component mounts or when the 'user' prop changes
    useEffect(() => {
        // Async function to fetch popular restaurants from the API
        const fetchPopularRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/restaurants/popular');
                if (response.ok) {
                    const data = await response.json();
                    setPopularRestaurants(data);
                }
            } catch (error) {
                // Log error message in English for developers
                console.error("Error: Please try again later", error);
            }
        };

        // Async function to fetch nearby restaurants, passing user ID in headers if available
        const fetchNearbyRestaurants = async () => {
            try {
                const headers = {};
                
                // If user is logged in, attach their ID to the request headers
                if (user && user.id) {
                    headers['userid'] = user.id;
                }
                
                const response = await fetch('http://localhost:5000/api/restaurants/nearby', { headers });
                if (response.ok) {
                    const data = await response.json();
                    setNearbyRestaurants(data);
                }
            } catch (error) {
                // Log error message in English for developers
                console.error("Error: Please try again later", error);
            }
        };
        
        fetchPopularRestaurants();
        fetchNearbyRestaurants();
    }, [user]);

    // Determine the CSS class based on the dark mode toggle
    let themeClass;
    if (isDarkMode) {
        themeClass = 'dark-mode';
    } else {
        themeClass = 'light-mode';
    }

    // Generate content for popular restaurants
    let popularRestaurantsContent;
    
    if (popularRestaurants.length === 0) {
        // Render empty state if no popular restaurants are found
        popularRestaurantsContent = (
            <div className="empty-state">
                <p>כרגע עדיין אין מסעדות. מסעדנ/ית? הירשם ותגיע לעוד לקוחות!</p>
                
                {user && user.isadmin && (
                    <>
                        <p>רוצה לשווק את המסעדה המטורפת שלך?</p>
                        <Link to="/add-restaurant" className="add-restaurant-btn">
                            לחץ כאן להוספת הלהיט הבא 
                        </Link>
                    </>
                )}
            </div>
        );
    } else {
        // Map through the popular restaurants array to render clickable cards
        popularRestaurantsContent = popularRestaurants.map((restaurant) => {
            return (
                <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id} className="restaurant-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    
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

                </Link>
            );
        });
    }

    // Generate content for nearby restaurants
    let nearbyRestaurantsContent;
    if (nearbyRestaurants.length === 0) {
        // Render empty state if no nearby restaurants are found
        nearbyRestaurantsContent = (
            <div className="empty-state">
                <p>אין מסעדות... אולי תהיה הראשון שפותח אחת!</p>
            </div>
        );
    } else {
        // Map through the nearby restaurants array to render clickable cards
        nearbyRestaurantsContent = nearbyRestaurants.map((restaurant) => {
            return (
                <Link to={`/restaurant/${restaurant.id}`} key={`nearby-${restaurant.id}`} className="restaurant-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card-image-container">
                        <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
                        <img src={restaurant.logo} alt="logo" className="restaurant-logo" />
                    </div>
                    <div className="card-content">
                        <div className="card-title-row">
                            <h3>{restaurant.name}</h3>
                        </div>
                        <p className="category-text">{restaurant.category}</p>
                       
                        {/* Display distance from the user if the data is available */}
                        {restaurant.distanceFromUser !== undefined && (
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px', fontWeight: 'bold' }}>
                                📍 {restaurant.distanceFromUser} ק"מ ממך
                            </p>
                        )}
                    </div>
                </Link>
            );
        });
    }

    return (
        <div className={`filter-restaurants-container ${themeClass}`}>
            
           <section className="restaurants-section">
                <div className="section-header">
                    <h2>מסעדות קרובות אליך:</h2>
                </div>
                
                {/* Prompt user to register/login for personalized location-based results */}
                {!user && (
                    <div style={{ textAlign: 'center',marginTop: '20px', marginBottom: '20px', padding: '0 15px' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: '500', color: isDarkMode ? '#e0e0e0' : '#333' }}>
                            רוצה מסעדות שמותאמות לכתובת האמיתית שלך! <Link to="/register" style={{ fontWeight: 'bold', textDecoration: 'underline', color: '#007bff' }}>תירשם</Link> ותגלה מה יש לסביבה שלך להציע!
                        </p>
                    </div>
                )}
                
                <div className="restaurants-scroll-container">
                    {nearbyRestaurantsContent}
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

       <div className="bottom-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <Link to="/all-restaurants" className="action-btn outline-btn">
                    לצפייה בכל המסעדות לחץ כאן 
                </Link>
                
                {/* Conditional rendering based on user admin status */}
                {user && user.isadmin ? (
                    <Link to="/add-restaurant" className="action-btn primary-btn">
                        בעל מסעדה? רוצה לכבוש את המדינה? לחץ כאן!
                    </Link>
                ) : (
                    <p style={{ textAlign: 'center', margin: '10px 0 0 0', fontSize: '1.1rem', fontWeight: '500' }}>
                        זכית במאסטר שף? רוצה לכבוש את המדינה? <Link to="/register" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>תירשם</Link> ונתחיל שיתוף פעולה מהסרטים!
                    </p>
                )}
            </div>

        </div>
    );
}