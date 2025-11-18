
import React, { useMemo, useState, useEffect } from 'react';
import { Home, DollarSign, Building, Calendar, Users, Eye } from 'lucide-react';
import { getAllProperties } from '../../services/propertyService';
import type { Property } from '../../types';

const DashboardPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
        setLoading(true);
        const data = await getAllProperties();
        setProperties(data);
        setLoading(false);
    };
    fetchProperties();
  }, []);

  const stats = useMemo(() => {
    // NOTE: Hardcoded values for demonstration until backend is ready
    return {
      total: properties.length,
      forSale: properties.filter(p => p.finalidade === 'venda').length,
      forRent: properties.filter(p => p.finalidade === 'aluguel').length,
      scheduledVisits: 12, // Mock data
      leadsGenerated: 34, // Mock data
      topProperty: properties.length > 0 ? properties[0].title : 'N/A',
      topPropertyViews: 128, // Mock data
    }
  }, [properties]);

  return (
    <div>
        <h1 className="text-3xl font-bold font-heading text-neutral-800 mb-6">Dashboard</h1>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPI_Card icon={<Home size={24}/>} title="Total de Imóveis" value={loading ? '...' : stats.total} change="+5 esta semana" iconBg="bg-blue-100" iconColor="text-blue-600" />
            <KPI_Card icon={<Calendar size={24}/>} title="Visitas Agendadas" value={loading ? '...' : stats.scheduledVisits} change="Aguardando confirmação" iconBg="bg-green-100" iconColor="text-green-600" />
            <KPI_Card icon={<Users size={24}/>} title="Leads Gerados (7d)" value={loading ? '...' : stats.leadsGenerated} change="12% de conversão" iconBg="bg-purple-100" iconColor="text-purple-600" />
            <KPI_Card icon={<Eye size={24}/>} title="Imóvel Mais Visto" value={loading ? '...' : stats.topPropertyViews} change={stats.topProperty} iconBg="bg-orange-100" iconColor="text-orange-600" isTitle={true} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md h-80 flex items-center justify-center text-neutral-400">
                Gráfico de Linhas: Visualizações por Dia (Em Construção)
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-80 flex items-center justify-center text-neutral-400">
                Gráfico de Pizza: Imóveis por Cidade (Em Construção)
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center text-neutral-400 mb-8">
            Gráfico de Barras: Status de Agendamentos (Em Construção)
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md h-96 flex items-center justify-center text-neutral-400">
                Lista: Próximas Visitas Hoje (Em Construção)
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-96 flex items-center justify-center text-neutral-400">
                Lista: Leads Não Contactados (Em Construção)
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-96 flex items-center justify-center text-neutral-400">
                Timeline: Atividade Recente (Em Construção)
            </div>
        </div>
    </div>
  );
};

interface KPI_CardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change: string;
    iconBg: string;
    iconColor: string;
    isTitle?: boolean;
}

const KPI_Card: React.FC<KPI_CardProps> = ({ icon, title, value, change, iconBg, iconColor, isTitle=false }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
        <div className={`p-3 rounded-full ${iconBg} ${iconColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-neutral-500">{title}</p>
            <p className={`text-2xl font-bold text-neutral-800 ${isTitle ? 'text-base truncate' : ''}`}>{isTitle ? change : value}</p>
            <p className={`text-xs mt-1 ${isTitle ? 'text-neutral-500' : 'text-green-600'}`}>{isTitle ? `${value} visualizações hoje` : change}</p>
        </div>
    </div>
);


export default DashboardPage;
