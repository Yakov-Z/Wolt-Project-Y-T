import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f7f6' },
    scrollContent: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2c3e50' },
    formContainer: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 2 },
    label: { fontWeight: 'bold', marginBottom: 5, color: '#495057', marginTop: 10,textAlign: 'right' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff', textAlign: 'right' },
    inputError: { borderColor: '#e74c3c' },
    errorText: { color: '#e74c3c', fontSize: 12, marginTop: 5,textAlign: 'center' },
    imagePickerBtn: { borderWidth: 1, borderColor: '#adb5bd', borderStyle: 'dashed', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
    imagePickerText: { color: '#00c2e8', fontWeight: 'bold' },
    previewImage: { width: '100%', height: 200, borderRadius: 8, marginTop: 10 },
    submitBtn: { backgroundColor: '#00c2e8', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 25 },
    submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});