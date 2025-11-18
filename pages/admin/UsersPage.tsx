
import React, { useEffect, useState } from 'react';
import { Mail, Shield, MoreVertical } from 'lucide-react';
import { getUsers } from '../../services/userService';
import type { UserProfile } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchUsers = async () => {
          setLoading(true);
          const data = await getUsers();
          setUsers(data);
          setLoading(false);
      };
      fetchUsers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-800">Gerenciar Usuários</h1>
          <p className="text-neutral-600">Controle de acesso da equipe.</p>
        </div>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium opacity-50 cursor-not-allowed" title="Para adicionar, use a página de Registro (não implementada neste MVP)">
          + Convidar Usuário
        </button>
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
    </div>
  );
};

export default UsersPage;
