
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PersonaSection() {
  const personas = [
    {
      emoji: "👋",
      title: "Gerente de Vendas",
      description: "Você tem uma equipe de vendas que gasta muito tempo com pedidos simples e repetitivos, quando poderia estar focada em negociações mais complexas e relacionamento com clientes estratégicos."
    },
    {
      icon: "📈",
      title: "Dono de Distribuidora",
      description: "Seu site não vende como deveria. Os clientes visitam, mas não conseguem fazer pedidos facilmente, especialmente fora do horário comercial. Você sabe que está perdendo vendas todos os dias."
    },
    {
      icon: "⚙️",
      title: "Fabricante/Indústria",
      description: "Você tem produtos excelentes, mas depende totalmente da sua equipe de vendas para processar pedidos. Gostaria de ter um canal de vendas que funciona 24 horas por dia, sem aumentar os custos operacionais."
    }
  ];

  return (
    <div className="py-20 bg-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-900"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Você se identifica com isso?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Veja se alguma dessas situações faz sentido para o seu negócio
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="text-4xl">
                    {persona.emoji || persona.icon}
                  </div>
                </div>
                <CardTitle className="text-xl text-white">{persona.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  {persona.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
