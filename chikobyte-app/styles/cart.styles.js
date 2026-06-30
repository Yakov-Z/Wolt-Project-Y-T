import { StyleSheet } from 'react-native';

export const cartStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollContent: { padding: 20 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 100 },
    emptyTitle: { fontSize: 22, color: '#2c3e50', marginBottom: 20, fontWeight: 'bold' },
    card: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', elevation: 3 },
    header: { backgroundColor: '#28a745', padding: 20, alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    headerSub: { color: 'white', fontSize: 16 },
    body: { padding: 20 },
    errorBox: { backgroundColor: '#f8d7da', padding: 15, borderRadius: 8, marginBottom: 20 },
    errorText: { color: '#721c24', textAlign: 'center' },
    itemsContainer: { marginBottom: 20 },
    itemRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f2f6' },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemPriceRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 15 },
    itemPrice: { fontWeight: 'bold', fontSize: 16 },
    deleteItemBtn: { color: '#e74c3c', fontWeight: 'bold', fontSize: 18, marginLeft: 10 },
    totalBox: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 20, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
    totalTextLabel: { fontSize: 18, fontWeight: 'bold' },
    totalPrice: { fontSize: 24, fontWeight: '900', color: '#28a745' },
    // ... keep everything above these lines the same ...

    itemPriceRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
    itemPrice: { fontWeight: 'bold', fontSize: 16 },
    // Replaced marginLeft with padding for a better touch target area
    deleteItemBtn: { color: '#e74c3c', fontWeight: 'bold', fontSize: 18, paddingHorizontal: 10 }, 
    
    totalBox: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 20, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
    totalTextLabel: { fontSize: 18, fontWeight: 'bold' },
    totalPrice: { fontSize: 24, fontWeight: '900', color: '#28a745' },
    
    // New layout for action buttons
    actionsContainer: { gap: 12 }, // Main container for all buttons
    primaryBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', width: '100%', elevation: 1 },
    primaryBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    
    secondaryActionsRow: { flexDirection: 'row-reverse', gap: 10 }, // Row for the bottom two buttons
    secondaryBtn: { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#6c757d', padding: 12, borderRadius: 8, alignItems: 'center' },
    secondaryBtnText: { color: '#6c757d', fontWeight: 'bold', fontSize: 15 },
    dangerBtn: { flex: 1, backgroundColor: '#dc3545', padding: 12, borderRadius: 8, alignItems: 'center', elevation: 1 },
    dangerBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 }
});
