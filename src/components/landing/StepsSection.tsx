
import { Card, CardContent } from '@/components/ui/card';

export default function StepsSection() {
  const steps = [
    {
      number: "1.",
      title: "Suba sua Planilha",
      description: "Envie uma planilha simples com seus produtos, incluindo preço de custo e de venda."
    },
    {
      number: "2.",
      title: "Defina as Regras", 
      description: "No painel, crie as faixas de desconto que o Max pode usar como ferramenta de negociação."
    },
    {
      number: "3.",
      title: "Venda 24/7",
      description: "O Max está pronto. Ele começa a atender, negociar e vender no seu site imediatamente."
    }
  ];

  return (
    <div className="py-20 bg-slate-800 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-800"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-500/10 text-orange-400 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-orange-500/20">
            COMO FUNCIONA
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            A Simplicidade em 3 Passos
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Implementar o Max é mais simples do que você imagina
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="bg-slate-700/30 border-slate-600/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 text-center">
              <CardContent className="pt-8">
                <div className="text-6xl font-bold text-blue-400 mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
