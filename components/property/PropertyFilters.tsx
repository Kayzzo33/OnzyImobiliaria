
import React, { useState, useEffect } from 'react';
import { MapPin, Home, DollarSign, Search } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { getCities } from '../../services/propertyService';
import type { City } from '../../types';

const PropertyFilters: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const cityData = await getCities();
      setCities(cityData);
    };
    fetchCities();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg -mt-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-neutral-800 mb-1">Localização</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <select className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow duration-200 appearance-none">
              <option>Todas as cidades</option>
              {cities.map(city => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-neutral-800 mb-1">Tipo de Imóvel</label>
           <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <select className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow duration-200 appearance-none">
              <option>Todos os tipos</option>
              <option>Casa</option>
              <option>Apartamento</option>
              <option>Kitnet</option>
            </select>
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-neutral-800 mb-1">Faixa de Preço</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                 <select className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow duration-200 appearance-none">
                    <option>Qualquer valor</option>
                    <option>Até R$ 300.000</option>
                    <option>R$ 300.000 - R$ 700.000</option>
                    <option>Acima de R$ 700.000</option>
                </select>
            </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Button size="lg" className="w-full h-[50px]" iconLeft={<Search size={20} />}>
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
