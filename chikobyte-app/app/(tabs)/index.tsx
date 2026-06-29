import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config/apiConfig';

// Internal component for displaying a single restaurant
const RestaurantCard = ({ restaurant }: { restaurant: any }) => { 
  const router = useRouter(); 
  
  return ( 
    // Navigate to the dynamic restaurant route when the card is pressed
    // Placeholder route until the final routing is implemented
    <TouchableOpacity onPress={() => router.push(`/restaurants/${restaurant._id || restaurant.id}` as any)}>
      
      {/* Display restaurant image if available */}
      {restaurant.image && <Image source={{ uri: restaurant.image }} />} 
      
      <View> 
        <View> 
          <Text>2h ago</Text> 
          <Text>{restaurant.trending ? "TRENDING" : ""}</Text> 
        </View> 
        
        {/* Fallback to title/content in case the DB still uses the old article schema */}
        <Text>{restaurant.name || restaurant.title}</Text> 
        
        {/* Limit the content preview to 2 lines */}
        <Text numberOfLines={2}>{restaurant.description || restaurant.content}</Text> 
        
        <View> 
          <Text>{restaurant.category || restaurant.author}</Text> 
        </View> 
      </View> 
    </TouchableOpacity> 
  ); 
};

export default function RestaurantMockScreen() { 
    const [restaurants, setRestaurants] = useState([]); 
    const { user } = useAuth();
    const router = useRouter(); 


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        
        const response = await fetch(`${BASE_URL}/api/restaurants/`);
        const data = await response.json();
          
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };    
    fetchRestaurants();
  }, []); 

  return ( 
    <View style={{ flex: 1 }}> 
      <FlatList 
        data={restaurants} 
        renderItem={({ item } : {item: any}) => ( 
          <RestaurantCard restaurant={item} /> 
        )} 
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} 
      /> 
      {user && user.isadmin && (
        <TouchableOpacity 
          onPress={() => router.push('/createRestaurant')}
          style={{
            position: 'absolute',
            bottom: 30,
            left: 20, // Bottom-left corner for RTL
            backgroundColor: '#00c2e8',
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 30,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>הוסף מסעדה</Text>
        </TouchableOpacity>
      )}
    </View> 
  ); 
}