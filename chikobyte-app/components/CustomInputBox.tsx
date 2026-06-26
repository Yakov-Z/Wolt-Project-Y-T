import React from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import { styles } from '../styles/register.styles';


interface CustomInputBoxProps {
  text: string;
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string | null; 
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const CustomInputBox: React.FC<CustomInputBoxProps> = ({ 
  text, 
  value, 
  onChangeText, 
  errorMessage, 
  secureTextEntry = false, 
  keyboardType = "default" 
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{text}</Text>
      <TextInput
        style={[styles.input, errorMessage ? styles.inputErrorBorder : undefined]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

export default CustomInputBox;