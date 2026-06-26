import { StyleSheet } from 'react-native';

// Wolt brand primary color
const WOLT_BLUE = '#00c2e8';

export const styles = StyleSheet.create({
  // The main wrapper must have flex: 1 to fill the entire screen
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Container for the custom header, handling the notch area
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    // Adding a subtle shadow for a modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3, // Shadow support for Android
  },
  // The row containing the logo and the menu button
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  // Typography for the app name (Chikobyte) resembling Wolt's style
  logoText: {
    fontSize: 26,
    fontWeight: '900', // Extra bold font
    color: WOLT_BLUE,
    letterSpacing: -0.5,
  },
});