import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Zap, Shield, Clock } from 'lucide-react';

export default function Paywall() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePurchase = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {}
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Erro ao processar pagamento',
        description: error.message || 'Tente novamente em alguns instantes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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

        <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">Pagamento único</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-white">R$ 489</span>
              <span className="text-slate-400">,00</span>
            </div>
            <div className="text-sm text-orange-400 mt-2 font-semibold">
              Acesso vitalício • Sem mensalidades
            </div>
          </div>
        </div>

        <Button
          onClick={handlePurchase}
          disabled={loading}
          size="lg"
          className="w-full text-lg py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            'COMPRAR AGORA'
          )}
        </Button>

        <p className="text-xs text-slate-500 text-center mt-4">
          Pagamento seguro processado via Stripe • Garantia de 7 dias
        </p>
      </Card>
    </div>
  );
}
