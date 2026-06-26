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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 15,
    marginBottom: 10,
    color: '#555',
  },
  // Checkbox Styles
  checkboxContainer: {
    flexDirection: 'row-reverse',
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
    marginBottom: 15,
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
    resizeMode: 'contain',
  },
  // Button Styles
  submitButton: {
    backgroundColor: WOLT_BLUE,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
    textAlign: 'center',
  },
});