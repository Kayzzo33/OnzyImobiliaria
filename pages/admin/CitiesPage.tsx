
import React, { useState, useEffect } from 'react';
import { MapPin, Building } from 'lucide-react';
import { getCities, getAllProperties } from '../../services/propertyService';
import type { City } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CitiesPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyCounts, setPropertyCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [citiesData, propertiesData] = await Promise.all([
        getCities(),
        getAllProperties()
      ]);
      
      // Calculate count of properties per city
      const counts: Record<string, number> = {};
      propertiesData.forEach(p => {
        const cityKey = p.city;
        counts[cityKey] = (counts[cityKey] || 0) + 1;
      });

      setCities(citiesData);
      setPropertyCounts(counts);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold font-heading text-neutral-800">Cidades Atendidas</h1>
           <p className="text-neutral-600">Áreas de cobertura da imobiliária.</p>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <div className="bg-primary-50 p-3 rounded-full mr-4">
                            <MapPin className="text-primary-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-800">{city.name}</h3>
                            <p className="text-sm text-neutral-500">Estado: {city.state || 'SP'}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-between items-center">
                    <span className="text-sm text-neutral-600 flex items-center">
                        <Building size={16} className="mr-2"/>
                        Imóveis Ativos
                    </span>
                    <span className="text-2xl font-bold text-primary-600">{propertyCounts[city.name] || 0}</span>
                </div>
            </div>
          ))}
          
          {cities.length === 0 && (
             <div className="col-span-full text-center py-12 text-neutral-500 bg-white rounded-lg border-2 border-dashed">
                Nenhuma cidade encontrada nos imóveis cadastrados.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitiesPage;
