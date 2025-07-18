
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your actual Firebase configuration
// Get these values from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// For development/demo purposes, using placeholder values
// IMPORTANT: Replace these with real Firebase project credentials before production
const isDevelopment = import.meta.env.DEV;

const devConfig = {
  apiKey: "demo-key",
  authDomain: "vendedor-virtual-inteligente.firebaseapp.com",
  projectId: "vendedor-virtual-inteligente", 
  storageBucket: "vendedor-virtual-inteligente.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

export const app = initializeApp(isDevelopment ? devConfig : firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Instructions for production setup:
// 1. Create a new Firebase project at https://console.firebase.google.com
// 2. Enable Authentication with Email/Password
// 3. Create Firestore database with these collections:
//    - distributors: { id, email, companyName, widgetId, createdAt, isActive }
//    - conversations: { id, widgetId, distributorId, messages, customerInfo, createdAt, updatedAt }
//    - orders: { id, conversationId, distributorId, products, customerInfo, status, totalValue, createdAt }
// 4. Set up Firestore security rules
// 5. Replace firebaseConfig above with your actual project credentials
