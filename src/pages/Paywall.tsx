import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Zap, Shield, Clock } from 'lucide-react';
import PaymentForm from '@/components/payment/PaymentForm';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not defined');
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export default function Paywall() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {}
        });

        if (error) throw error;

        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (error: any) {
        console.error('Payment initialization error:', error);
        toast({
          title: 'Erro ao inicializar pagamento',
          description: error.message || 'Tente novamente em alguns instantes',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [toast]);

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#a78bfa',
      colorBackground: '#1e293b',
      colorText: '#f1f5f9',
      colorDanger: '#ef4444',
      fontFamily: 'Roboto, sans-serif',
      borderRadius: '12px',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-slate-800/50 border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Desbloqueie o Poder do MAX
          </h1>
          <p className="text-lg text-slate-300">
            Seu assistente de vendas com IA disponível 24/7
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Vendas Automatizadas 24/7</h3>
              <p className="text-sm text-slate-400">
                MAX trabalha enquanto você dorme, gerando cotações e atendendo clientes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Inteligência Comercial</h3>
              <p className="text-sm text-slate-400">
                Negocia descontos, sugere produtos complementares e entende especificações técnicas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Dashboard Completo</h3>
              <p className="text-sm text-slate-400">
                Acompanhe todas as cotações, leads e métricas de vendas em tempo real
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card/50 rounded-lg p-6 mb-6 border border-border">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Pagamento único</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-foreground">R$ 489</span>
              <span className="text-muted-foreground">,00</span>
            </div>
            <div className="text-sm text-primary mt-2 font-semibold">
              Acesso vitalício • Sem mensalidades
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !stripePromise ? (
          <div className="text-center text-destructive">
            Erro de configuração: Stripe não configurado
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <PaymentForm />
          </Elements>
        ) : (
          <div className="text-center text-destructive">
            Erro ao carregar formulário de pagamento
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-4">
          Pagamento seguro processado via Stripe • Garantia de 7 dias
        </p>
      </Card>
    </div>
  );
}
