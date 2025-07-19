import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  const [session, setSession] = useState<Session | null>(null);
  const [distributorProfile, setDistributorProfile] = useState<DistributorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch distributor profile from Supabase
          const { data: profile } = await supabase
            .from('distributors')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setDistributorProfile(profile as DistributorProfile);
          }
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const register = async (email: string, password: string, companyName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) throw error;
    
    if (data.user) {
      const widgetId = data.user.id.substring(0, 8) + Date.now().toString(36);
      
      const distributorProfile = {
        id: data.user.id,
        email: data.user.email!,
        company_name: companyName,
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};