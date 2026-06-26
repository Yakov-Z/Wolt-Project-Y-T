import { Tabs, useRouter } from 'expo-router'; 
import { View, Text, Image, TouchableOpacity } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { styles } from '../../styles/tabs._layout.styles'; 

export default function TabsLayout() { 
  const router = useRouter();

  return ( 
    <View style={styles.wrapper}> 
      <SafeAreaView style={styles.headerContainer} edges={['top']}> 
        <View style={styles.headerContent}> 
          <Text style={styles.logoText}>Chikobyte</Text> 
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <Text style={{ fontSize: 24, paddingHorizontal: 10 }}>☰</Text>
          </TouchableOpacity>
        </View> 
      </SafeAreaView> 
      <Tabs screenOptions={{ headerShown: false }}> 
        <Tabs.Screen name="index" options={{ 
          tabBarLabel: 'Restaurants', 
          tabBarIcon: ({ color, size }) => ( 
            <Image 
              source={require('../../assets/images/restaurant-icon.png')} 
              style={{ width: size, height: size, tintColor: color }} 
            /> 
          ), 
        }} /> 
        <Tabs.Screen name="cart" options={{ 
          tabBarLabel: 'Cart', 
          tabBarIcon: ({ color, size }) => ( 
            <Image 
              source={require('../../assets/images/cart-icon.png')} 
              style={{ width: size, height: size, tintColor: color }} 
            /> 
          ),
        }} />
      </Tabs> 
    </View>
  );
}