import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(true);

  useEffect(() => {
    const checkPayment = async () => {
      if (!user) {
        setCheckingPayment(false);
        return;
      }

      try {
        // Use server-side function for payment verification
        const { data, error } = await supabase
          .rpc('user_has_paid', { user_uuid: user.id });

        if (error) throw error;
        setHasPaid(data === true);
      } catch (error) {
        // Silent error handling - don't expose details to console
        setHasPaid(false);
      } finally {
        setCheckingPayment(false);
      }
    };

    checkPayment();
  }, [user]);

  if (loading || checkingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasPaid === false) {
    return <Navigate to="/paywall" replace />;
  }

  return <>{children}</>;
}