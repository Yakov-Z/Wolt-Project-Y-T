import { StyleSheet } from 'react-native';

const WOLT_BLUE = '#00c2e8';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  // Header Section
  headerImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  noImagePlaceholder: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginBottom: 10,
  },
  badgesContainer: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  cartBadge: {
    backgroundColor: '#ffa600',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  kosherBadge: {
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Info Section
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 20,
  },
  // Menu Section
  menuHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: WOLT_BLUE,
    paddingBottom: 10,
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  menuGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Product Card
  productCard: {
    width: '48%', // Allows 2 items per row with a small gap
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'right',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 10,
  },
  productPriceRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addToCartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  adminButtonsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    gap: 5,
  },
  adminUpdateBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  adminDeleteBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  adminBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Action Buttons
  actionButtonContainer: {
    marginTop: 10,
  }
});