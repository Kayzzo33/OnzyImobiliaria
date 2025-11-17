
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-heading font-bold text-neutral-800">Imóvel<span className="text-primary-500">Inteligente</span></span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-neutral-600 hover:text-primary-500 font-medium transition-colors">Início</Link>
            <Link to="/search" className="text-neutral-600 hover:text-primary-500 font-medium transition-colors">Buscar Imóveis</Link>
            <a href="#" className="text-neutral-600 hover:text-primary-500 font-medium transition-colors">Favoritos</a>
            <a href="#" className="text-neutral-600 hover:text-primary-500 font-medium transition-colors">Anuncie</a>
          </nav>
          <div className="flex items-center">
             <Button variant="primary" size="md">Área do Cliente</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
