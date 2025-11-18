
import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, DollarSign, Home, PieChart, Calendar, CheckCircle } from 'lucide-react';
import { getAllProperties } from '../../services/propertyService';
import { getSchedules } from '../../services/scheduleService';
import type { Property, Schedule } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AnalyticsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
        setLoading(true);
        const [propsData, schedsData] = await Promise.all([
            getAllProperties(),
            getSchedules()
        ]);
        setProperties(propsData);
        setSchedules(schedsData);
        setLoading(false);
    };
    fetch();
  }, []);

  const stats = useMemo(() => {
    if (!properties.length && !schedules.length) return null;

    // Property Stats
    const totalValue = properties
        .filter(p => p.finalidade === 'venda')
        .reduce((acc, curr) => acc + curr.price, 0);
    
    const averagePrice = totalValue / (properties.filter(p => p.finalidade === 'venda').length || 1);

    const typeDistribution = properties.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusDistribution = properties.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Schedule Stats
    const pendingVisits = schedules.filter(s => s.status === 'pending').length;
    const doneVisits = schedules.filter(s => s.status === 'done').length;

    return { 
        totalValue, 
        averagePrice, 
        typeDistribution, 
        statusDistribution, 
        total: properties.length,
        pendingVisits,
        doneVisits
    };
  }, [properties, schedules]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading text-neutral-800 mb-2">Analytics</h1>
      <p className="text-neutral-600 mb-8">Visão geral da performance da imobiliária.</p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-neutral-500 font-medium text-sm">Valor em Carteira</h3>
                <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="text-green-600" size={20}/></div>
            </div>
            <p className="text-2xl font-bold text-neutral-800">{formatCurrency(stats?.totalValue || 0)}</p>
            <p className="text-xs text-green-600 mt-1">Preço Médio: {formatCurrency(stats?.averagePrice || 0)}</p>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-neutral-500 font-medium text-sm">Total de Imóveis</h3>
                <div className="p-2 bg-purple-100 rounded-lg"><Home className="text-purple-600" size={20}/></div>
            </div>
            <p className="text-2xl font-bold text-neutral-800">{stats?.total}</p>
             <p className="text-xs text-neutral-400 mt-1">Cadastrados</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-neutral-500 font-medium text-sm">Visitas Pendentes</h3>
                <div className="p-2 bg-yellow-100 rounded-lg"><Calendar className="text-yellow-600" size={20}/></div>
            </div>
            <p className="text-2xl font-bold text-neutral-800">{stats?.pendingVisits}</p>
             <p className="text-xs text-yellow-600 mt-1">Aguardando ação</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-neutral-500 font-medium text-sm">Visitas Realizadas</h3>
                <div className="p-2 bg-blue-100 rounded-lg"><CheckCircle className="text-blue-600" size={20}/></div>
            </div>
            <p className="text-2xl font-bold text-neutral-800">{stats?.doneVisits}</p>
             <p className="text-xs text-blue-600 mt-1">Total histórico</p>
        </div>
      </div>

      {/* Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Type Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-lg text-neutral-800 mb-6 flex items-center"><PieChart size={20} className="mr-2"/> Distribuição por Tipo</h3>
            <div className="space-y-4">
                {Object.entries(stats?.typeDistribution || {}).map(([type, count]) => (
                    <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize text-neutral-700 font-medium">{type}</span>
                            <span className="text-neutral-500">{count} ({Math.round(((count as number) / (stats?.total || 1)) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2.5">
                            <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${((count as number) / (stats?.total || 1)) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-lg text-neutral-800 mb-6 flex items-center"><TrendingUp size={20} className="mr-2"/> Status do Portfólio</h3>
             <div className="space-y-4">
                {Object.entries(stats?.statusDistribution || {}).map(([status, count]) => {
                     let color = 'bg-neutral-400';
                     if (status === 'disponivel') color = 'bg-green-500';
                     if (status === 'alugado') color = 'bg-yellow-500';
                     if (status === 'vendido') color = 'bg-blue-600';

                    return (
                        <div key={status}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="uppercase text-xs font-bold tracking-wider text-neutral-600">{status}</span>
                                <span className="text-neutral-800 font-bold">{count}</span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-4">
                                <div className={`${color} h-4 rounded-full transition-all duration-500`} style={{ width: `${((count as number) / (stats?.total || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
