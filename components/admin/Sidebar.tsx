
import React, { useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, Home, Calendar, MapPin, TrendingUp, Users, Settings } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });
  
  const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string; }) => (
    <NavLink
      end
      to={to}
      className={({ isActive }) => `block text-neutral-200 hover:text-white transition duration-150 ${isActive ? '!text-white' : ''}`}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${pathname.includes(to) ? 'bg-primary-700' : ''}`}>{icon}</div>
        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
            {label}
        </span>
      </div>
    </NavLink>
  );

  return (
    <>
      {/* Sidebar backdrop (mobile) */}
      <div
        className={`fixed inset-0 bg-neutral-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:w-64 2xl:w-64 shrink-0 bg-neutral-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
            <NavLink to="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary-500" />
                <span className="text-2xl font-heading font-bold text-white lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Arcanjo</span>
            </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-4">
            <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/admin/properties" icon={<Home size={20} />} label="Imóveis" />
            <NavItem to="/admin/schedules" icon={<Calendar size={20} />} label="Agendamentos" />
            <NavItem to="/admin/cities" icon={<MapPin size={20} />} label="Cidades" />
            <NavItem to="/admin/analytics" icon={<TrendingUp size={20} />} label="Analytics" />
            <NavItem to="/admin/users" icon={<Users size={20} />} label="Usuários" />
            <NavItem to="/admin/settings" icon={<Settings size={20} />} label="Configurações" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
