import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image,
  StyleSheet
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../context/AuthContext';
import { BASE_URL } from '../../../config/apiConfig';
import { styles } from '../../../styles/product.styles'; 

export default function AddProductScreen() {
    const { id } = useLocalSearchParams(); 
    const router = useRouter();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: ''
    });
    const [imageText, setImageText] = useState<string | null>(null);
    const [errors, setErrors] = useState<any>({});

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
            Alert.alert("שגיאה", "אינך מחובר למערכת.");
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
            const response = await fetch(`${BASE_URL}/api/restaurants/${id}/products/`, {
                method: 'POST',
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
                    Alert.alert("שגיאה", data.error || "אירעה שגיאה בהוספת המנה");
                }
                return;
            }

            Alert.alert("הצלחה", "המנה נוספה בהצלחה!");
            router.replace('/(tabs)'); 

        } catch (error) {
            console.error('Error adding product:', error);
            Alert.alert("שגיאה", 'שגיאת תקשורת עם השרת.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Stack.Screen 
                options={{ 
                    title: 'הוספת מנה',
                    headerTitleAlign: 'center',
                    headerTintColor: '#00c2e8',
                }} 
            />
            
            <Text style={styles.title}>הוספת מנה לתפריט</Text>
            
            <View style={styles.formContainer}>
                <Text style={styles.label}>שם המנה</Text>
                <TextInput 
                    style={[styles.input, errors.name && styles.inputError]} 
                    value={formData.name} 
                    onChangeText={(val) => handleChange('name', val)} 
                    placeholder="למשל: המבורגר הבית"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <Text style={styles.label}>תיאור המנה</Text>
                <TextInput 
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }, errors.description && styles.inputError]} 
                    value={formData.description} 
                    onChangeText={(val) => handleChange('description', val)} 
                    placeholder="מה המרכיבים המרכזיים במנה..."
                    multiline
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                <Text style={styles.label}>מחיר (₪)</Text>
                <TextInput 
                    style={[styles.input, errors.price && styles.inputError]} 
                    value={formData.price} 
                    onChangeText={(val) => handleChange('price', val)} 
                    placeholder="0.00"
                    keyboardType="numeric"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                <Text style={styles.label}>קטגוריה</Text>
                <TextInput 
                    style={[styles.input, errors.category && styles.inputError]} 
                    value={formData.category} 
                    onChangeText={(val) => handleChange('category', val)} 
                    placeholder="למשל: עיקריות, שתייה"
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
                <Text style={styles.submitBtnText}>הוסף מנה לתפריט</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}