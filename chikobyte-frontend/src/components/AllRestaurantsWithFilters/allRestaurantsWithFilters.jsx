import React, { useState, useEffect } from 'react';
import './allRestaurantsWithFilters.css';

export default function AllRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isKosher, setIsKosher] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const restaurants = await fetch('http://localhost:5000/api/restaurants');
            const categories = await fetch('http://localhost:5000/api/restaurants/category');
            
            const restaurantsData = await restaurants.json();
            const categoriesData = await categories.json();
            
            setRestaurants(restaurantsData);
            setFilteredRestaurants(restaurantsData);
            setCategories(['All', ...categoriesData]);
        };
        fetchData();
    }, []);

    useEffect(() => {
        let temp = restaurants;

        if (selectedCategory !== 'All') {
            temp = temp.filter(restaurant => {
                return restaurant.category.toLowerCase() === selectedCategory.toLowerCase();
            });
        }
        
        if (isKosher === true) {
            temp = temp.filter(restaurant => {
                return restaurant.kosher === true;
            });
        }

        setFilteredRestaurants(temp);
    }, [selectedCategory, isKosher, restaurants]);

    
    let kosherButtonText; 
    let kosherButtonClass;
     
     if (isKosher) {
        kosherButtonText = "כל המסעדות";
    }
    else {
        kosherButtonText = "צדיק! תלחץ בשביל מסעדות כשרות";
    }
    kosherButtonClass = "kosher-btn";

    return (
        <div className="all-restaurants-page">
            <div className="filters-bar">
                {categories.map(cat => {
                    let buttonClass = "";
                    if (selectedCategory === cat) {
                        buttonClass = "active";
                    }

                    return (
                        <button 
                            key={cat} 
                            className={buttonClass}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    );
                })}
                
                <button 
                    className={kosherButtonClass}
                    onClick={() => setIsKosher(!isKosher)}
                >
                    {kosherButtonText}
                </button>
            </div>

            <div className="restaurants-scroll-container">
                {filteredRestaurants.map(restaurant => (
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
                ))}
            </div>
        </div>
    );
}