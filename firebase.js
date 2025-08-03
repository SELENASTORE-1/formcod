import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Default Firebase configuration
const defaultFirebaseConfig = {
  apiKey: "AIzaSyBxJ8sPLRGJKuRjaBU8wDmHXA5QXQlZx5A",
  authDomain: "cod-checkout-app.firebaseapp.com",
  projectId: "cod-checkout-app",
  storageBucket: "cod-checkout-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

// Initialize Firebase with default config
let firebaseApp = initializeApp(defaultFirebaseConfig);

// Get Firestore and Auth instances
let db = getFirestore(firebaseApp);
let auth = getAuth(firebaseApp);

/**
 * Reinitialize Firebase with custom configuration
 * @param {Object} customConfig - Custom Firebase configuration
 */
export const initializeFirebaseWithCustomConfig = (customConfig) => {
  try {
    // Parse the config if it's a string
    const config = typeof customConfig === 'string' 
      ? JSON.parse(customConfig) 
      : customConfig;
    
    // Validate the config has required fields
    if (!config.apiKey || !config.projectId) {
      throw new Error('Invalid Firebase configuration');
    }
    
    // Initialize a new Firebase app with the custom config
    firebaseApp = initializeApp(config, 'custom');
    
    // Update the db and auth references
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    
    console.log('Firebase reinitialized with custom config');
    return true;
  } catch (error) {
    console.error('Error initializing custom Firebase:', error);
    return false;
  }
};

export { firebaseApp, db, auth };