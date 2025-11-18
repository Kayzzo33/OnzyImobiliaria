
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PlusCircle, Search } from 'lucide-react';

import type { Property } from '../../types';
import { getAllProperties, deleteProperty } from '../../services/propertyService';

import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PropertiesTable from '../../components/admin/PropertiesTable';
import PropertyFormModal from '../../components/admin/PropertyFormModal';
import Input from '../../components/ui/Input';

const PropertiesListPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getAllProperties();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      toast.error('Falha ao carregar os imóveis.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const results = properties.filter(prop =>
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(results);
  }, [searchTerm, properties]);


  const handleAddNew = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      const toastId = toast.loading('Excluindo imóvel...');
      const { error } = await deleteProperty(id);
      toast.dismiss(toastId);
      if (error) {
        toast.error('Erro ao excluir imóvel: ' + error.message);
      } else {
        toast.success('Imóvel excluído com sucesso!');
        fetchProperties(); // Refresh the list
      }
    }
  };

  return (
    <div>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold font-heading text-neutral-800">Gerenciar Imóveis</h1>
            <Button onClick={handleAddNew} iconLeft={<PlusCircle size={18} />}>
                Novo Imóvel
            </Button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 relative">
                     <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                     <Input 
                        placeholder="Buscar por título, código, cidade ou bairro..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Placeholder for more filters */}
                <div className="text-center text-neutral-500 text-sm">
                    Filtros avançados e visualização em grade em breve.
                </div>
            </div>
        </div>


        <div className="bg-white p-1 sm:p-4 rounded-lg shadow-md">
            {loading ? (
                <LoadingSpinner className="h-96" />
            ) : (
                <PropertiesTable properties={filteredProperties} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>

        <PropertyFormModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
                setIsModalOpen(false);
                fetchProperties(); // Refresh data on save
            }}
            property={selectedProperty}
        />
    </div>
  );
};

export default PropertiesListPage;
