import { Platform } from 'react-native';

// Update this IP address to match your machine's current network IP (from ipconfig)
const CURRENT_NETWORK_IP = '10.51.67.236';

// Base URL configuration for all backend API fetch requests
// Toggle the comments below depending on whether you are using a Physical Device or an Emulator
export const BASE_URL = Platform.OS === 'android'
  ? `http://${CURRENT_NETWORK_IP}:5000` // Use this for Physical Device (Hotspot or LAN)
  // ? 'http://10.0.2.2:5000'           // Use this if you switch back to the Android Emulator
  : 'http://localhost:5000';            // Use this for iOS Simulator or Web