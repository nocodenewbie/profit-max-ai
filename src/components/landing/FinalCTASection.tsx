
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function FinalCTASection() {
  return (
    <div className="py-20 bg-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900"></div>
      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Pronto para contratar o seu melhor vendedor?
        </h2>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Chega de perder vendas e de ter um site que não vende. Dê ao seu negócio a inteligência de vendas que ele merece.
        </p>
        <Button 
          asChild 
          size="lg" 
          className="text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
        >
          <Link to="/register">
            COMPRAR AGORA
          </Link>
        </Button>
      </div>
    </div>
  );
}
