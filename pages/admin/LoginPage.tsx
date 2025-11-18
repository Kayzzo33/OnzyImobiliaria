import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Entrando...');

    const { error } = await authService.signIn({ email, password });

    setIsLoading(false);
    toast.dismiss(loadingToast);

    if (error) {
      toast.error(error.message || 'Falha no login. Verifique suas credenciais.');
    } else {
      toast.success('Login bem-sucedido!');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-heading text-neutral-800">Painel Admin</h1>
                <p className="text-neutral-600 mt-2">Acesse o painel de gerenciamento.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
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
                />
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                    iconLeft={<LogIn size={18}/>}
                >
                    Entrar
                </Button>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
