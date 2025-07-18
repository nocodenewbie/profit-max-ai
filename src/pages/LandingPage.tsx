import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe, 
  MessageSquare,
  TrendingUp,
  Users,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "IA Avançada",
      description: "Vendedor virtual inteligente que entende e processa pedidos automaticamente"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Integração Rápida",
      description: "Adicione o widget ao seu site em segundos com um simples snippet de código"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Análises Detalhadas",
      description: "Dashboard completo com métricas de conversão e performance de vendas"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-site",
      description: "Use o mesmo widget em múltiplos sites e centralize todos os pedidos"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Seguro e Confiável",
      description: "Dados criptografados e infraestrutura segura para sua empresa"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Conversas Naturais",
      description: "Chat fluido que converte visitantes em pedidos qualificados"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      description: "Ideal para pequenas empresas",
      features: [
        "Até 1.000 conversas/mês",
        "1 widget personalizado",
        "Dashboard básico",
        "Suporte por email"
      ]
    },
    {
      name: "Professional",
      price: "R$ 297",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "Até 5.000 conversas/mês",
        "3 widgets personalizados",
        "Analytics avançadas",
        "Suporte prioritário",
        "Integrações via API"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 697",
      period: "/mês",
      description: "Para grandes operações",
      features: [
        "Conversas ilimitadas",
        "Widgets ilimitados",
        "Relatórios customizados",
        "Suporte 24/7",
        "Integração personalizada",
        "Gerente de conta dedicado"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <Bot className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Vendedor Virtual<br />
              <span className="text-primary">Inteligente</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transforme visitantes em pedidos qualificados com nossa IA especializada em vendas B2B. 
              Integre em minutos, venda 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/register">
                  Começar Grátis
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/login">
                  Fazer Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desenvolvida especificamente para o mercado B2B, nossa solução entende as nuances das vendas industriais.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">+340%</div>
              <p className="text-muted-foreground">Aumento médio em conversões</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">24/7</div>
              <p className="text-muted-foreground">Atendimento ininterrupto</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">85%</div>
              <p className="text-muted-foreground">Taxa de satisfação dos clientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Planos para cada necessidade
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha o plano ideal para sua empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link to="/register">
                      Começar Agora
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para revolucionar suas vendas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a centenas de empresas que já aumentaram suas vendas com nossa IA
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/register">
              Criar Conta Grátis
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-4">
              <Bot className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-foreground">
                Vendedor Virtual Inteligente
              </span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2024 Vendedor Virtual Inteligente. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}