import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ActivityIndicator, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { useRouter,Stack } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/profile.styles';
import UserDetailItem from '../components/UserDetailItem';
import { BASE_URL } from '../config/apiConfig';

export default function ProfileScreen() {
  const router = useRouter();
  // Pull the current user and token directly from our global state
  const { user, token } = useAuth();
  
  const [fullUserData, setFullUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      // If there's no token or user in the context, we can't fetch protected data
      if (!token || !user) {
        setError('שגיאה באסיפת הנתונים, נסה שנית.');
        setIsLoading(false);
        return;
      }

      try {
        const currentUserId = user.id || user._id;
        
        // --- הוסף את ההדפסות האלה כאן ---
        console.log("=== DEBUG INFO ===");
        console.log("1. The User Object from Context:", user);
        console.log("2. The Extracted ID:", currentUserId);
        console.log("3. The Fetch URL:", `${BASE_URL}/api/users/${currentUserId}`);
        console.log("4. Token exists?", !!token);
        console.log("==================");
        // ---------------------------------
        // Handle localhost on Android Emulator vs iOS/Web        
        const response = await fetch(`${BASE_URL}/api/users/${currentUserId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        const data = await response.json();

        if (response.ok) {
          setFullUserData(data);
        } else {
          setError(data.error || 'שגיאה בטעינת פרטי המשתמש');
        }
      } catch (err) {
        console.error("The REAL error is:", err);
        setError('אירעה שגיאת רשת בעת ניסיון ההתחברות לשרת');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user, token]);

  // Render loading state with React Native's built-in spinner
  if (isLoading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="large" color="#00c2e8" />
        <Text style={{ marginTop: 10 }}>טוען נתוני פרופיל...</Text>
      </View>
    );
  }

  // Render error state if something went wrong
  if (error || !fullUserData) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.errorText}>{error || "לא ניתן לטעון נתונים"}</Text>
        <TouchableOpacity style={styles.historyButton} onPress={() => router.back()}>
          <Text style={styles.historyButtonText}>חזור</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render the actual profile using the fresh data
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Stack.Screen 
          options={{ 
            title: 'פרופיל',
            headerTitleAlign: 'center',
            headerTintColor: '#00c2e8',
          }} 
        />
      <Text style={styles.title}>הפרופיל שלי</Text>
      
      {/* Centered Image Container */}
      <View style={styles.imageContainer}>
        {fullUserData.image ? (
          <Image 
            source={{ uri: fullUserData.image }} 
            style={styles.profileImage} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>אין תמונה</Text>
          </View>
        )}
      </View>
      
      {/* User Details Card */}
      <View style={styles.detailsCard}>
        <UserDetailItem label="שם מלא:" value={fullUserData.realname} />
        <UserDetailItem label="דוא״ל:" value={fullUserData.mail} />
        <UserDetailItem label="מספר טלפון:" value={fullUserData.phonenumber} />
        <UserDetailItem label="שם משתמש:" value={fullUserData.username} />
        <UserDetailItem label="סוג חשבון:" value={fullUserData.isadmin ? 'מסעדנ/ית' : 'משתמש רגיל'} />

        {fullUserData.address && (
          <UserDetailItem 
            label="כתובת מגורים:" 
            value={`${fullUserData.address.street} ${fullUserData.address.number}, ${fullUserData.address.city}`} 
          />
        )}

        <TouchableOpacity 
          style={styles.historyButton} 
          onPress={() => router.push('/orders/history')}
        >
          <Text style={styles.historyButtonText}>היסטוריית הזמנות</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}