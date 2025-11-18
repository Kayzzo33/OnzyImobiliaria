
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { LogIn, UserPlus } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for query params to auto-switch to signup mode
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const inviteEmail = params.get('email');

    if (mode === 'signup') {
      setIsSignUp(true);
    }
    if (inviteEmail) {
      setEmail(inviteEmail);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const toastId = toast.loading(isSignUp ? 'Criando conta...' : 'Entrando...');

    try {
      if (isSignUp) {
        const { error } = await authService.signUp({ email, password, full_name: fullName });
        if (error) throw error;
        toast.success('Conta criada com sucesso! Você já pode entrar.', { id: toastId });
        setIsSignUp(false); // Switch back to login to let them sign in
      } else {
        const { error } = await authService.signIn({ email, password });
        if (error) throw error;
        toast.success('Login bem-sucedido!', { id: toastId });
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro. Tente novamente.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-heading text-neutral-800">
                  {isSignUp ? 'Criar Conta' : 'Painel Admin'}
                </h1>
                <p className="text-neutral-600 mt-2">
                  {isSignUp ? 'Preencha os dados para se cadastrar.' : 'Acesse o painel de gerenciamento.'}
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <Input
                    id="fullname"
                    type="text"
                    label="Nome Completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    placeholder="Seu nome"
                  />
                )}
                <Input
                    id="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                />
                <Input
                    id="password"
                    type="password"
                    label="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="********"
                    minLength={6}
                />
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                    iconLeft={isSignUp ? <UserPlus size={18}/> : <LogIn size={18}/>}
                >
                    {isSignUp ? 'Cadastrar' : 'Entrar'}
                </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                {isSignUp 
                  ? 'Já tem uma conta? Faça login' 
                  : 'Não tem conta? Clique aqui (apenas convidados)'}
              </button>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
