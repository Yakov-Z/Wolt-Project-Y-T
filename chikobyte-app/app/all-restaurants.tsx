import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Platform,
    ScrollView
} from 'react-native';

import { useRouter } from 'expo-router';
import { BASE_URL } from '../config/apiConfig';

export default function AllRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isKosher, setIsKosher] = useState(false);
    
    const router = useRouter();

    const SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const restaurantsRes = await fetch(`${BASE_URL}/api/restaurants`);
                const categoriesRes = await fetch(`${BASE_URL}/api/restaurants/category`);
                
                const restaurantsData = await restaurantsRes.json();
                const categoriesData = await categoriesRes.json();
                
                setRestaurants(restaurantsData);
                setFilteredRestaurants(restaurantsData);
                setCategories(['All', ...categoriesData]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let temp = restaurants;

        if (selectedCategory !== 'All') {
            temp = temp.filter(restaurant => {
                return restaurant.category?.toLowerCase() === selectedCategory.toLowerCase();
            });
        }
        
        if (isKosher === true) {
            temp = temp.filter(restaurant => {
                return restaurant.kosher === true;
            });
        }

        setFilteredRestaurants(temp);
    }, [selectedCategory, isKosher, restaurants]);

    
    const kosherButtonText = isKosher ? "כל המסעדות" : "צדיק! תלחץ בשביל מסעדות כשרות";

    
    const renderRestaurant = ({ item: restaurant }) => (
        <TouchableOpacity 
            style={styles.restaurantCard}
            onPress={() => router.push(`/restaurants/${restaurant.id || restaurant._id}`)}
            activeOpacity={0.9}
        >
            <View style={styles.cardImageContainer}>
                <Image 
                    source={{ uri: restaurant.image }} 
                    style={styles.restaurantImage} 
                />
                {restaurant.logo && (
                    <Image 
                        source={{ uri: restaurant.logo }} 
                        style={styles.restaurantLogo} 
                    />
                )}
            </View>
        
            <View style={styles.cardContent}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                        {restaurant.name}
                    </Text>
                </View>
                <Text style={styles.categoryText}>{restaurant.category}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            
           
            <View style={styles.filtersContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersScroll}
                >
                    {categories.map(cat => {
                        const isActive = selectedCategory === cat;
                        return (
                            <TouchableOpacity 
                                key={cat} 
                                style={[styles.filterBtn, isActive && styles.filterBtnActive]}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <Text style={[styles.filterBtnText, isActive && styles.filterBtnTextActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                    
                    
                    <TouchableOpacity 
                        style={[styles.filterBtn, styles.kosherBtn, isKosher && styles.filterBtnActive]}
                        onPress={() => setIsKosher(!isKosher)}
                    >
                        <Text style={[styles.filterBtnText, styles.kosherBtnText, isKosher && styles.filterBtnTextActive]}>
                            {kosherButtonText}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            
            <FlatList
                data={filteredRestaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => (item.id || item._id).toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    filtersContainer: {
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 15,
    },
    filtersScroll: {
        paddingHorizontal: 15,
        gap: 10, 
    },
    filterBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20, 
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#199cd3',
        marginRight: 10,
    },
    filterBtnActive: {
        backgroundColor: '#199cd3',
    },
    filterBtnText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#199cd3',
    },
    filterBtnTextActive: {
        color: 'white',
    },
    kosherBtn: {
        borderColor: '#28a745',
    },
    kosherBtnText: {
        color: '#28a745',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    restaurantCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 25,
        overflow: 'hidden',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cardImageContainer: {
        width: '100%',
        height: 180,
        position: 'relative',
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    restaurantLogo: {
        position: 'absolute',
        bottom: -25, 
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: '#fff',
        resizeMode: 'contain',
    },
    cardContent: {
        padding: 15,
        paddingTop: 30, 
    },
    cardTitleRow: {
        marginBottom: 5,
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
    },
    categoryText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'left',
    }
});