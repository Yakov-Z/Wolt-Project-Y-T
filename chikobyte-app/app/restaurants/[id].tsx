import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
// import { useCart } from '../../context/CartContext'; 
import UserDetailItem from '../../components/UserDetailItem'; // Reusing the detail row component
import { styles } from '../../styles/restaurant.styles';
import { BASE_URL } from '../../config/apiConfig';

export default function RestaurantScreen() {
  const router = useRouter();
  // Extract the dynamic ID from the URL path
  const { id } = useLocalSearchParams();
  
  // Pull current user and token from Context
  const { user, token } = useAuth();
  // const { addToCart } = useCart();
  
  const [fullRestaurantData, setFullRestaurantData] = useState<any>(null);  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/restaurants/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
          setFullRestaurantData(data);
        } else {
          setError(data.error || 'שגיאה בטעינת נתוני המסעדה');
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError('אירעה שגיאת רשת בעת בקשת הנתונים');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  // Handle the deletion of the entire restaurant using React Native's Alert API
  const handleDeleteRestaurant = () => {
    Alert.alert(
      "מחיקת מסעדה",
      "האם אתה בטוח שברצונך למחוק מסעדה זו? פעולה זו אינה ניתנת לביטול.",
      [
        { text: "ביטול", style: "cancel" },
        { 
          text: "מחק", 
          style: "destructive", 
          onPress: async () => {
            if (!token) {
              Alert.alert('שגיאה', 'אינך מחובר למערכת.');
              return;
            }

            try {
              const response = await fetch(`${BASE_URL}/api/restaurants/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });

              if (response.ok) {
                Alert.alert("הצלחה", "המסעדה נמחקה בהצלחה.");
                // Redirect back to the main tabs after successful deletion
                router.replace('/(tabs)'); 
              } else {
                const data = await response.json();
                Alert.alert("שגיאה במחיקה", data.error || 'Failed to delete restaurant');
              }
            } catch (err) {
              console.error("Error deleting restaurant:", err);
              Alert.alert("שגיאה", "אירעה שגיאת תקשורת בעת המחיקה.");
            }
          }
        }
      ]
    );
  };

  // Handle the deletion of a specific product from the menu
  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "מחיקת מנה",
      "האם אתה בטוח שברצונך למחוק מנה זו מהתפריט?",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: async () => {
            if (!token) {
              Alert.alert('שגיאה', 'אינך מחובר למערכת.');
              return;
            }

            try {
              const SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
              const response = await fetch(`${SERVER_URL}/api/restaurants/${id}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });

              if (response.ok) {
                // Update local state to remove the deleted product without refetching everything
                setFullRestaurantData((prev: any) => ({
                  ...prev,
                  menu: prev.menu.filter((product: any) => product.id !== productId && product._id !== productId)
                }));
              } else {
                const data = await response.json();
                Alert.alert("שגיאה במחיקה", data.error || 'Failed to delete product');
              }
            } catch (err) {
              console.error("Error deleting product:", err);
              Alert.alert("שגיאה", "אירעה שגיאת תקשורת בעת המחיקה.");
            }
          }
        }
      ]
    );
  };
  // --- DEBUGGING OWNER ---
  console.log("1. Current User (from Context):", user);
  console.log("2. Restaurant Owner Data (from Server):", fullRestaurantData?.owner);
  console.log("-----------------------");
  // Helper check to verify if the current user is the owner
  const isOwner = user && user.isadmin && user.id === fullRestaurantData?.owner?.id;

  if (isLoading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="large" color="#00c2e8" />
        <Text style={{ marginTop: 10 }}>טוען נתוני מסעדה...</Text>
      </View>
    );
  }
    
  if (error || !fullRestaurantData) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.errorText}>{error || "לא נמצאה מסעדה"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Stack.Screen 
          options={{ 
            title: 'דף מסעדה',
            headerTitleAlign: 'center',
            headerTintColor: '#00c2e8',
          }} 
        />
      
      {/* Header Image */}
      {fullRestaurantData.image ? (
        <Image 
          source={{ uri: fullRestaurantData.image }} 
          style={styles.headerImage} 
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImagePlaceholder}>
          <Text style={{ color: '#6c757d', fontSize: 18 }}>אין תמונה למסעדה זו</Text>
        </View>
      )}
      
      {/* Restaurant Title & Badges */}
      <Text style={styles.restaurantName}>{fullRestaurantData.name}</Text>
      
      <View style={styles.badgesContainer}>
        <View style={styles.categoryBadge}>
          <Text style={styles.badgeText}>{fullRestaurantData.category}</Text>
        </View>
        {fullRestaurantData.kosher && (
          <View style={styles.kosherBadge}>
            <Text style={styles.badgeText}>כשר</Text>
          </View>
        )}
      </View>
      
      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.descriptionText}>
          {fullRestaurantData.description}
        </Text>
        
        {fullRestaurantData.address && (
          <UserDetailItem 
            label="כתובת" 
            value={`${fullRestaurantData.address.street} ${fullRestaurantData.address.number}, ${fullRestaurantData.address.city}`} 
          />
        )}
      </View>

      {/* Menu Header */}
      <View style={styles.menuHeaderRow}>
        <Text style={styles.menuTitle}>תפריט המסעדה</Text>
        
        {isOwner && (
          <TouchableOpacity 
            style={styles.categoryBadge} // Reusing the blue badge style for the button
            onPress={() => router.push(`/restaurants/${id}/addProduct` as any)}
          >
            <Text style={styles.badgeText}>הוסף מנה</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Menu Items Grid */}
      {!fullRestaurantData.menu || fullRestaurantData.menu.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>אין כרגע מנות בתפריט.</Text>
      ) : (
        <View style={styles.menuGrid}>
          {fullRestaurantData.menu.map((product: any, index: number) => (
            <View key={index} style={styles.productCard}>
              
              <View>
                {product.image && (
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                )}
                <Text style={styles.productName} numberOfLines={1}>
                  {product.productName || product.name}
                </Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.description}
                </Text>
              </View>
              
              <View>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>₪{product.price}</Text>
                  <TouchableOpacity 
                    style={styles.addToCartButton}
                    onPress={() => {
                      // addToCart(product, fullRestaurantData)
                      Alert.alert("הוסף לעגלה", "פונקציונליות זו בבנייה");
                    }}
                  >
                    <Text style={styles.addToCartText}>הוסף לעגלה</Text>
                  </TouchableOpacity>
                </View>

                {isOwner && (
                  <View style={styles.adminButtonsRow}>
                    <TouchableOpacity 
                      style={styles.adminUpdateBtn}
                      onPress={() => router.push(`/restaurants/${id}/updateProduct/${product.id || product._id}` as any)}
                    >
                      <Text style={styles.adminBtnText}>עדכן מנה</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.adminDeleteBtn}
                      onPress={() => handleDeleteProduct(product.id || product._id)}
                    >
                      <Text style={styles.adminBtnText}>מחק מנה</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Admin Action Buttons */}
      {isOwner && (
        <View style={{ marginTop: 20, marginBottom: 40, gap: 10 }}>
          <TouchableOpacity 
            style={[styles.categoryBadge, { alignItems: 'center', paddingVertical: 12 }]}
            onPress={() => router.push(`/restaurants/update/${id}` as any)}
          >
            <Text style={[styles.badgeText, { fontSize: 16 }]}>ערוך פרטי מסעדה</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryBadge, { backgroundColor: '#dc3545', alignItems: 'center', paddingVertical: 12 }]}
            onPress={handleDeleteRestaurant}
          >
            <Text style={[styles.badgeText, { fontSize: 16 }]}>מחק מסעדה</Text>
          </TouchableOpacity>
        </View>
      )}
      
    </ScrollView>
  );
}