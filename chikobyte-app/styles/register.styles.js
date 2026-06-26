import { StyleSheet } from 'react-native';

const WOLT_BLUE = '#00c2e8';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: WOLT_BLUE,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  // Input Component Styles
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'right', // Supports RTL when typing Hebrew
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    textAlign: 'right', // For Hebrew input
  },
  inputErrorBorder: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  // Checkbox Styles
  checkboxContainer: {
    flexDirection: 'row-reverse', // RTL Support
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: WOLT_BLUE,
    borderRadius: 4,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: WOLT_BLUE,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Image Picker Styles
  imagePickerContainer: {
    flexDirection: 'row-reverse',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 5,
  },
  imagePickerButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#ced4da',
    justifyContent: 'center',
  },
  imagePickerText: {
    flex: 1,
    padding: 12,
    textAlign: 'right',
    color: '#6c757d',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
  },
  // Button Styles
  submitButton: {
    backgroundColor: WOLT_BLUE,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});