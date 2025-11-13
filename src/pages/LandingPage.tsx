import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Zap, Shield, BarChart3, Globe, MessageSquare, TrendingUp, Users, Check, Clock, TrendingDown, ShoppingCart, Play } from 'lucide-react';
import PersonaSection from '@/components/landing/PersonaSection';
import StepsSection from '@/components/landing/StepsSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
export default function LandingPage() {
  const features = [{
    icon: <Bot className="h-6 w-6" />,
    title: "IA Avançada",
    description: "Vendedor virtual inteligente que entende e processa pedidos automaticamente"
  }, {
    icon: <Zap className="h-6 w-6" />,
    title: "Integração Rápida",
    description: "Adicione o widget ao seu site em segundos com um simples snippet de código"
  }, {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Análises Detalhadas",
    description: "Dashboard completo com métricas de conversão e performance de vendas"
  }, {
    icon: <Globe className="h-6 w-6" />,
    title: "Multi-site",
    description: "Use o mesmo widget em múltiplos sites e centralize todos os pedidos"
  }, {
    icon: <Shield className="h-6 w-6" />,
    title: "Seguro e Confiável",
    description: "Dados criptografados e infraestrutura segura para sua empresa"
  }, {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Conversas Naturais",
    description: "Chat fluido que converte visitantes em pedidos qualificados"
  }];
  const problems = [{
    icon: <Clock className="h-8 w-8" />,
    title: "Tempo Perdido",
    description: "Sua equipe gasta horas em pedidos simples que poderiam ser automatizados",
    color: "text-primary-light"
  }, {
    icon: <TrendingDown className="h-8 w-8" />,
    title: "Vendas Perdidas",
    description: "Clientes desistem fora do horário comercial sem conseguir fazer pedidos",
    color: "text-destructive"
  }, {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "E-commerce Limitado",
    description: "Sites tradicionais não capturam leads B2B de forma eficiente",
    color: "text-muted-foreground"
  }];
  const plans = [{
    name: "Professional",
    price: "R$ 489",
    period: "/mês",
    description: "Tudo que você precisa para automatizar vendas B2B",
    features: ["Até 10.000 conversas/mês", "5 widgets personalizados", "Dashboard completo com analytics", "Suporte técnico especializado", "Integrações via API", "Relatórios avançados"]
  }, {
    name: "Enterprise",
    price: "R$ 897",
    period: "/mês",
    description: "IA avançada para vendas com suporte dedicado",
    features: ["Conversas ilimitadas", "Widgets ilimitados", "Analytics avançadas e personalizadas", "Suporte prioritário 24/7", "Gerente de conta dedicado", "Integração personalizada", "Treinamento da equipe", "SLA garantido"],
    popular: true
  }];
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">AI Sales</span>
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('inicio')} className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium">
                Início
              </button>
              <button onClick={() => scrollToSection('problemas')} className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium">
                Problemas
              </button>
              <button onClick={() => scrollToSection('solucoes')} className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium">
                Soluções
              </button>
              <button onClick={() => scrollToSection('planos')} className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium">
                Planos
              </button>
              <button onClick={() => scrollToSection('contato')} className="text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium">
                Contato
              </button>
            </nav>
            
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">ASSINAR</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding-top to account for fixed header */}
      <div className="pt-20">
        {/* Hero Section */}
        <div id="inicio" className="relative overflow-hidden bg-background min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,100,0,0.15),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,69,0,0.1),transparent_50%)]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8 animate-fade-up">
                <div className="glass-card px-6 py-3 rounded-full border-gradient">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-gradient">Powered by Inteligência Artificial</span>
                  </div>
                </div>
              </div>
              <h1 className="font-bold text-foreground mb-8 leading-[1.1] animate-fade-up [animation-delay:100ms]">
                Contrate seu Vendedor<br />
                <span className="text-gradient">
                  Perfeito. Hoje.
                </span>
              </h1>
              <div className="mb-12 max-w-4xl mx-auto space-y-6 animate-fade-up [animation-delay:200ms]">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  Você já parou para pensar quanto tempo sua equipe de vendas gasta com pedidos simples e repetitivos?
                </p>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  E quantas vendas você pode estar perdendo fora do horário comercial?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up [animation-delay:300ms]">
                <Button size="lg" className="text-lg px-10 py-7 group">
                  <Play className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                  Ver Demonstração
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-10 py-7">
                  Saiba Mais
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Section */}
        <div id="problemas" className="py-24 bg-card/20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-foreground mb-6">
                O Problema que Você Conhece
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Empresas B2B enfrentam desafios únicos que impedem o crescimento das vendas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problems.map((problem, index) => <Card key={index} className="hover-lift group">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className={`p-5 rounded-2xl bg-gradient-subtle border border-border/50 ${problem.color} transition-transform duration-300 group-hover:scale-110`}>
                        {problem.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-0 bg-foreground bg-clip-text text-transparent">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center leading-relaxed text-base">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </div>

        {/* New Persona Section */}
        <PersonaSection />

        {/* Features Section */}
        <div id="solucoes" className="py-24 bg-background relative">
          <div className="absolute inset-0 bg-gradient-to-b from-card/20 to-background"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-foreground mb-6">
                Por que escolher nossa plataforma?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Desenvolvida especificamente para o mercado B2B, nossa solução entende as nuances das vendas industriais.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => <Card key={index} className="hover-lift group">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gradient-subtle rounded-2xl text-primary border border-primary/20 transition-all duration-300 group-hover:shadow-glow group-hover:border-primary/40">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </div>

        {/* New Steps Section */}
        <StepsSection />

        {/* Stats Section */}
        <div className="py-24 bg-card/20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="premium-card p-10 rounded-2xl hover-lift group">
                <div className="flex items-center justify-center mb-6">
                  <TrendingUp className="h-10 w-10 text-success transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="text-5xl font-bold text-gradient mb-3">+340%</div>
                <p className="text-muted-foreground text-lg">Aumento médio em conversões</p>
              </div>
              <div className="premium-card p-10 rounded-2xl hover-lift group">
                <div className="flex items-center justify-center mb-6">
                  <Users className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="text-5xl font-bold text-gradient mb-3">24/7</div>
                <p className="text-muted-foreground text-lg">Atendimento ininterrupto</p>
              </div>
              <div className="premium-card p-10 rounded-2xl hover-lift group">
                <div className="flex items-center justify-center mb-6">
                  <MessageSquare className="h-10 w-10 text-primary-light transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="text-5xl font-bold text-gradient mb-3">85%</div>
                <p className="text-muted-foreground text-lg">Taxa de satisfação dos clientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="planos" className="py-24 bg-background relative">
          <div className="absolute inset-0 bg-gradient-to-b from-card/30 to-background"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-foreground mb-6">
                Planos Premium com Suporte Incluído
              </h2>
              <p className="text-xl text-muted-foreground">
                Escolha a solução ideal para acelerar suas vendas B2B
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {plans.map((plan, index) => <Card key={index} className={`relative hover-lift ${plan.popular ? 'border-gradient fire-glow scale-105' : ''}`}>
                  {plan.popular && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="fire-gradient text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-glow">
                        Mais Escolhido
                      </div>
                    </div>}
                  <CardHeader className="text-center pb-8 pt-12">
                    <CardTitle className="text-3xl mb-4 bg-foreground bg-clip-text text-transparent">{plan.name}</CardTitle>
                    <div className="mb-6">
                      <span className="text-6xl font-bold text-gradient">{plan.price}</span>
                      <span className="text-muted-foreground text-xl">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base text-muted-foreground">{plan.description}</CardDescription>
                    <div className="glass-card text-success px-4 py-2 rounded-full text-sm font-semibold inline-block mt-4 border border-success/30">
                      ✓ Suporte Especializado Incluído
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-4 mb-10">
                      {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-success mt-1 mr-3 flex-shrink-0" />
                          <span className="text-base leading-relaxed text-muted-foreground">{feature}</span>
                        </li>)}
                    </ul>
                    <Button asChild className={`w-full py-7 text-lg ${plan.popular ? '' : 'variant-secondary'}`} size="lg">
                      <Link to="/register">
                        {plan.popular ? "Contratar Agora" : "Escolher Plano"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>)}
            </div>
            
            <div className="text-center mt-16">
              <p className="text-muted-foreground text-lg">
                Todos os planos incluem integração completa e suporte técnico especializado
              </p>
            </div>
          </div>
        </div>

        {/* New Final CTA Section */}
        <div id="contato">
          <FinalCTASection />
        </div>

        {/* Footer */}
        <footer className="bg-card/30 py-16 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-6">
                <Bot className="h-8 w-8 text-primary mr-3" />
                <span className="text-2xl font-bold text-foreground">
                  AI Sales
                </span>
              </div>
              <p className="text-muted-foreground text-center text-base">
                © 2024 AI Sales. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>;
}