import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // These will be environment variables in production
  apiKey: "demo-key",
  authDomain: "vendedor-virtual-inteligente.firebaseapp.com",
  projectId: "vendedor-virtual-inteligente",
  storageBucket: "vendedor-virtual-inteligente.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);