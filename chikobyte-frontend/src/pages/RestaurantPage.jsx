import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import RestaurantDetailItem from '../components/DetailsItem'; 
import CustomButton from '../components/CustomButton';

export default function RestaurantPage({ user }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [fullRestaurantData, setFullRestaurantData] = useState(null);  
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const handleDeleteRestaurant = async () => {
        if (!window.confirm("האם אתה בטוח שברצונך למחוק מסעדה זו? פעולה זו אינה ניתנת לביטול.")) {
            return;
        }
        const token = localStorage.getItem('token');

        if (!token) {
            alert('שגיאה: אינך מחובר למערכת.');
            return;
        }

        try {
            // Send the DELETE request to the server
            const response = await fetch(`http://localhost:5000/api/restaurants/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("המסעדה נמחקה בהצלחה.");
                // Redirect back to the main page after successful deletion
                navigate('/'); 
            } else {
                const data = await response.json();
                alert(`שגיאה במחיקה: ${data.error || 'Failed to delete restaurant'}`);
            }
        } catch (err) {
            console.error("Error deleting restaurant:", err);
            alert("אירעה שגיאת תקשורת בעת המחיקה.");
        }
    };

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/restaurants/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setFullRestaurantData(data);
                } else {
                    setError(data.error || 'Failed to fetch restaurant details');
                }
            } catch (err) {
                console.error("The REAL error is:", err);
                setError('Network error occurred while fetching data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRestaurantDetails();
    }, [id]);

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading restaurant data...</div>;
    }
    
    if (error) {
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
    }
    
    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', direction: 'rtl' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                {fullRestaurantData.image ? (
                    <img 
                        src={fullRestaurantData.image} 
                        alt="תמונת מסעדה" 
                        style={{ 
                            width: '100%', 
                            height: '250px', 
                            objectFit: 'cover',
                            borderRadius: '15px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
                            marginBottom: '20px'
                        }}
                    />
                ) : (
                    <div style={{ 
                        width: '100%', height: '250px', borderRadius: '15px', backgroundColor: '#e9ecef', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d',
                        fontSize: '1.5rem', marginBottom: '20px'
                    }}>
                        אין תמונה למסעדה זו
                    </div>
                )}
                
                <h1 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '2.5rem' }}>
                    {fullRestaurantData.name}
                </h1>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
                        {fullRestaurantData.category}
                    </span>
                    {fullRestaurantData.kosher && (
                        <span style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
                            כשר
                        </span>
                    )}
                </div>
            </div>
            
            <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '40px' }}>
                <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '20px', lineHeight: '1.6' }}>
                    {fullRestaurantData.description}
                </p>
                
                {fullRestaurantData.address && (
                    <RestaurantDetailItem 
                        label="כתובת" 
                        value={`${fullRestaurantData.address.street} ${fullRestaurantData.address.number}, ${fullRestaurantData.address.city}`} 
                    />
                )}
            </div>

            <h2 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', display: 'inline-block', paddingBottom: '5px' }}>
                תפריט המסעדה
            </h2>

            {!fullRestaurantData.menu || fullRestaurantData.menu.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>אין כרגע מנות בתפריט.</p>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: '20px' 
                }}>
                    {fullRestaurantData.menu.map((product, index) => (
                        <div key={index} style={{ 
                            border: '1px solid #eaeaea', 
                            borderRadius: '10px', 
                            padding: '15px',
                            backgroundColor: '#fafafa',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', color: '#222' }}>{product.productName || product.name}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>{product.description}</p>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
                                    ₪{product.price}
                                </span>
                                <button style={{ 
                                    backgroundColor: '#28a745', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px 15px', 
                                    borderRadius: '5px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                    הוסף
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {user && user.isadmin && user.id === fullRestaurantData.owner?.id && (
                <CustomButton 
                    text="ערוך פרטי מסעדה" 
                    colorId={1} 
                    onClickHandler={() => navigate(`/restaurant/update/${id}`)}
                />
            )}
            {user && user.isadmin && user.id === fullRestaurantData.owner?.id && (
                <CustomButton 
                    text="מחק מסעדה" 
                    colorId={3} 
                    onClickHandler={handleDeleteRestaurant}
                />
            )}
        </div>
    );
}