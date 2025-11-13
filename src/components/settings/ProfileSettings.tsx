import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Building2, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validateFullName, validateCompanyName, validatePassword, sanitizeInput, sanitizePlainText } from '@/lib/security';
import { Separator } from '@/components/ui/separator';

export function ProfileSettings() {
  const { user, distributorProfile } = useAuth();
  const { toast } = useToast();
  
  // Profile fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (user && distributorProfile) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      setCompanyName(distributorProfile.company_name || '');
    }
  }, [user, distributorProfile]);

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    const validation = validatePassword(value);
    setPasswordStrength(validation.strength);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validate full name
    const nameValidation = validateFullName(fullName);
    if (!nameValidation.isValid) {
      toast({
        title: 'Nome inválido',
        description: nameValidation.error,
        variant: 'destructive',
      });
      return;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast({
        title: 'Email inválido',
        description: emailValidation.error,
        variant: 'destructive',
      });
      return;
    }

    // Validate company name
    const companyValidation = validateCompanyName(companyName);
    if (!companyValidation.isValid) {
      toast({
        title: 'Nome da empresa inválido',
        description: companyValidation.error,
        variant: 'destructive',
      });
      return;
    }

    setLoadingProfile(true);

    try {
      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: sanitizeInput(email),
        });
        
        if (emailError) throw emailError;
        
        toast({
          title: 'Confirme seu email',
          description: 'Enviamos um link de confirmação para seu novo email.',
        });
      }

      // Update user metadata (name)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: sanitizePlainText(fullName) }
      });

      if (metadataError) throw metadataError;

      // Update company name in distributors table
      const { error: companyError } = await supabase
        .from('distributors')
        .update({ 
          company_name: sanitizePlainText(companyName),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (companyError) throw companyError;

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate current password
    if (!currentPassword) {
      toast({
        title: 'Senha atual obrigatória',
        description: 'Digite sua senha atual para continuar',
        variant: 'destructive',
      });
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast({
        title: 'Senha insegura',
        description: passwordValidation.error,
        variant: 'destructive',
      });
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Senhas não coincidem',
        description: 'A nova senha e a confirmação devem ser iguais',
        variant: 'destructive',
      });
      return;
    }

    setLoadingPassword(true);

    try {
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Senha atual incorreta');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);

      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi alterada com sucesso!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar senha',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength < 2) return { label: 'Muito fraca', color: 'bg-destructive' };
    if (strength < 4) return { label: 'Fraca', color: 'bg-orange-500' };
    if (strength < 6) return { label: 'Boa', color: 'bg-yellow-500' };
    return { label: 'Muito forte', color: 'bg-success' };
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Informações do Perfil</span>
          </CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e da empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(sanitizePlainText(e.target.value))}
                  className="pl-10"
                  placeholder="João Silva"
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                  className="pl-10"
                  placeholder="seu@email.com"
                  maxLength={254}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Você receberá um email de confirmação se alterar seu endereço
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(sanitizePlainText(e.target.value))}
                  className="pl-10"
                  placeholder="Sua Empresa Ltda"
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loadingProfile}
            >
              {loadingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Update */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-primary" />
            <span>Alterar Senha</span>
          </CardTitle>
          <CardDescription>
            Atualize sua senha para manter sua conta segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="********"
                maxLength={128}
                required
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="********"
                maxLength={128}
                required
              />
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-full rounded ${
                          i < passwordStrength 
                            ? getPasswordStrengthLabel(passwordStrength).color
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength < 2 ? 'text-destructive' :
                    passwordStrength < 4 ? 'text-orange-500' :
                    passwordStrength < 6 ? 'text-yellow-500' :
                    'text-success'
                  }`}>
                    {getPasswordStrengthLabel(passwordStrength).label}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                maxLength={128}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loadingPassword || passwordStrength < 3}
            >
              {loadingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar Senha'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}