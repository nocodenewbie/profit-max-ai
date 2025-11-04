import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/paywall');
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId }
        });

        if (error) throw error;

        if (data?.success && data?.status === 'paid') {
          setVerified(true);
          toast({
            title: 'Pagamento confirmado!',
            description: 'Bem-vindo ao MAX! Seu acesso foi liberado.',
          });
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          throw new Error('Pagamento não confirmado');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        toast({
          title: 'Erro na verificação',
          description: 'Não conseguimos verificar seu pagamento. Contate o suporte.',
          variant: 'destructive',
        });
        navigate('/paywall');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, toast]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-slate-800/50 border-slate-700 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Verificando pagamento...</h2>
          <p className="text-slate-400">Por favor, aguarde enquanto confirmamos sua compra.</p>
        </Card>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 bg-slate-800/50 border-slate-700 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Pagamento Confirmado!</h2>
          <p className="text-lg text-slate-300 mb-6">
            Bem-vindo ao MAX! Você agora tem acesso vitalício ao seu assistente de vendas com IA.
          </p>
          <p className="text-sm text-slate-400">
            Redirecionando para o dashboard...
          </p>
        </Card>
      </div>
    );
  }

  return null;
}
