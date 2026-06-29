import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Platform,
    ScrollView,
    useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config/apiConfig';

export default function HomeScreen() {
    const [popularRestaurants, setPopularRestaurants] = useState([]);
    const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
    
    const { user } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'light';

    const SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

    useEffect(() => {
        const fetchPopularRestaurants = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/restaurants/popular`);
                if (response.ok) {
                    const data = await response.json();
                    setPopularRestaurants(data);
                }
            } catch (error) {
                console.error("Error: Please try again later", error);
            }
        };

        const fetchNearbyRestaurants = async () => {
    try {
        
        const requestHeaders = new Headers();
        if (user && user.id) {
            requestHeaders.append('userid', user.id);
        }
        
        
        const response = await fetch(`${BASE_URL}/api/restaurants/nearby`, { 
            method: 'GET',
            headers: requestHeaders 
        });

        if (response.ok) {
            const data = await response.json();
            setNearbyRestaurants(data);
        }
    } catch (error) {
        console.error("Error fetching nearby:", error);
    }
};
        
        fetchPopularRestaurants();
        fetchNearbyRestaurants();
    }, [user]);

    
    const themeStyles = isDarkMode ? darkStyles : lightStyles;

    
    const renderRestaurantCard = ({ item: restaurant }) => (
        <TouchableOpacity 
            style={[styles.restaurantCard, themeStyles.cardBackground]}
            onPress={() => router.push(`/restaurants/${restaurant.id || restaurant._id}`)}
            activeOpacity={0.9}
        >
            <View style={styles.cardImageContainer}>
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                {restaurant.logo && (
                    <Image source={{ uri: restaurant.logo }} style={[styles.restaurantLogo, themeStyles.logoBorder]} />
                )}
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.restaurantName, themeStyles.text]} numberOfLines={1}>
                    {restaurant.name}
                </Text>
                <Text style={[styles.categoryText, themeStyles.subText]}>{restaurant.category}</Text>
                
                {restaurant.distanceFromUser !== undefined && (
                    <Text style={styles.distanceText}>
                        📍 {restaurant.distanceFromUser} ק"מ ממך
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, themeStyles.container]} showsVerticalScrollIndicator={false}>
            
           
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, themeStyles.text]}>מסעדות קרובות אליך:</Text>
                </View>
                
                {!user && (
                    <View style={styles.promptContainer}>
                        <Text style={[styles.promptText, themeStyles.text]}>
                            רוצה מסעדות שמותאמות לכתובת האמיתית שלך?{' '}
                            <Text style={styles.linkText} onPress={() => router.push('/register')}>
                                תירשם
                            </Text>{' '}
                            ותגלה מה יש לסביבה שלך להציע!
                        </Text>
                    </View>
                )}

                {nearbyRestaurants.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={themeStyles.subText}>אין מסעדות... אולי תהיה הראשון שפותח אחת!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={nearbyRestaurants}
                        renderItem={renderRestaurantCard}
                        keyExtractor={(item) => `nearby-${item.id || item._id}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />
                )}
            </View>

            
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, themeStyles.text]}>המסעדות הפופולריות: גיוון זה אוברייטד</Text>
                </View>

                {popularRestaurants.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={themeStyles.subText}>כרגע עדיין אין מסעדות. מסעדנ/ית? הירשם ותגיע לעוד לקוחות!</Text>
                        {user && user.isadmin && (
                            <View style={styles.adminPrompt}>
                                <Text style={themeStyles.text}>רוצה לשווק את המסעדה המטורפת שלך?</Text>
                                <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/createRestaurant')}>
                                    <Text style={styles.primaryBtnText}>לחץ כאן להוספת הלהיט הבא</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ) : (
                    <FlatList
                        data={popularRestaurants}
                        renderItem={renderRestaurantCard}
                        keyExtractor={(item) => `popular-${item.id || item._id}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />
                )}
            </View>

            
            <View style={styles.bottomActions}>
                <TouchableOpacity 
                    style={styles.outlineBtn}
                    onPress={() => router.push('/all-restaurants')}
                >
                    <Text style={styles.outlineBtnText}>לצפייה בכל המסעדות לחץ כאן</Text>
                </TouchableOpacity>

                {user && user.isadmin ? (
                    <TouchableOpacity 
                        style={styles.primaryBtn}
                        onPress={() => router.push('/createRestaurant')}
                    >
                        <Text style={styles.primaryBtnText}>בעל מסעדה? רוצה לכבוש את המדינה? לחץ כאן!</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={[styles.bottomPromptText, themeStyles.text]}>
                        זכית במאסטר שף? רוצה לכבוש את המדינה?{' '}
                        <Text style={styles.linkText} onPress={() => router.push('/register')}>
                            תירשם
                        </Text>{' '}
                        ונתחיל שיתוף פעולה מהסרטים!
                    </Text>
                )}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    horizontalList: {
        paddingHorizontal: 20,
        gap: 15, 
    },
    restaurantCard: {
        width: 280, 
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginRight: 15,
        marginBottom: 10,
    },
    cardImageContainer: {
        height: 140,
        position: 'relative',
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
    },
    restaurantLogo: {
        position: 'absolute',
        bottom: -20,
        right: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
    },
    cardContent: {
        padding: 15,
        paddingTop: 25,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'left',
    },
    categoryText: {
        fontSize: 14,
        marginBottom: 8,
        textAlign: 'left',
    },
    distanceText: {
        fontSize: 13,
        color: '#666',
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'left',
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    adminPrompt: {
        alignItems: 'center',
        marginTop: 15,
    },
    promptContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    promptText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    bottomPromptText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    linkText: {
        color: '#007bff',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    bottomActions: {
        alignItems: 'center',
        gap: 15,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    primaryBtn: {
        backgroundColor: '#0498d7',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    primaryBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#199cd3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    outlineBtnText: {
        color: '#199cd3',
        fontWeight: 'bold',
        fontSize: 16,
    },
});


const lightStyles = StyleSheet.create({
    container: { backgroundColor: '#f9f9f9' },
    cardBackground: { backgroundColor: '#fff' },
    text: { color: '#333' },
    subText: { color: '#666' },
    logoBorder: { borderColor: '#fff' },
});


const darkStyles = StyleSheet.create({
    container: { backgroundColor: '#121111' },
    cardBackground: { backgroundColor: '#1e1e1e' },
    text: { color: '#f1f1f1' },
    subText: { color: '#aaa' },
    logoBorder: { borderColor: '#1e1e1e' },
});