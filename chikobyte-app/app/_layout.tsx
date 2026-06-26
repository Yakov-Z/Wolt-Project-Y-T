import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
    <Stack>
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
    </ThemeProvider>
  );
}
