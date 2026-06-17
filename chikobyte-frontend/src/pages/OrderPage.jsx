import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import CustomButton from '../components/CustomButton';
import { useCart } from './Context/CartContext';

export default function OrderPage({ user }) {
    const [OrderData, setOrderData] = useState(null);
    const [RestaurantData, setRestaurantData] = useState(null);
    
    const navigate = useNavigate();
    const { id } = useParams();
    const { loadOrderToCart } = useCart();
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleEditOrder = () => {
        alert("מצב עריכת הזמנה 🛠️\n\nכדי לערוך, אנחנו נטען את ההזמנה שלך לעגלה ונעביר אותך בחזרה לתפריט המסעדה.\n• להוספת מנות: פשוט בחר מנות חדשות מהתפריט.\n• להסרת מנות: היכנס לעגלת הקניות ולחץ על ה-X ליד המנה.\n\nבסיום, אל תשכח ללחוץ על 'שמור עדכון הזמנה' בקופה!");
        const wantToChangeRestaurant = window.confirm(
            "האם ברצונך להחליף למסעדה אחרת לגמרי?\n\nלחץ אישור (OK) לבחירת מסעדה חדשה.\nלחץ ביטול (Cancel) כדי לערוך את המנות מהמסעדה הנוכחית."
        );

        if (wantToChangeRestaurant) {
            // User wants a new restaurant: clear products, keep the editing order ID
            loadOrderToCart(OrderData.id, [], null, 0);
            navigate('/'); // Navigate to home to pick a new restaurant
        } else {
            // User stays in the same restaurant: load existing products
            const productList = RestaurantData.menu || [];
            
            const fullProductsToEdit = (OrderData.productsIDs || [])
                .map(productId => productList.find(p => p.id === productId))
                .filter(p => p !== undefined);

            loadOrderToCart(OrderData.id, fullProductsToEdit, RestaurantData, OrderData.totalPrice);
            
            // Navigate directly to the restaurant menu for seamless editing
            navigate(`/restaurant/${RestaurantData.id}`);
        }
    };
    
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
                navigate('/orders/history');
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
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('No authentication token found. Please log in.');
                setIsLoading(false);
                return;
            }
            
            try {
                // 1. First, fetch the order
                const orderResponse = await fetch(`http://localhost:5000/api/orders/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                });

                const orderResult = await orderResponse.json();

                if (orderResponse.status === 403 || (orderResult.userID && orderResult.userID !== user.id)) {
                    console.error("Unauthorized access attempt to order", id);
                    alert("אין לך הרשאה לצפות בהזמנה זו.");
                    navigate('/'); 
                    return; 
                }

                if (!orderResponse.ok) {
                    setError(orderResult.error || 'Failed to fetch order details');
                    setIsLoading(false);
                    return;
                }

                setOrderData(orderResult);

                // 2. Fetch the restaurant
                const restaurantResponse = await fetch(`http://localhost:5000/api/restaurants/${orderResult.restaurantID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                });

                const restaurantResult = await restaurantResponse.json();

                if (restaurantResponse.ok) {
                    setRestaurantData(restaurantResult);
                } else {
                    setError(restaurantResult.error || 'Failed to fetch restaurant details');
                }

            } catch (err) {
                console.error("The REAL error is:", err);
                setError('Network error occurred while fetching data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, user.id, navigate]); 

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#555' }}>טוען את פרטי ההזמנה...</div>;
    }
    
    if (error) {
        return <div style={{ color: '#e74c3c', textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>{error}</div>;
    }
    
    if (!OrderData || !RestaurantData) {
        return null; 
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 80px)', padding: '40px 20px', direction: 'rtl' }}>
            {/* Main Receipt Card */}
            <div style={{ 
                maxWidth: '500px', 
                margin: '0 auto', 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}>
                
                {/* Header Section */}
                <div style={{ 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    padding: '30px 20px', 
                    textAlign: 'center' 
                }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2rem' }}>
                        הזמנה #{OrderData.id}
                    </h1>
                    <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        מאת: <strong>{RestaurantData.name}</strong>
                    </div>
                </div>

                {/* Order Details Section */}
                <div style={{ padding: '30px' }}>
                    <h3 style={{ color: '#7f8c8d', fontSize: '1rem', borderBottom: '2px dashed #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                        פירוט ההזמנה
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                        {OrderData.productsIDs.map((productID, index) => {
                            const productList = RestaurantData.menu || RestaurantData.products || [];
                            const product = productList.find(p => p.id === productID);
                            
                            return product ? (
                                <div key={index} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    paddingBottom: '15px',
                                    borderBottom: index !== OrderData.productsIDs.length - 1 ? '1px solid #f1f2f6' : 'none'
                                }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#2c3e50' }}>{product.productName || product.name}</h4>
                                        {product.description && (
                                            <p style={{ margin: 0, color: '#95a5a6', fontSize: '0.85rem', maxWidth: '250px' }}>
                                                {product.description}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
                                        ₪{product.price}
                                    </div>
                                </div>
                            ) : (
                                <div key={index} style={{ color: '#e74c3c', fontSize: '0.9rem' }}>
                                    פריט לא נמצא במערכת (מזהה: {productID})
                                </div>
                            );
                        })}
                    </div>

                    {/* Total Price Section */}
                    <div style={{ 
                        backgroundColor: '#f1f8ff', 
                        borderRadius: '12px', 
                        padding: '20px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        border: '1px solid #cce5ff'
                    }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#004085' }}>סה"כ לתשלום</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#007bff' }}>
                            ₪{OrderData.totalPrice}
                        </span>
                    </div>

                    {/* Action Button */}
                    <div style={{ 
                        marginTop: '30px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '20px' // Add gap between the buttons
                    }}>
                        <button 
                            onClick={() => navigate('/profile')} 
                            style={{
                                backgroundColor: 'transparent',
                                color: '#007bff',
                                border: '1px solid #007bff',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = '#007bff'; e.target.style.color = 'white'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#007bff'; }}
                        >
                            חזרה לאזור האישי
                        </button>
                        
                        <button 
                            onClick={() => handleDeleteOrder(OrderData.id)} 
                            style={{
                                backgroundColor: 'transparent',
                                color: '#ff0000',
                                border: '1px solid #ff0000',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = '#ff0000'; e.target.style.color = 'white'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ff0000'; }}
                        >
                            מחק הזמנה
                        </button>
                        
                        <button 
                            onClick={handleEditOrder} 
                            style={{
                                backgroundColor: 'transparent',
                                color: '#f39c12',
                                border: '1px solid #f39c12',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = '#f39c12'; e.target.style.color = 'white'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#f39c12'; }}
                        >
                            ערוך הזמנה
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}