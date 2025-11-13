import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSecureForm } from '@/hooks/useSecureForm';
import { validateEmail, validatePassword, validateCompanyName, validateFullName, sanitizeInput, sanitizePlainText } from '@/lib/security';
import { Loader2, Bot, Eye, EyeOff, Shield } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    csrfToken,
    isRateLimited,
    remainingTime,
    initializeForm,
    validateSubmission
  } = useSecureForm({
    rateLimitKey: 'register',
    maxAttempts: 3,
    windowMs: 900000 // 15 minutes
  });

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const validation = validatePassword(value);
    setPasswordStrength(validation.strength);
  };

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

    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast({
        title: "Email inválido",
        description: emailValidation.error,
        variant: "destructive",
      });
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Senha insegura",
        description: passwordValidation.error,
        variant: "destructive",
      });
      return;
    }

    const companyValidation = validateCompanyName(companyName);
    if (!companyValidation.isValid) {
      toast({
        title: "Nome da empresa inválido",
        description: companyValidation.error,
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro no registro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(
        sanitizeInput(email),
        password,
        sanitizePlainText(companyName),
        sanitizePlainText(fullName)
      );
      navigate('/dashboard');
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao Vendedor Virtual Inteligente",
      });
    } catch (error: any) {
      toast({
        title: "Erro no registro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength < 2) return { label: 'Muito fraca', color: 'text-red-500' };
    if (strength < 4) return { label: 'Fraca', color: 'text-orange-500' };
    if (strength < 6) return { label: 'Boa', color: 'text-yellow-500' };
    return { label: 'Muito forte', color: 'text-green-500' };
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
            Criar Conta
          </CardTitle>
          <CardDescription>
            Registre sua empresa e comece a vender com IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="csrf_token" value={csrfToken} />
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="João Silva"
                value={fullName}
                onChange={(e) => setFullName(sanitizePlainText(e.target.value))}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Sua Empresa Ltda"
                value={companyName}
                onChange={(e) => setCompanyName(sanitizePlainText(e.target.value))}
                maxLength={100}
                required
              />
            </div>
            
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
                  onChange={(e) => handlePasswordChange(e.target.value)}
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
              {password && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex space-x-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-4 rounded ${
                          i < passwordStrength ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={getPasswordStrengthLabel(passwordStrength).color}>
                    {getPasswordStrengthLabel(passwordStrength).label}
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={128}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || passwordStrength < 3}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Já tem uma conta?{' '}
            </span>
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}