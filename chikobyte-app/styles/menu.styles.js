import { StyleSheet } from 'react-native';

// Wolt brand primary color to match the rest of the app
const WOLT_BLUE = '#00c2e8';

// Styles for the menu screen modal
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    // RTL Support for Hebrew - puts the title on the right and X on the left
    flexDirection: 'row-reverse', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 5,
  },
  // Profile section styles
  profileSection: {
    flexDirection: 'row-reverse', // RTL Support for Hebrew
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // Makes the image circular
    backgroundColor: '#ccc', // Fallback color
    marginLeft: 15, // Margin on the left because of row-reverse
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    paddingTop: 10,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'flex-end', // Aligns the text to the right for Hebrew
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: WOLT_BLUE, // Wolt blue color for active links
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#ff4d4d', // Red color for logout to make it clear and distinct
  },
  divider: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginVertical: 5,
    marginHorizontal: 20,
  }
});