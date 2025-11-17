
import React from 'react';
import type { PropertyStatus } from '../../types';

interface BadgeProps {
  status: PropertyStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusStyles: Record<PropertyStatus, { text: string; bg: string; color: string }> = {
    disponivel: { text: 'Disponível', bg: 'bg-green-100', color: 'text-green-800' },
    alugado: { text: 'Alugado', bg: 'bg-yellow-100', color: 'text-yellow-800' },
    vendido: { text: 'Vendido', bg: 'bg-red-100', color: 'text-red-800' },
  };

  const currentStatus = statusStyles[status];

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${currentStatus.bg} ${currentStatus.color}`}
    >
      {currentStatus.text}
    </span>
  );
};

export default Badge;
