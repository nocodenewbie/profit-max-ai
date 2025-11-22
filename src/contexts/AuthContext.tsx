import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validatePassword, validateCompanyName, validateFullName, getGenericErrorMessage } from '@/lib/security';

interface DistributorProfile {
  id: string;
  email: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  widget_id: string;
}

interface AuthContextType {
  user: User | null;
  distributorProfile: DistributorProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, companyName: string, fullName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [distributorProfile, setDistributorProfile] = useState<DistributorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Use setTimeout to defer async operations and prevent infinite loops
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('distributors')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profile) {
                setDistributorProfile(profile as DistributorProfile);
              }
            } catch (error) {
              console.error('Error fetching distributor profile:', error);
              setDistributorProfile(null);
            }
          }, 0);
        } else {
          setDistributorProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    if (!password || password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(getGenericErrorMessage(error));
    }
  };

  const register = async (email: string, password: string, companyName: string, fullName: string) => {
    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    const companyValidation = validateCompanyName(companyName);
    if (!companyValidation.isValid) {
      throw new Error(companyValidation.error);
    }

    const nameValidation = validateFullName(fullName);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.error);
    }

    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim()
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const widgetId = data.user.id.substring(0, 8) + Date.now().toString(36);
        
        const distributorProfile = {
          id: data.user.id,
          email: data.user.email!,
          company_name: companyName.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          widget_id: widgetId
        };
        
        // Store profile in Supabase
        const { error: profileError } = await supabase
          .from('distributors')
          .insert([distributorProfile]);
        
        if (profileError) throw profileError;
        
        setDistributorProfile(distributorProfile);
      }
    } catch (error: any) {
      throw new Error(getGenericErrorMessage(error));
    }
  };

  const loginWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      throw new Error(getGenericErrorMessage(error));
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    distributorProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};