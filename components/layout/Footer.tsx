
import React from 'react';
import { Building2, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary-500" />
                <span className="text-2xl font-heading font-bold text-white">Imóvel<span className="text-primary-500">Inteligente</span></span>
            </div>
            <p className="text-neutral-400">Encontrando o imóvel dos seus sonhos com a ajuda da inteligência artificial.</p>
            <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white"><Facebook size={20} /></a>
                <a href="#" className="text-neutral-400 hover:text-white"><Instagram size={20} /></a>
                <a href="#" className="text-neutral-400 hover:text-white"><Linkedin size={20} /></a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Navegação</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white">Buscar Imóveis</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Anuncie seu Imóvel</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Sobre Nós</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Contato</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Tipos de Imóvel</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white">Apartamentos</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Casas</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Kitnets</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Coberturas</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wider uppercase">Contato</h3>
            <ul className="mt-4 space-y-2 text-neutral-400">
                <li>Rua Fictícia, 123 - Centro</li>
                <li>contato@imovelinteligente.com</li>
                <li>(11) 99999-8888</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-700 pt-8 text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} ImóvelInteligente. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
