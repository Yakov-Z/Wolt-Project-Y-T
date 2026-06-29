import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Image 
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../styles/register.styles';
import CustomInputBox from '../components/CustomInputBox';
import { BASE_URL } from '../config/apiConfig';

export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '', 
    realname: '',
    phonenumber: '',
    mail: '',
    isadmin: false,
    city: '',
    street: '',
    number: '',
    latitude: '',
    longitude: ''
  });
  
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  // Dynamic state update handling clearing errors
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  // Pick an image from the mobile device using Expo Image Picker
  const pickImage = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true, 
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      // Add data URI prefix so the web/server logic still understands it
      const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImageBase64(base64String);
      
      // Fixed the TypeScript error by defining prev as any
      if (errors.image) setErrors((prev: any) => ({ ...prev, image: null }));
    }
  };

  // Perform strict validations required by the assignment
  const validateForm = () => {
    let newErrors: any = {};
    let isValid = true;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
      isValid = false;
    }

    if (formData.mail && !/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = 'כתובת אימייל אינה תקינה';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Stop if local validation fails

    const payload = {
      username: formData.username,
      password: formData.password,
      realname: formData.realname,
      phonenumber: formData.phonenumber,
      mail: formData.mail,
      image: imageBase64,
      isadmin: formData.isadmin,
      address: {
        city: formData.city,
        street: formData.street,
        number: formData.number,
        latitude: formData.latitude || "0",
        longitude: formData.longitude || "0"
      }
    };

    try {      
      const response = await fetch(`${BASE_URL}/api/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(`Error: ${data.message}`);
        }
        return;
      }

      // Redirect to home/tabs page after successful registration
      router.replace('/(tabs)'); 
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Network error.');
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
            title: 'הרשמה',
            headerTitleAlign: 'center',
            headerTintColor: '#00c2e8',
          }} 
        />
        
        <Text style={styles.brandName}>Chikobyte</Text>
        <Text style={styles.title}>פתח חשבון חדש ב-Chikobyte</Text>
        
        <CustomInputBox 
          text="שם משתמש:" 
          value={formData.username} onChangeText={(val) => handleChange('username', val)} 
          errorMessage={errors.username} 
        />
        
        <CustomInputBox 
          text="סיסמה:" 
          value={formData.password} onChangeText={(val) => handleChange('password', val)} 
          errorMessage={errors.password} secureTextEntry={true} 
        />
        
        <CustomInputBox 
          text="וידוא סיסמה:" 
          value={formData.confirmPassword} onChangeText={(val) => handleChange('confirmPassword', val)} 
          errorMessage={errors.confirmPassword} secureTextEntry={true} 
        />
        
        <CustomInputBox 
          text="שם מלא:" 
          value={formData.realname} onChangeText={(val) => handleChange('realname', val)} 
          errorMessage={errors.realname} 
        />
        
        <CustomInputBox 
          text="מספר טלפון:" 
          value={formData.phonenumber} onChangeText={(val) => handleChange('phonenumber', val)} 
          errorMessage={errors.phonenumber} keyboardType="phone-pad" 
        />
        
        <CustomInputBox 
          text="דואר אלקטרוני:" 
          value={formData.mail} onChangeText={(val) => handleChange('mail', val)} 
          errorMessage={errors.mail} keyboardType="email-address" 
        />

        {/* Custom React Native Checkbox approach */}
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          activeOpacity={0.8}
          onPress={() => handleChange('isadmin', !formData.isadmin)}
        >
          <Text style={styles.checkboxLabel}>מסעדנ/ית?</Text>
          <View style={[styles.checkbox, formData.isadmin && styles.checkboxChecked]}>
            {formData.isadmin && <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Custom Image Picker UI */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>תמונה:</Text>
          <TouchableOpacity style={[styles.imagePickerContainer, errors.image && styles.inputErrorBorder]} onPress={pickImage}>
            <View style={styles.imagePickerButton}>
              <Text style={{fontWeight: 'bold'}}>בחר תמונה</Text>
            </View>
            <Text style={styles.imagePickerText} numberOfLines={1}>
              {imageBase64 ? 'תמונה נבחרה בהצלחה' : 'לא נבחרה תמונה...'}
            </Text>
          </TouchableOpacity>
          {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
          
          {/* Display chosen image preview */}
          {imageBase64 && <Image source={{ uri: imageBase64 }} style={styles.previewImage} />}
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>כתובת:</Text>
        
        <CustomInputBox 
          text="עיר:" 
          value={formData.city} onChangeText={(val) => handleChange('city', val)} 
          errorMessage={errors.address? " ": null} 
        />
        <CustomInputBox 
          text="רחוב:" 
          value={formData.street} onChangeText={(val) => handleChange('street', val)} 
          errorMessage={errors.address? " ": null} 
        />
        <CustomInputBox 
          text="מספר בית:" 
          value={formData.number} onChangeText={(val) => handleChange('number', val)} 
          errorMessage={errors.address? " ": null} keyboardType="numeric" 
        />
        <CustomInputBox 
          text="קו אורך:" 
          value={formData.longitude} onChangeText={(val) => handleChange('longitude', val)} 
          errorMessage={errors.address? " ": null} keyboardType="numeric" 
        />
        <CustomInputBox 
          text="קו רוחב:" 
          value={formData.latitude} onChangeText={(val) => handleChange('latitude', val)} 
          errorMessage={errors.address} keyboardType="numeric" 
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>הרשם</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}