import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

interface DistributorProfile {
  id: string;
  email: string;
  companyName: string;
  createdAt: Date;
  isActive: boolean;
  widgetId: string;
}

interface AuthContextType {
  user: User | null;
  distributorProfile: DistributorProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, companyName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [distributorProfile, setDistributorProfile] = useState<DistributorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch distributor profile
        const profileDoc = await getDoc(doc(db, 'distributors', user.uid));
        if (profileDoc.exists()) {
          setDistributorProfile(profileDoc.data() as DistributorProfile);
        }
      } else {
        setDistributorProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, companyName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const widgetId = user.uid.substring(0, 8) + Date.now().toString(36);
    
    const distributorProfile: DistributorProfile = {
      id: user.uid,
      email: user.email!,
      companyName,
      createdAt: new Date(),
      isActive: true,
      widgetId
    };
    
    await setDoc(doc(db, 'distributors', user.uid), distributorProfile);
    setDistributorProfile(distributorProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    distributorProfile,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};