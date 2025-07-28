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
    color: "text-yellow-400"
  }, {
    icon: <TrendingDown className="h-8 w-8" />,
    title: "Vendas Perdidas",
    description: "Clientes desistem fora do horário comercial sem conseguir fazer pedidos",
    color: "text-red-400"
  }, {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "E-commerce Limitado",
    description: "Sites tradicionais não capturam leads B2B de forma eficiente",
    color: "text-blue-400"
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
  return <div className="min-h-screen bg-slate-900">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('inicio')} className="text-slate-300 hover:text-white transition-colors">
                Início
              </button>
              <button onClick={() => scrollToSection('problemas')} className="text-slate-300 hover:text-white transition-colors">
                Problemas
              </button>
              <button onClick={() => scrollToSection('solucoes')} className="text-slate-300 hover:text-white transition-colors">
                Soluções
              </button>
              <button onClick={() => scrollToSection('planos')} className="text-slate-300 hover:text-white transition-colors">
                Planos
              </button>
              <button onClick={() => scrollToSection('contato')} className="text-slate-300 hover:text-white transition-colors">
                Contato
              </button>
            </nav>
            
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-slate-800">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6">
                <Link to="/register">ASSINAR</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding-top to account for fixed header */}
      <div className="pt-16">
        {/* Hero Section */}
        <div id="inicio" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-yellow-500/10 text-yellow-400 px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 border border-yellow-500/20">
                  <Zap className="h-4 w-4" />
                  ⚡ Powered by Inteligência Artificial
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Contrate seu Vendedor<br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Perfeito. Hoje.
                </span>
              </h1>
              <div className="mb-12 max-w-4xl mx-auto space-y-6">
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
                  Você já parou para pensar quanto tempo sua equipe de vendas gasta com pedidos simples e repetitivos?
                </p>
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
                  E quantas vendas você pode estar perdendo fora do horário comercial?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg bg-blue-600 hover:bg-blue-700 text-white px-[40px] rounded-[25px] py-[26px]">
                  <Play className="h-5 w-5 mr-2" />
                  Ver Demonstração
                </Button>
                <Button variant="outline" size="lg" className="text-lg border-slate-600 text-slate-300 hover:bg-slate-800 rounded-[25px] px-[35px] py-[25px]">
                  Saiba Mais
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Section */}
        <div id="problemas" className="py-20 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                O Problema que Você Conhece
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Empresas B2B enfrentam desafios únicos que impedem o crescimento das vendas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problems.map((problem, index) => <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-full bg-slate-700/50 ${problem.color}`}>
                        {problem.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-center leading-relaxed">
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
        <div id="solucoes" className="py-20 bg-slate-800 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-800"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Por que escolher nossa plataforma?
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Desenvolvida especificamente para o mercado B2B, nossa solução entende as nuances das vendas industriais.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => <Card key={index} className="bg-slate-700/30 border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 border border-blue-500/20">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-slate-300 leading-relaxed">
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
        <div className="py-20 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-900"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">+340%</div>
                <p className="text-slate-300">Aumento médio em conversões</p>
              </div>
              <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <p className="text-slate-300">Atendimento ininterrupto</p>
              </div>
              <div className="bg-slate-800/50 p-8 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">85%</div>
                <p className="text-slate-300">Taxa de satisfação dos clientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="planos" className="py-20 bg-slate-800 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-800"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Planos Premium com Suporte Incluído
              </h2>
              <p className="text-lg text-slate-300">
                Escolha a solução ideal para acelerar suas vendas B2B
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => <Card key={index} className={`relative bg-slate-700/30 border-slate-600/50 backdrop-blur-sm ${plan.popular ? 'ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/10 scale-105' : ''}`}>
                  {plan.popular && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                        Mais Escolhido
                      </div>
                    </div>}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2 text-white">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-300 text-lg">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base text-slate-300">{plan.description}</CardDescription>
                    <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium inline-block mt-2 border border-green-500/20">
                      ✓ Suporte Especializado Incluído
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm leading-relaxed text-slate-300">{feature}</span>
                        </li>)}
                    </ul>
                    <Button asChild className={`w-full py-6 text-lg ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-600 hover:bg-slate-500 text-white'}`} size="lg">
                      <Link to="/register">
                        {plan.popular ? "Contratar Agora" : "Escolher Plano"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>)}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-slate-300">
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
        <footer className="bg-slate-800 py-12 border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-4">
                <Bot className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold text-white">
                  Vendedor Virtual Inteligente
                </span>
              </div>
              <p className="text-slate-400 text-center">
                © 2024 Vendedor Virtual Inteligente. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>;
}