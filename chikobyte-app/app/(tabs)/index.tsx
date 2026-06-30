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
    useColorScheme,
    TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config/apiConfig';

export default function HomeScreen() {
    const [popularRestaurants, setPopularRestaurants] = useState([]);
    const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
    
    const { user } = useAuth();
    const router = useRouter();
    const systemTheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

    const SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({ restaurants: [], products: [] });
    const [isSearching, setIsSearching] = useState(false);

        useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults({ restaurants: [], products: [] });
            return;
        }

        setIsSearching(true);

        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/search/${searchTerm}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data); 
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const hasResults = searchResults.restaurants.length > 0 || searchResults.products.length > 0;

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
            <View style={styles.themeToggleContainer}>
                <TouchableOpacity 
                    style={[styles.themeBtn, themeStyles.cardBackground]} 
                    onPress={() => setIsDarkMode(!isDarkMode)}
                >
                    <Text style={{ fontSize: 24 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
                </TouchableOpacity>
            </View>
           {/* --- אזור החיפוש --- */}
            <View style={styles.searchContainer}>
                <TextInput 
                    style={[styles.searchInput, themeStyles.cardBackground, themeStyles.text]}
                    placeholder="מה אוכלים היום? 🔍"
                    placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />

                {/* תצוגת תוצאות חיפוש */}
                {hasResults && (
                    <View style={[styles.searchResultsContainer, themeStyles.cardBackground]}>
                        
                        {/* מסעדות */}
                        {searchResults.restaurants.length > 0 && (
                            <View style={styles.searchSection}>
                                <Text style={styles.searchSectionTitle}>מסעדות:</Text>
                                {searchResults.restaurants.map((rest: any, index: number) => (
                                    <TouchableOpacity 
                                        key={`rest-${index}`} 
                                        style={styles.searchItem}
                                        onPress={() => router.push(`/restaurants/${rest.id || rest._id}`)}
                                    >
                                        <Text style={themeStyles.text}>🍽️ {rest.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* מנות */}
                        {searchResults.products.length > 0 && (
                            <View style={styles.searchSection}>
                                <Text style={styles.searchSectionTitle}>מנות:</Text>
                                {searchResults.products.map((prod: any, index: number) => (
                                    <TouchableOpacity 
                                        key={`prod-${index}`} 
                                        style={[styles.searchItem, { flexDirection: 'row-reverse', justifyContent: 'space-between' }]}
                                        onPress={() => router.push(`/restaurants/${prod.restaurantId}`)}
                                    >
                                        <Text style={themeStyles.text}>{prod.productName || prod.name} - {prod.restaurantName}</Text>
                                        <Text style={{ fontWeight: 'bold', color: '#0498d7' }}>₪{prod.price}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}
                
                {isSearching && (
                    <Text style={[themeStyles.subText, { textAlign: 'center', marginTop: 5 }]}>מחפש...</Text>
                )}
            </View>
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
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
        textAlign: 'center',
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
    themeToggleContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    themeBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        zIndex: 10, // גורם לתוצאות להופיע מעל אלמנטים אחרים
    },
    searchInput: {
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        textAlign: 'right', // כי אנחנו בעברית
    },
    searchResultsContainer: {
        marginTop: 10,
        borderRadius: 15,
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    searchSection: {
        marginBottom: 10,
    },
    searchSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 5,
        textAlign: 'right',
        paddingHorizontal: 10,
    },
    searchItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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