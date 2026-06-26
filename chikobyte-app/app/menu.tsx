import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
// Import the separated styles file
import { styles } from '../styles/menu.styles';
import { useAuth } from '../context/AuthContext';

// All the notes in the code should be in English
export default function MenuScreen() {
  // Hook to handle navigation between screens
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/(tabs)');
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
          options={{ 
            title: 'תפריט אפשרויות',
            headerTitleAlign: 'center',
            headerTintColor: '#00c2e8',
          }} 
        />
        
        {user ? (
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: user.image ? user.image : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} 
            style={styles.avatar}
          />
          <Text style={styles.userName}>שלום, {user.realname}!</Text>
        </View>
      ) : null}

      <View style={styles.optionsContainer}>
        {user ? (
          <>
            <TouchableOpacity style={styles.optionButton} onPress={() => router.push('/profile')}>
              <Text style={styles.optionText}>אזור אישי</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
              <Text style={[styles.optionText, styles.logoutText]}>התנתקות</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.optionButton} onPress={() => router.push('/login')}>
              <Text style={styles.optionText}>התחבר</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.optionButton} onPress={() => router.push('/register')}>
              <Text style={styles.optionText}>הירשם</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}