import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Image,
  Alert
} from 'react-native';
import { useRouter,Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
// Import context and components
import { useAuth } from '../context/AuthContext';
import CustomInputBox from '../components/CustomInputBox';
import { styles } from '../styles/createRestaurant.styles';

// All the notes in the code should be in English
export default function AddRestaurantScreen() {
  const router = useRouter();
  // Retrieve token and user details from our global state
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    street: '',
    number: '',
    latitude: '',
    longitude: '',
    category: '',
    kosher: false
  });
  
  const [imageText, setImageText] = useState<string | null>(null);
  const [logoText, setLogoText] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  // Update specific field and clear its error
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  // Generic function to pick an image for either main image or logo
  const pickImage = async (isLogo: boolean) => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: isLogo ? [1, 1] : [4, 3], // Logos are usually square (1:1)
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
      if (isLogo) {
        setLogoText(base64String);
        if (errors.logo) setErrors((prev: any) => ({ ...prev, logo: null }));
      } else {
        setImageText(base64String);
        if (errors.image) setErrors((prev: any) => ({ ...prev, image: null }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!token || !user) {
      Alert.alert("שגיאה", "אינך מחובר למערכת.");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      image: imageText,
      logo: logoText,
      owner: user, // Passed directly from the Context
      address: {
        city: formData.city,
        street: formData.street,
        number: formData.number,
        latitude: formData.latitude,
        longitude: formData.longitude
      },
      category: formData.category,
      kosher: formData.kosher
    };

    try {
      const SERVER_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
      
      const response = await fetch(`${SERVER_URL}/api/restaurants/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Secure the request
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          Alert.alert("שגיאה", data.message || "אירעה שגיאה ביצירת המסעדה");
        }
        return; 
      }

      // Redirect to home page after successful creation       
      router.replace('/(tabs)'); 
    } catch (error) {
      console.error('Error during creation:', error);
      Alert.alert("שגיאת רשת", "לא ניתן להתחבר לשרת.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Stack.Screen 
          options={{ 
            title: 'יצירת מסעדה',
            headerTitleAlign: 'center',
            headerTintColor: '#00c2e8',
          }}
        />
        
        <Text style={styles.brandName}>Chikobyte</Text>
        <Text style={styles.title}>זה הזמן שלך לכבוש את הארץ! הוסף את המסעדה החדשה שלך:</Text>
        
        <CustomInputBox 
          text="שם מסעדה:"
          value={formData.name}
          onChangeText={(val) => handleChange('name', val)}
          errorMessage={errors.name}
        />
        
        <CustomInputBox 
          text="תיאור מסעדה:"
          value={formData.description}
          onChangeText={(val) => handleChange('description', val)}
          errorMessage={errors.description}
        />

        {/* Logo Picker */}
        <TouchableOpacity style={styles.imagePickerContainer} onPress={() => pickImage(true)}>
          <View style={styles.imagePickerButton}>
            <Text style={{fontWeight: 'bold'}}>בחר קובץ</Text>
          </View>
          <Text style={styles.imagePickerText} numberOfLines={1}>
            {logoText ? 'לוגו נבחר בהצלחה' : 'לוגו...'}
          </Text>
        </TouchableOpacity>
        {errors.logo && <Text style={styles.errorText}>{errors.logo}</Text>}
        {logoText && <Image source={{ uri: logoText }} style={[styles.previewImage, { height: 100 }]} />}

        {/* Main Image Picker */}
        <TouchableOpacity style={styles.imagePickerContainer} onPress={() => pickImage(false)}>
          <View style={styles.imagePickerButton}>
            <Text style={{fontWeight: 'bold'}}>בחר קובץ</Text>
          </View>
          <Text style={styles.imagePickerText} numberOfLines={1}>
            {imageText ? 'תמונה נבחרה בהצלחה' : 'תמונה...'}
          </Text>
        </TouchableOpacity>
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        {imageText && <Image source={{ uri: imageText }} style={styles.previewImage} />}

        <CustomInputBox 
          text="קטגוריה:"
          value={formData.category}
          onChangeText={(val) => handleChange('category', val)}
          errorMessage={errors.category}
        />

        {/* Kosher Checkbox */}
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          activeOpacity={0.8}
          onPress={() => handleChange('kosher', !formData.kosher)}
        >
          <Text style={styles.checkboxLabel}>מסעדה כשרה?</Text>
          <View style={[styles.checkbox, formData.kosher && styles.checkboxChecked]}>
            {formData.kosher && <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>}
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>כתובת:</Text>
        
        <CustomInputBox 
          text="עיר:"
          value={formData.city}
          onChangeText={(val) => handleChange('city', val)}
          errorMessage={errors['address'] ? " " : null}
        />
        <CustomInputBox 
          text="רחוב:"
          value={formData.street}
          onChangeText={(val) => handleChange('street', val)}
          errorMessage={errors['address'] ? " " : null}
        />
        <CustomInputBox 
          text="מספר בית:"
          value={formData.number}
          onChangeText={(val) => handleChange('number', val)}
          errorMessage={errors['address'] ? " " : null}
          keyboardType="numeric"
        />
        <CustomInputBox 
          text="קו אורך:"
          value={formData.longitude}
          onChangeText={(val) => handleChange('longitude', val)}
          errorMessage={errors['address'] ? " " : null}
          keyboardType="numeric"
        />
        <CustomInputBox 
          text="קו רוחב:"
          value={formData.latitude}
          onChangeText={(val) => handleChange('latitude', val)}
          errorMessage={errors['address']}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>צור מסעדה</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}