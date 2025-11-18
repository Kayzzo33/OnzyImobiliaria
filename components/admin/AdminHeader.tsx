
import React from 'react';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await authService.signOut();
    if (error) {
      toast.error('Erro ao sair: ' + error.message);
    } else {
      toast.success('Você saiu com sucesso.');
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b border-neutral-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-neutral-500 hover:text-neutral-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu size={24} />
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
             <div className="flex items-center text-sm font-medium text-neutral-600">
                <UserIcon size={16} className="mr-2" />
                <span>{user?.email}</span>
             </div>
             <button onClick={handleLogout} className="text-neutral-500 hover:text-red-500 p-2" aria-label="Sair">
                <LogOut size={20}/>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
