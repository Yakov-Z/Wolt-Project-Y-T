import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';

export default function OrdersHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    const handleDeleteOrder = async (id) => {
        if (!window.confirm("האם אתה בטוח שברצונך לבטל הזמנה זו? פעולה זו אינה ניתנת לביטול.")) {
            return;
        }
        const token = localStorage.getItem('token');

        if (!token) {
            alert('שגיאה: אינך מחובר למערכת.');
            return;
        }

        try {
            // Send the DELETE request to the server
            const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("ההזמנה בוטלה בהצלחה.");
                setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
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
        const fetchOrdersAndRestaurants = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('No authentication token found. Please log in.');
                setIsLoading(false);
                return;
            }

            try {
                // 1. Fetch user's orders
                const ordersResponse = await fetch('http://localhost:5000/api/orders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!ordersResponse.ok) {
                    throw new Error('Failed to fetch orders');
                }
                
                const ordersData = await ordersResponse.json();
                
                // Ensure ordersData is an array to prevent mapping errors
                const safeOrdersArray = Array.isArray(ordersData) ? ordersData : [];
                setOrders(safeOrdersArray);

                // 2. Fetch all restaurants to map IDs to Names
                // (Using the public route since we just need basic info)
                const restaurantsResponse = await fetch('http://localhost:5000/api/restaurants');
                
                if (restaurantsResponse.ok) {
                    const restaurantsData = await restaurantsResponse.json();
                    setRestaurants(restaurantsData);
                }

            } catch (err) {
                console.error("Error fetching history:", err);
                setError('אירעה שגיאה בטעינת היסטוריית ההזמנות.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrdersAndRestaurants();
    }, []);

    // Helper function to find a restaurant's name by its ID
    const getRestaurantName = (restaurantID) => {
        const restaurant = restaurants.find(r => r.id === restaurantID);
        return restaurant ? restaurant.name : 'מסעדה לא ידועה';
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#555' }}>טוען היסטוריית הזמנות...</div>;
    }

    if (error) {
        return <div style={{ color: '#e74c3c', textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>{error}</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', direction: 'rtl' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '30px' }}>
                היסטוריית ההזמנות שלי
            </h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                    <h3 style={{ color: '#7f8c8d' }}>עדיין לא ביצעת הזמנות </h3>
                    <CustomButton 
                        text="התחל להזמין" 
                        colorId={1} 
                        onClickHandler={() => navigate('/')} 
                    />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Reverse the array to show the newest orders first */}
                    {[...orders].reverse().map((order) => (
                        <div key={order.id} style={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'transform 0.2s, boxShadow 0.2s',
                        }}>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                                    {order.restaurantID.name}
                                </h3>
                                <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>
                                    <span>הזמנה #{order.id}</span>
                                    <span style={{ margin: '0 10px' }}>•</span>
                                    <span>{order.productsIDs ? order.productsIDs.length : 0} פריטים</span>
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#007bff' }}>
                                    ₪{order.totalPrice}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <CustomButton 
                                    text="צפה בפירוט" 
                                    colorId={2} 
                                    onClickHandler={() => navigate(`/orders/${order.id}`)}
                                />
                                <CustomButton 
                                    text="בטל הזמנה" 
                                    colorId={3} 
                                    onClickHandler={() => handleDeleteOrder(order.id)}
                                />
                            </div>
                                
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}