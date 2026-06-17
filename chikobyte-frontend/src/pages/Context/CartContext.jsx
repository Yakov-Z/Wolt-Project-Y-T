import React, { createContext, useState, useEffect, useContext, editingOrderId, removeFromCart } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context easily in any component
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage, or default to an empty array
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Initialize the current restaurant of the cart
    const [cartRestaurant, setCartRestaurant] = useState(() => {
        const savedRestaurant = localStorage.getItem('cartRestaurant');
        return savedRestaurant ? JSON.parse(savedRestaurant) : null;
    });

    // Initialize the total price
    const [fullPrice, setFullPrice] = useState(() => {
        const fullPrice = localStorage.getItem('fullPrice');
        return fullPrice ? JSON.parse(fullPrice) : 0;
    });

    // Keep track of the order ID being edited
    const [editingOrderId, setEditingOrderId] = useState(() => {
        const savedOrderId = localStorage.getItem('editingOrderId');
        return savedOrderId ? JSON.parse(savedOrderId) : null;
    });

    // Clear the entire cart and editing state
    const clearCart = () => {
        setCart([]);
        setCartRestaurant(null);
        setFullPrice(0);
        setEditingOrderId(null);
    }

    // Save to localStorage whenever states change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('cartRestaurant', JSON.stringify(cartRestaurant));
        localStorage.setItem('fullPrice', JSON.stringify(fullPrice));
        localStorage.setItem('editingOrderId', JSON.stringify(editingOrderId));
    }, [cart, cartRestaurant, fullPrice, editingOrderId]);

    // Add item to cart logic
    const addToCart = (product, restaurant) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("עליך להתחבר לאתר כדי להוסיף מוצרים לעגלה.");
            return; 
        }

        const itemPrice = Number(product.price) || 0;

        // If the cart has items but from a DIFFERENT restaurant
        if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
            const confirmClear = window.confirm(
                "כבר יש לך מוצרים בעגלה ממסעדה אחרת. האם ברצונך לרוקן את העגלה ולהוסיף את המוצר החדש?"
            );
            
            if (confirmClear) {
                // Clear the old cart and start fresh with the new item
                setCart([product]);
                setCartRestaurant({ id: restaurant.id, name: restaurant.name });
                setFullPrice(itemPrice);
                // Note: We deliberately DO NOT clear editingOrderId here, so they can switch restaurants during an edit
            }
            return; 
        }

        // If it's the first item, set the current restaurant
        if (cart.length === 0) {
            setCartRestaurant({ id: restaurant.id, name: restaurant.name });
        }

        // Add the new product to the cart array
        setCart((prevCart) => [...prevCart, product]);
        setFullPrice((prevFullPrice) => prevFullPrice + itemPrice);
        alert("המוצר נוסף לעגלה בהצלחה!");
    };

    // Remove item from cart by its index
    const removeFromCart = (indexToRemove) => {
        setCart((prevCart) => {
            const productToRemove = prevCart[indexToRemove];
            const itemPrice = Number(productToRemove.price) || 0;
            
            // Safely subtract the price
            setFullPrice((prevPrice) => Math.max(0, prevPrice - itemPrice));
            
            const newCart = prevCart.filter((_, index) => index !== indexToRemove);
            
            // Clear restaurant lock if cart is empty, so they can switch easily
            if (newCart.length === 0) {
                setCartRestaurant(null);
            }
            return newCart;
        });
    };

    // Load an existing order into the cart for editing
    const loadOrderToCart = (orderId, products, restaurant, totalPrice) => {
        setCart(products || []);
        if (restaurant) {
            setCartRestaurant({ id: restaurant.id, name: restaurant.name });
        } else {
            setCartRestaurant(null); // Used when switching to a completely new restaurant
        }
        setFullPrice(totalPrice || 0);
        setEditingOrderId(orderId);
    };

    return (
        <CartContext.Provider value={{ 
            cart, cartRestaurant, fullPrice, editingOrderId, 
            addToCart, clearCart, loadOrderToCart, removeFromCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};