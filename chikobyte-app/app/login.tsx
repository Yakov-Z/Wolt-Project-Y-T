import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import CustomInputBox from '../components/CustomInputBox';
import { styles } from '../styles/register.styles';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleUsernameChange = (val: string) => {
    setUsername(val);
    if (usernameError) setUsernameError(null);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordError) setPasswordError(null);
  };


  const handleSubmit = async () => {
    try {
      const SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
      
      const response = await fetch(`${SERVER_URL}/api/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          setPasswordError(data.error); 
        } else {
          Alert.alert("שגיאה", "אירעה שגיאה כללית, אנא נסה שוב.");
        }
        return; 
      }

      console.log("Login successful!");

      const userWithOnlyVitalDetails = {
        id: data.user.id,
        realname: data.user.realname,
        address: data.user.address,
        isadmin: data.user.isadmin,
        image: data.user.image
      };
      
      login(userWithOnlyVitalDetails, data.token);

      router.replace('/(tabs)'); 

    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert("שגיאת רשת", "לא ניתן להתחבר לשרת.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.scrollContent, { justifyContent: 'center', flex: 1 }]}>
        <Stack.Screen 
          options={{ 
            title: 'התחברות',
            headerTitleAlign: 'center',
            headerTintColor: '#00c2e8',
          }} 
        />
        
        <Text style={styles.brandName}>Chikobyte</Text>
        <Text style={styles.title}>התחבר ל-Chikobyte כדי להתחיל לחגוג!</Text>
        
        <CustomInputBox 
          text="שם משתמש:"
          value={username}
          onChangeText={handleUsernameChange}
          errorMessage={usernameError}
        />
        
        <CustomInputBox 
          text="סיסמה:"
          value={password}
          onChangeText={handlePasswordChange}
          errorMessage={passwordError}
          secureTextEntry={true} 
        />
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>התחבר</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}