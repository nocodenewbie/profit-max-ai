import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Check, Code, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WidgetSnippet() {
  const { distributorProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const widgetCode = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://vendedor-virtual.com/widget.js';
    script.setAttribute('data-widget-id', '${distributorProfile?.widgetId || 'YOUR_WIDGET_ID'}');
    script.setAttribute('data-company', '${distributorProfile?.companyName || 'Your Company'}');
    document.head.appendChild(script);
  })();
</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(widgetCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "O snippet foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-primary" />
              <span>Widget de Vendas</span>
            </CardTitle>
            <CardDescription>
              Adicione este código ao seu site para ativar o vendedor virtual
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              ID: {distributorProfile?.widgetId}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Configurar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm text-foreground overflow-x-auto">
              <code>{widgetCode}</code>
            </pre>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>• Adicione este código antes do tag &lt;/body&gt; do seu site</p>
              <p>• O widget aparecerá automaticamente no canto inferior direito</p>
              <p>• Compatível com qualquer site HTML, WordPress, Shopify, etc.</p>
            </div>
            
            <Button onClick={handleCopy} className="flex items-center space-x-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar Código</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}