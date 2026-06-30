import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config/apiConfig';
import { styles } from '../../styles/orders.styles';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user, token } = useAuth();
    const { loadOrderToCart } = useCart();
    
    const [OrderData, setOrderData] = useState<any>(null);
    const [RestaurantData, setRestaurantData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleEditOrder = () => {
        Alert.alert("מצב עריכת הזמנה 🛠️", "האם ברצונך להחליף למסעדה אחרת לגמרי, או לערוך את המנות מהמסעדה הנוכחית?", [
            { text: "בטל (חזור)", style: "cancel" },
            {
                text: "מסעדה חדשה",
                onPress: () => {
                    loadOrderToCart(OrderData._id || OrderData.id, [], null, 0);
                    router.push('/');
                }
            },
            {
                text: "ערוך נוכחית",
                onPress: () => {
                    const fullProductsToEdit = OrderData.productsIDs.map((product: any) => ({
                        ...product,
                        restaurantID: RestaurantData._id || RestaurantData.id
                    }));
                    
                    loadOrderToCart(OrderData._id || OrderData.id, fullProductsToEdit, RestaurantData, OrderData.totalPrice);
                    router.push(`/restaurants/${RestaurantData._id || RestaurantData.id}` as any);
                }
            }
        ]);
    };

    const handleDeleteOrder = () => {
        Alert.alert("ביטול הזמנה", "האם אתה בטוח שברצונך לבטל הזמנה זו? פעולה זו אינה ניתנת לביטול.", [
            { text: "חזור", style: "cancel" },
            {
                text: "מחק", style: "destructive",
                onPress: async () => {
                    if (!token) return;
                    try {
                        const response = await fetch(`${BASE_URL}/api/orders/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                        if (response.ok) { Alert.alert("הצלחה", "ההזמנה בוטלה בהצלחה."); router.push('/orders/history'); } 
                        else { Alert.alert("שגיאה", "שגיאה במחיקה"); }
                    } catch (err) { Alert.alert("שגיאה", "אירעה שגיאת תקשורת בעת המחיקה."); }
                }
            }
        ]);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!token) { setError('לא נמצא אסימון.'); setIsLoading(false); return; }
            try {
                const orderResponse = await fetch(`${BASE_URL}/api/orders/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                const orderResult = await orderResponse.json();
                if (orderResponse.status === 403 || (orderResult.userID && orderResult.userID !== user?.id)) {
                    Alert.alert("שגיאה", "אין לך הרשאה לצפות בהזמנה זו."); router.replace('/'); return; 
                }
                if (!orderResponse.ok) throw new Error(orderResult.error);
                setOrderData(orderResult);

                const actualRestaurantId = orderResult.restaurantID?._id || orderResult.restaurantID?.id || orderResult.restaurantID;

                const restResponse = await fetch(`${BASE_URL}/api/restaurants/${actualRestaurantId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const restResult = await restResponse.json();
                if (restResponse.ok) setRestaurantData(restResult);
                else throw new Error(restResult.error);
            } catch (err) { setError('אירעה שגיאת רשת בטעינת הנתונים'); } finally { setIsLoading(false); }
        };
        fetchData();
    }, [id, token]);

    if (isLoading) return <View style={styles.centerState}><ActivityIndicator size="large" /><Text>טוען פרטי הזמנה...</Text></View>;
    if (error) return <View style={styles.centerState}><Text style={{color: 'red'}}>{error}</Text></View>;
    if (!OrderData || !RestaurantData) return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Stack.Screen options={{ title: `הזמנה #${OrderData.id || OrderData._id}` }} />
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>הזמנה</Text>
                    
                    <Text style={{ color: 'white', fontSize: 20, marginTop: 5, textAlign: 'center', letterSpacing: 1 }}>
                        #{OrderData.id || OrderData._id}
                    </Text>
                    
                    <Text style={styles.headerSub}>מאת: {RestaurantData.name}</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>פירוט ההזמנה</Text>
                    <View style={styles.itemsList}>
                        {OrderData.productsIDs.map((product: any, index: number) => (
                            <View key={index} style={styles.itemRow}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.itemName}>{product.productName || product.name}</Text>
                                    {product.description && <Text style={styles.itemDesc} numberOfLines={2}>{product.description}</Text>}
                                </View>
                                <Text style={styles.itemPrice}>₪{product.price}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>סה"כ לתשלום</Text>
                        <Text style={styles.totalPrice}>₪{OrderData.totalPrice}</Text>
                    </View>
                    <View style={styles.actionsRowDetails}>
                        <TouchableOpacity style={styles.btnOutlinePrimary} onPress={() => router.push('/profile')}>
                            <Text style={styles.btnOutlinePrimaryText}>אזור אישי</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnOutlineWarning} onPress={handleEditOrder}>
                            <Text style={styles.btnOutlineWarningText}>ערוך הזמנה</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnOutlineDanger} onPress={handleDeleteOrder}>
                            <Text style={styles.btnOutlineDangerText}>מחק הזמנה</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}