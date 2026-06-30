import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext'; 
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config/apiConfig';
import { cartStyles as styles } from '../../styles/cart.styles';

export default function CheckoutScreen() {
    const { cart, cartRestaurant, fullPrice, clearCart, removeFromCart, editingOrderId } = useCart();
    const router = useRouter();
    const { token } = useAuth();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!cart || cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>עגלת הקניות שלך ריקה</Text>
                <TouchableOpacity style={[styles.primaryBtn, { flex: 0, paddingHorizontal: 40 }]} onPress={() => router.push('/')}>
                    <Text style={styles.primaryBtnText}>חזרה למסעדות</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        setError(null);

        if (!token) {
            setError('עליך להתחבר כדי לבצע הזמנה.');
            setIsSubmitting(false);
            return;
        }

        const orderPayload = { restaurant: cartRestaurant, products: cart };
        const url = editingOrderId ? `${BASE_URL}/api/orders/${editingOrderId}` : `${BASE_URL}/api/orders`;
        const method = editingOrderId ? 'PATCH' : 'POST';
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(orderPayload)
            });

            if (response.ok || response.status === 201 || response.status === 200) {
                clearCart();
                Alert.alert("הצלחה", editingOrderId ? "ההזמנה עודכנה בהצלחה!" : "ההזמנה נשלחה בהצלחה! בתאבון!");
                router.replace('/orders/history');
            } else {
                const data = await response.json();
                setError(data.error || 'אירעה שגיאה ביצירת ההזמנה');
            }
        } catch (err) {
            setError('שגיאת תקשורת עם השרת.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>סיכום הזמנה</Text>
                    <Text style={styles.headerSub}>מסעדה: {cartRestaurant?.name}</Text>
                </View>

                <View style={styles.body}>
                    {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

                    <View style={styles.itemsContainer}>
                        {cart.map((product: any, index: number) => (
                            <View key={index} style={styles.itemRow}>
                                <Text style={styles.itemName}>{product.productName || product.name}</Text>
                                <View style={styles.itemPriceRow}>
                                    <Text style={styles.itemPrice}>₪{product.price}</Text>
                                    <TouchableOpacity onPress={() => removeFromCart(index)}>
                                        <Text style={styles.deleteItemBtn}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.totalBox}>
                        <Text style={styles.totalTextLabel}>סה"כ לתשלום</Text>
                        <Text style={styles.totalPrice}>₪{fullPrice}</Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsContainer}>
                        {/* Main checkout button gets its own full row */}
                        <TouchableOpacity 
                            style={[styles.primaryBtn, isSubmitting && { backgroundColor: '#6c757d' }]} 
                            onPress={handlePlaceOrder}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.primaryBtnText}>
                                {editingOrderId ? (isSubmitting ? 'שולח...' : 'שמור עדכון') : (isSubmitting ? 'שולח...' : 'בצע הזמנה')}
                            </Text>
                        </TouchableOpacity>

                        {/* Secondary buttons share the bottom row */}
                        <View style={styles.secondaryActionsRow}>
                            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
                                <Text style={styles.secondaryBtnText}>חזור למסעדה</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dangerBtn} onPress={clearCart}>
                                <Text style={styles.dangerBtnText}>נקה עגלה</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}