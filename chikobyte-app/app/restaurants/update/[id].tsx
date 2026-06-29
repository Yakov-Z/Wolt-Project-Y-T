import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
// Import context and components
import { useAuth } from '../../../context/AuthContext';
import CustomInputBox from '../../../components/CustomInputBox';
// Reusing the exact same styles from the create screen since the form is identical!
import { styles } from '../../../styles/createRestaurant.styles';
import { BASE_URL } from '../../../config/apiConfig';

// All the notes in the code should be in English
export default function UpdateRestaurantScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
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
  
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<any>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch existing restaurant data when the component mounts
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/restaurants/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          
          const ownerId = data.owner.id;
          const currentUserId = user?.id

          if (String(ownerId) !== String(currentUserId)) {
            console.error("Unauthorized: User is not the owner");
            Alert.alert("שגיאת הרשאה", "אין לך הרשאה לערוך מסעדה זו.");
            router.back();
            return;
          }
          
          // Populate form with existing data
          setFormData({
            name: data.name || '',
            category: data.category || '',
            description: data.description || '',
            kosher: data.kosher || false,
            city: data.address?.city || '',
            street: data.address?.street || '',
            number: data.address?.number?.toString() || '',
            latitude: data.address?.latitude?.toString() || '',
            longitude: data.address?.longitude?.toString() || ''
          });

          // Set existing images
          if (data.image) setImageText(data.image);
          if (data.logo) setLogoText(data.logo);
        } else {
          setFetchError("המסעדה לא נמצאה");
        }
      } catch (err) {
        console.error("Error fetching details", err);
        setFetchError("שגיאת רשת בטעינת הנתונים");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRestaurant();
    } else {
       // If user is null (the bug you mentioned), stop loading to show error
       setIsLoading(false);
       setFetchError("משתמש לא מחובר");
    }
  }, [id, user]);

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
      aspect: isLogo ? [1, 1] : [4, 3], 
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
      address: {
        city: formData.city,
        street: formData.street,
        number: formData.number,
        latitude: formData.latitude,
        longitude: formData.longitude
      },
      category: formData.category,
      kosher: formData.kosher,
      owner: { 
        id: user.id
      }
    };

    try {      
      const response = await fetch(`${BASE_URL}/api/restaurants/${id}`, {
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
          Alert.alert("שגיאה", data.message || "אירעה שגיאה בעדכון המסעדה");
        }
        return; 
      }

      Alert.alert("הצלחה", "המסעדה עודכנה בהצלחה!");
      router.push(`/(tabs)`); 
    } catch (error) {
      console.error('Error during update:', error);
      Alert.alert("שגיאת רשת", "לא ניתן להתחבר לשרת.");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00c2e8" />
        <Text>טוען נתונים...</Text>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>{fetchError}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Make the header look clean */}
        <Stack.Screen 
          options={{ 
            title: 'עדכון מסעדה',
            headerTitleAlign: 'center',
            headerTintColor: '#00c2e8',
          }} 
        />

        <Text style={styles.title}>ערוך את פרטי המסעדה שלך שיוצגו ללקוחות</Text>
        
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
            {logoText ? 'לוגו נטען / נבחר' : 'לוגו...'}
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
            {imageText ? 'תמונה נטענה / נבחרה' : 'תמונה...'}
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
          errorMessage={errors['address.city']}
        />
        <CustomInputBox 
          text="רחוב:"
          value={formData.street}
          onChangeText={(val) => handleChange('street', val)}
          errorMessage={errors['address.street']}
        />
        <CustomInputBox 
          text="מספר בית:"
          value={formData.number}
          onChangeText={(val) => handleChange('number', val)}
          errorMessage={errors['address.number']}
          keyboardType="numeric"
        />
        <CustomInputBox 
          text="קו אורך:"
          value={formData.longitude}
          onChangeText={(val) => handleChange('longitude', val)}
          errorMessage={errors['address.longitude']}
          keyboardType="numeric"
        />
        <CustomInputBox 
          text="קו רוחב:"
          value={formData.latitude}
          onChangeText={(val) => handleChange('latitude', val)}
          errorMessage={errors['address.latitude']}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>שמור שינויים</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}