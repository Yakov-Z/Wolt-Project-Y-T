import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config/apiConfig';
import { styles } from '../../styles/orders.styles';

export default function OrdersHistoryScreen() {
    const [orders, setOrders] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const { token } = useAuth();

    const handleDeleteOrder = (id: string) => {
        Alert.alert(
            "ביטול הזמנה",
            "האם אתה בטוח שברצונך לבטל הזמנה זו? פעולה זו אינה ניתנת לביטול.",
            [
                { text: "חזור", style: "cancel" },
                { 
                    text: "בטל הזמנה", 
                    style: "destructive",
                    onPress: async () => {
                        if (!token) return;
                        try {
                            const response = await fetch(`${BASE_URL}/api/orders/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (response.ok) {
                                Alert.alert("הצלחה", "ההזמנה בוטלה בהצלחה.");
                                setOrders(prevOrders => prevOrders.filter(order => order.id !== id && order._id !== id));
                            } else {
                                const data = await response.json();
                                Alert.alert("שגיאה במחיקה", data.error || 'Failed to delete order');
                            }
                        } catch (err) {
                            Alert.alert("שגיאה", "אירעה שגיאת תקשורת בעת המחיקה.");
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        const fetchOrdersAndRestaurants = async () => {
            if (!token) {
                setError('לא נמצא אסימון התחברות. אנא התחבר.');
                setIsLoading(false);
                return;
            }

            try {
                const ordersResponse = await fetch(`${BASE_URL}/api/orders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
                
                const ordersData = await ordersResponse.json();
                setOrders(Array.isArray(ordersData) ? ordersData : []);

                const restaurantsResponse = await fetch(`${BASE_URL}/api/restaurants`);
                if (restaurantsResponse.ok) {
                    const restaurantsData = await restaurantsResponse.json();
                    setRestaurants(restaurantsData);
                }

            } catch (err) {
                setError('אירעה שגיאה בטעינת היסטוריית ההזמנות.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrdersAndRestaurants();
    }, [token]);

    if (isLoading) {
        return (
            <View style={styles.centerState}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={{ marginTop: 10 }}>טוען היסטוריית הזמנות...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerState}>
                <Text style={{ color: '#e74c3c', fontSize: 16 }}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Stack.Screen options={{ title: 'היסטוריית הזמנות', headerTitleAlign: 'center' }} />
            
            <Text style={styles.pageTitle}>היסטוריית ההזמנות שלי</Text>

            {orders.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>עדיין לא ביצעת הזמנות</Text>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/')}>
                        <Text style={styles.actionBtnText}>התחל להזמין</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ gap: 15 }}>
                    {[...orders].reverse().map((order) => (
                        <View key={order.id || order._id} style={styles.orderCard}>
                            <View>
                                <Text style={styles.restaurantName}>{order.restaurantID?.name || 'מסעדה לא ידועה'}</Text>
                                <Text style={styles.orderMeta}>
                                    הזמנה מס' {String(order.id || order._id).slice(-6).toUpperCase()}
                                </Text>
                                <Text style={styles.orderMeta}>
                                    {order.productsIDs?.length || 0} פריטים
                                </Text>
                                <Text style={styles.orderTotal}>₪{order.totalPrice}</Text>
                            </View>

                            <View style={styles.buttonsRow}>
                                <TouchableOpacity style={styles.viewBtn} onPress={() => router.push(`/orders/${order.id || order._id}` as any)}>
                                    <Text style={styles.viewBtnText}>צפה בפירוט</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteOrder(order.id || order._id)}>
                                    <Text style={styles.deleteBtnText}>בטל הזמנה</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}