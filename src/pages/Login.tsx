import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSecureForm } from '@/hooks/useSecureForm';
import { sanitizeInput } from '@/lib/security';
import { Loader2, Bot, Eye, EyeOff, Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    csrfToken,
    isRateLimited,
    remainingTime,
    initializeForm,
    validateSubmission
  } = useSecureForm({
    rateLimitKey: 'login',
    maxAttempts: 5,
    windowMs: 300000 // 5 minutes
  });

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security validation
    const securityCheck = validateSubmission();
    if (!securityCheck.isValid) {
      toast({
        title: "Erro de segurança",
        description: securityCheck.error,
        variant: "destructive",
      });
      return;
    }
    
    // Basic input validation
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }
    
    if (!password || password.length < 6) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(sanitizeInput(email), password);
      navigate('/dashboard');
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRateLimited) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-orange-500">
              Muitas Tentativas
            </CardTitle>
            <CardDescription>
              Tente novamente em {remainingTime} minutos
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Vendedor Virtual Inteligente
          </CardTitle>
          <CardDescription>
            Faça login para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="csrf_token" value={csrfToken} />
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                maxLength={254}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={128}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fazendo login...
                </>
              ) : (
                'Fazer Login'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Não tem uma conta?{' '}
            </span>
            <Link
              to="/register"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Registre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}