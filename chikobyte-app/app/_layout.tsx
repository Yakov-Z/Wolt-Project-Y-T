import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { TouchableOpacity, Text } from 'react-native';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
      <AuthProvider>
    <Stack screenOptions={{
          headerRight: () => (
              <TouchableOpacity 
                  onPress={() => router.push('/menu')} 
                  style={{ padding: 10, marginRight: 10 }}
              >
                  <Text style={{ fontSize: 26, color: '#0498d7' }}>☰</Text>
              </TouchableOpacity>
          )
      }}>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="menu" 
        options={{ 
          presentation: 'modal', 
          title: 'Menu' 
        }} 
      />
    </Stack>
    </AuthProvider>
    </CartProvider>
    </ThemeProvider>
  );
}
