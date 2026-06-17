import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './Context/CartContext'; // Adjust path if needed
import CustomButton from '../components/CustomButton';

export default function CheckoutPage() {
    const { cart, cartRestaurant, fullPrice, clearCart, removeFromCart, editingOrderId } = useCart();
    const navigate = useNavigate();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // If the cart is empty, show a friendly message and a back button
    if (!cart || cart.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', direction: 'rtl' }}>
                <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>עגלת הקניות שלך ריקה</h2>
                <button 
                    onClick={() => navigate('/')}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                    חזרה למסעדות
                </button>
            </div>
        );
    }

    // 2. Handle the order submission to the backend
    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        setError(null);
        
        const token = localStorage.getItem('token');

        if (!token) {
            setError('עליך להתחבר כדי לבצע הזמנה.');
            setIsSubmitting(false);
            return;
        }

        // Create the exact payload structure the controller expects
        const orderPayload = {
            restaurant: cartRestaurant,
            products: cart
        };
        
        const url = editingOrderId 
            ? `http://localhost:5000/api/orders/${editingOrderId}` 
            : 'http://localhost:5000/api/orders';
            
        const method = editingOrderId ? 'PATCH' : 'POST';
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderPayload)
            });

            if (response.ok || response.status === 201 || response.status === 200) {
                // Success! Clear the cart, alert the user, and redirect
                clearCart();
                alert(editingOrderId ? "ההזמנה עודכנה בהצלחה!" : "ההזמנה נשלחה בהצלחה! בתאבון!");
                navigate('/orders/history');
            } else {
                const data = await response.json();
                setError(data.error || 'אירעה שגיאה ביצירת ההזמנה');
            }
        } catch (err) {
            console.error("Order submission error:", err);
            setError('שגיאת תקשורת עם השרת.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 80px)', padding: '40px 20px', direction: 'rtl' }}>
            <div style={{ 
                maxWidth: '600px', 
                margin: '0 auto', 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                overflow: 'hidden'
            }}>
                
                {/* Header Section */}
                <div style={{ backgroundColor: '#28a745', color: 'white', padding: '25px', textAlign: 'center' }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>סיכום הזמנה</h1>
                    <div style={{ fontSize: '1.2rem' }}>
                        מסעדה: <strong>{cartRestaurant.name}</strong>
                    </div>
                </div>

                <div style={{ padding: '30px' }}>
                    {/* Error Message Display */}
                    {error && (
                        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {/* Cart Items List */}
                    <div style={{ marginBottom: '30px' }}>
                        {cart.map((product, index) => (
                            <div key={index} style={{ 
                                display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f1f2f6'
                            }}>
                                <div><h4 style={{ margin: '0 0 5px 0' }}>{product.productName || product.name}</h4></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ fontWeight: 'bold' }}>₪{product.price}</span>
                                    
                                    <button 
                                        onClick={() => removeFromCart(index)}
                                        style={{ backgroundColor: 'transparent', color: '#e74c3c', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Price Section */}
                    <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '12px', 
                        padding: '20px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '30px',
                        border: '1px solid #eee'
                    }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>סה"כ לתשלום</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#28a745' }}>
                            ₪{fullPrice}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting}
                            style={{
                                flex: 2,
                                backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '15px',
                                borderRadius: '8px',
                                fontSize: '1.2rem',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {editingOrderId ? (isSubmitting ? 'שולח עדכון...' : 'שמור עדכון הזמנה') : (isSubmitting ? 'שולח הזמנה...' : 'בצע הזמנה עכשיו')}
                        </button>
                        
                        <button 
                            onClick={() => navigate(-1)} // Go back to the previous page
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                color: '#6c757d',
                                border: '1px solid #6c757d',
                                padding: '15px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            חזור למסעדה
                        </button>

                        <button 
                            onClick={() => clearCart()} // Go back to the previous page
                            style={{
                                flex: 1,
                                backgroundColor:'#ff0000',
                                color: 'white',
                                border: 'none',
                                padding: '15px',
                                borderRadius: '8px',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                
                            }}
                        >
                            מחק הזמנה
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}