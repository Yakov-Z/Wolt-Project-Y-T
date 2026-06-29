import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../../context/AuthContext';
import { BASE_URL } from '../../../../config/apiConfig';
import { styles } from '../../../../styles/product.styles';

export default function UpdateProductScreen() {
    const { id, productId } = useLocalSearchParams(); 
    const router = useRouter();
    const { user, token } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: ''
    });
    
    const [imageText, setImageText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/restaurants/${id}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.owner && data.owner._id !== user?.id && data.owner.id !== user?.id) {
                        Alert.alert("שגיאה", "אין לך הרשאה לערוך מנות במסעדה זו.");
                        router.back();
                        return;
                    }
                    
                    const productToUpdate = data.menu.find((p: any) => p._id === productId || p.id === productId);
                    
                    if (productToUpdate) {
                        setFormData({
                            name: productToUpdate.name || productToUpdate.productName || '',
                            description: productToUpdate.description || '',
                            category: productToUpdate.category || '',
                            price: productToUpdate.price?.toString() || ''
                        });
                        setImageText(productToUpdate.image || null);
                    } else {
                        Alert.alert("שגיאה", "המנה לא נמצאה בתפריט.");
                        router.back();
                    }
                } else {
                    Alert.alert("שגיאה", "שגיאה בטעינת נתוני המסעדה.");
                }
            } catch (err) {
                console.error("Error fetching product details", err);
                Alert.alert("שגיאה", "שגיאת תקשורת מול השרת.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id && productId) fetchProductData();
    }, [id, productId]);

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: null }));
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets[0].base64) {
            setImageText(`data:image/jpeg;base64,${result.assets[0].base64}`);
            if (errors.image) setErrors((prev: any) => ({ ...prev, image: null }));
        }
    };

    const handleSubmit = async () => {
        if (!token) {
            Alert.alert("שגיאה", 'לא נמצא אימות. אנא התחבר מחדש.');
            return;
        }

        const payload = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: Number(formData.price),
            image: imageText
        };
        
        try {
            const response = await fetch(`${BASE_URL}/api/restaurants/${id}/products/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    Alert.alert("שגיאה", data.error || data.message || "שגיאה בעדכון");
                }
                return;
            }

            Alert.alert("הצלחה", "המנה עודכנה בהצלחה!");
            router.replace('/(tabs)'); 

        } catch (error) {
            console.error('Error during update:', error);
            Alert.alert("שגיאה", "אירעה שגיאה בעת ניסיון העדכון.");
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#00c2e8" />
                <Text style={{ marginTop: 10 }}>טוען פרטי מנה...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Stack.Screen 
                options={{ 
                    title: 'עדכון מנה',
                    headerTitleAlign: 'center',
                    headerTintColor: '#00c2e8',
                }} 
            />
            
            <Text style={styles.title}>עדכון פרטי מנה</Text>
            
            <View style={styles.formContainer}>
                <Text style={styles.label}>שם המנה</Text>
                <TextInput 
                    style={[styles.input, errors.name && styles.inputError]} 
                    value={formData.name} 
                    onChangeText={(val) => handleChange('name', val)} 
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <Text style={styles.label}>תיאור המנה</Text>
                <TextInput 
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }, errors.description && styles.inputError]} 
                    value={formData.description} 
                    onChangeText={(val) => handleChange('description', val)} 
                    multiline
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                <Text style={styles.label}>מחיר (₪)</Text>
                <TextInput 
                    style={[styles.input, errors.price && styles.inputError]} 
                    value={formData.price} 
                    onChangeText={(val) => handleChange('price', val)} 
                    keyboardType="numeric"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                <Text style={styles.label}>קטגוריה</Text>
                <TextInput 
                    style={[styles.input, errors.category && styles.inputError]} 
                    value={formData.category} 
                    onChangeText={(val) => handleChange('category', val)} 
                />
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

                <Text style={styles.label}>תמונת המנה</Text>
                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                    <Text style={styles.imagePickerText}>{imageText ? 'תמונה נבחרה (לחץ להחלפה)' : 'בחר תמונה מהגלריה'}</Text>
                </TouchableOpacity>
                {imageText && <Image source={{ uri: imageText }} style={styles.previewImage} />}
                {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
            </View>
            
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>שמור שינויים במנה</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}