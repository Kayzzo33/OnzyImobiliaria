
import React, { useEffect, useState } from 'react';
import { Mail, Shield, MoreVertical, PlusCircle, Copy, X, Check } from 'lucide-react';
import { getUsers } from '../../services/userService';
import type { UserProfile } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
      const fetchUsers = async () => {
          setLoading(true);
          const data = await getUsers();
          setUsers(data);
          setLoading(false);
      };
      fetchUsers();
  }, []);

  const generateInviteLink = (e: React.FormEvent) => {
    e.preventDefault();
    // Create a link that points to the login page with signup mode and pre-filled email
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}#/login?mode=signup&email=${encodeURIComponent(inviteEmail)}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success('Link copiado para a área de transferência!');
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setGeneratedLink('');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-800">Gerenciar Usuários</h1>
          <p className="text-neutral-600">Controle de acesso da equipe.</p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)} iconLeft={<PlusCircle size={18}/>}>
          Convidar Usuário
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-neutral-200">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Função</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar_url ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url} alt="" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                {user.full_name ? user.full_name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '?')}
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-900">{user.full_name || 'Sem Nome'}</div>
                      <div className="text-sm text-neutral-500 flex items-center"><Mail size={12} className="mr-1"/> {user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-neutral-900">
                    <Shield size={16} className="mr-1.5 text-neutral-400"/>
                    {user.role || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-neutral-400 hover:text-neutral-600">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                        Nenhum usuário encontrado além de você.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Convite */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <Card className="w-full max-w-md relative p-6">
            <button 
              onClick={closeInviteModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold font-heading text-neutral-800 mb-4">Convidar Novo Usuário</h2>
            
            {!generatedLink ? (
              <form onSubmit={generateInviteLink} className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Insira o e-mail do novo membro da equipe. Um link de cadastro exclusivo será gerado.
                </p>
                <Input 
                  label="E-mail do Colaborador"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colaborador@exemplo.com"
                  required
                />
                <div className="flex justify-end pt-2">
                  <Button type="submit">Gerar Link de Convite</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
                  <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5">
                    <Check size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-green-800">Link Gerado!</h3>
                    <p className="text-xs text-green-700 mt-1">Envie este link para o novo usuário para que ele possa criar sua conta e senha.</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-800 mb-1">Link de Cadastro</label>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      value={generatedLink} 
                      className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-sm text-neutral-600 font-mono"
                    />
                    <Button onClick={copyToClipboard} variant="secondary" iconLeft={<Copy size={16} />}>
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="ghost" onClick={closeInviteModal}>Fechar</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
