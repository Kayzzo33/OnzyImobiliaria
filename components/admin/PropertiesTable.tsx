import React from 'react';
import type { Property } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Edit, Trash2 } from 'lucide-react';

interface PropertiesTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

const PropertiesTable: React.FC<PropertiesTableProps> = ({ properties, onEdit, onDelete }) => {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Código</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Título</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tipo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Preço</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Criado em</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-neutral-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{property.codigo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 max-w-xs truncate">{property.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 capitalize">{property.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{formatPrice(property.price)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge status={property.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                {property.created_at ? new Date(property.created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(property)} aria-label={`Editar ${property.title}`}><Edit size={16} /></Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(property.id)} className="text-red-600 hover:bg-red-50" aria-label={`Excluir ${property.title}`}><Trash2 size={16} /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesTable;
