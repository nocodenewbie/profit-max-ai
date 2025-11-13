
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function FinalCTASection() {
  return (
    <div className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,0,0.1),transparent_70%)]"></div>
      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground animate-fade-up">
          Pronto para contratar o seu melhor vendedor?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-up [animation-delay:100ms]">
          Chega de perder vendas e de ter um site que não vende. Dê ao seu negócio a inteligência de vendas que ele merece.
        </p>
        <Button 
          asChild 
          size="lg" 
          className="text-lg px-10 py-7 animate-fade-up [animation-delay:200ms] animate-glow"
        >
          <Link to="/register">
            COMPRAR AGORA
          </Link>
        </Button>
      </div>
    </div>
  );
}
