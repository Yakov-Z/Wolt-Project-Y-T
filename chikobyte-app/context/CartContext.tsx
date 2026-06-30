import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

interface CartContextType {
    cart: any[];
    cartRestaurant: any | null;
    fullPrice: number;
    editingOrderId: string | null;
    addToCart: (product: any, restaurant: any) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    loadOrderToCart: (orderId: string, products: any[], restaurant: any, totalPrice: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<any[]>([]);
    const [cartRestaurant, setCartRestaurant] = useState<any | null>(null);
    const [fullPrice, setFullPrice] = useState(0);
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

    const addToCart = (product: any, restaurant: any) => {
        if (cartRestaurant && cartRestaurant.id !== restaurant.id && cartRestaurant._id !== restaurant._id) {
            alert("אי אפשר להוסיף מנות ממסעדות שונות באותה הזמנה.");
            return;
        }
        setCartRestaurant(restaurant);
        setCart(prev => [...prev, product]);
        setFullPrice(prev => prev + Number(product.price));
        Alert.alert("הוסף לעגלה", "מוצר נוסף בהצלחה!");
    };

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        const removedProduct = newCart.splice(index, 1)[0];
        setCart(newCart);
        setFullPrice(prev => prev - Number(removedProduct.price));

        if (newCart.length === 0) {
            setCartRestaurant(null);
            setEditingOrderId(null);
        }
    };

    const clearCart = () => {
        setCart([]);
        setCartRestaurant(null);
        setFullPrice(0);
        setEditingOrderId(null);
    };

    const loadOrderToCart = (orderId: string, products: any[], restaurant: any, totalPrice: number) => {
        setEditingOrderId(orderId);
        setCart(products);
        setCartRestaurant(restaurant);
        setFullPrice(totalPrice);
    };

    return (
        <CartContext.Provider value={{ cart, cartRestaurant, fullPrice, editingOrderId, addToCart, removeFromCart, clearCart, loadOrderToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};