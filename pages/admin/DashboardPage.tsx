import React, { useMemo, useState, useEffect } from 'react';
import { Home, Calendar, Users, Eye, PieChart, BarChart2, TrendingUp, Activity } from 'lucide-react';
import { getAllProperties } from '../../services/propertyService';
import { getSchedules } from '../../services/scheduleService';
import type { Property, Schedule } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const [propData, schedData] = await Promise.all([
            getAllProperties(),
            getSchedules()
        ]);
        setProperties(propData);
        setSchedules(schedData);
        setLoading(false);
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = properties.length;
    
    const scheduledVisits = schedules.filter(s => s.status === 'pending' || s.status === 'confirmed').length;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const leadsGenerated = schedules.filter(s => s.created_at && new Date(s.created_at) > oneWeekAgo).length;

    const topProperty = properties.length > 0 
        ? [...properties].sort((a, b) => (b.views || 0) - (a.views || 0))[0] 
        : null;

    // Calculate city distribution for Pie Chart
    const cityCounts: Record<string, number> = {};
    properties.forEach(p => {
        cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
    });
    const cityData = Object.entries(cityCounts).map(([name, count]) => ({ name, count }));

    // Calculate schedule status for Bar Chart
    const statusCounts: Record<string, number> = { pending: 0, confirmed: 0, done: 0, canceled: 0 };
    schedules.forEach(s => {
        if (statusCounts[s.status] !== undefined) {
            statusCounts[s.status]++;
        }
    });

    // Calculate simple timeline for Line Chart (Schedules created per day, last 7 days)
    const dates: Record<string, number> = {};
    for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        dates[dateStr] = 0;
    }
    schedules.forEach(s => {
        if (s.created_at) {
            const d = new Date(s.created_at);
            const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            if (dates[dateStr] !== undefined) dates[dateStr]++;
        }
    });
    const timelineData = Object.entries(dates).map(([date, count]) => ({ date, count }));


    return {
      total,
      scheduledVisits,
      leadsGenerated,
      topPropertyTitle: topProperty?.title || 'N/A',
      topPropertyViews: topProperty?.views || 0,
      cityData,
      statusCounts,
      timelineData
    }
  }, [properties, schedules]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
        <h1 className="text-3xl font-bold font-heading text-neutral-800 mb-6">Dashboard</h1>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPI_Card icon={<Home size={24}/>} title="Total de Imóveis" value={stats.total} change="Cadastrados" iconBg="bg-blue-100" iconColor="text-blue-600" />
            <KPI_Card icon={<Calendar size={24}/>} title="Visitas Agendadas" value={stats.scheduledVisits} change="Pendentes/Confirmadas" iconBg="bg-green-100" iconColor="text-green-600" />
            <KPI_Card icon={<Users size={24}/>} title="Novos Leads (7d)" value={stats.leadsGenerated} change="Solicitações recentes" iconBg="bg-purple-100" iconColor="text-purple-600" />
            <KPI_Card icon={<Eye size={24}/>} title="Imóvel Mais Visto" value={stats.topPropertyViews} change={stats.topPropertyTitle} iconBg="bg-orange-100" iconColor="text-orange-600" isTitle={true} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Line Chart - New Leads Timeline */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-neutral-800 mb-4 flex items-center"><TrendingUp size={20} className="mr-2"/> Novos Agendamentos (Últimos 7 dias)</h3>
                <div className="h-64 flex items-end justify-between space-x-2 px-4">
                    {stats.timelineData.map((item, index) => (
                         <div key={index} className="flex flex-col items-center flex-1 group">
                             <div className="relative w-full flex justify-center">
                                 <div 
                                    className="bg-primary-500 w-full max-w-[30px] rounded-t-md transition-all duration-500 group-hover:bg-primary-600" 
                                    style={{ height: `${Math.max(item.count * 20, 4)}px` }}
                                 ></div>
                                 <div className="absolute -top-8 bg-neutral-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                     {item.count} leads
                                 </div>
                             </div>
                             <span className="text-xs text-neutral-500 mt-2">{item.date}</span>
                         </div>
                    ))}
                </div>
            </div>

            {/* Pie Chart - City Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-neutral-800 mb-4 flex items-center"><PieChart size={20} className="mr-2"/> Imóveis por Cidade</h3>
                <div className="space-y-4 mt-6">
                    {stats.cityData.map((city, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-neutral-700 font-medium">{city.name}</span>
                                <span className="text-neutral-500">{Math.round((city.count / stats.total) * 100)}%</span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${(city.count / stats.total) * 100}%`, opacity: 1 - (index * 0.15) }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    {stats.cityData.length === 0 && <p className="text-neutral-400 text-center">Sem dados de cidade.</p>}
                </div>
            </div>
        </div>
        
        {/* Bar Chart - Schedule Status */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="font-bold text-lg text-neutral-800 mb-6 flex items-center"><BarChart2 size={20} className="mr-2"/> Status de Agendamentos</h3>
            <div className="flex items-center space-x-2 sm:space-x-8 overflow-x-auto">
                 {Object.entries(stats.statusCounts).map(([status, count]) => {
                     let color = 'bg-neutral-400';
                     let label = status;
                     if (status === 'pending') { color = 'bg-yellow-400'; label = 'Pendentes'; }
                     if (status === 'confirmed') { color = 'bg-blue-500'; label = 'Confirmados'; }
                     if (status === 'done') { color = 'bg-green-500'; label = 'Concluídos'; }
                     if (status === 'canceled') { color = 'bg-red-400'; label = 'Cancelados'; }

                     // FIX: Use Object.values to sum all counts instead of accessing by key to avoid type errors with arithmetic operations.
                     const total = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0);

                    return (
                        <div key={status} className="flex-1 min-w-[100px]">
                             <div className="flex justify-between mb-2">
                                 <span className="text-sm font-medium text-neutral-600">{label}</span>
                                 <span className="text-sm font-bold">{count}</span>
                             </div>
                             <div className="w-full bg-neutral-100 h-3 rounded-full">
                                 <div className={`${color} h-3 rounded-full`} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}></div>
                             </div>
                        </div>
                    );
                 })}
            </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-neutral-800 mb-4 flex items-center"><Activity size={20} className="mr-2"/> Atividades Recentes</h3>
            <div className="space-y-4">
                 {schedules.slice(0, 5).map((schedule) => (
                     <div key={schedule.id} className="flex items-start pb-4 border-b border-neutral-50 last:border-0">
                         <div className="bg-primary-50 p-2 rounded-full text-primary-600 mr-3 mt-1">
                             <Users size={16} />
                         </div>
                         <div>
                             <p className="text-sm text-neutral-800">
                                 <span className="font-bold">{schedule.client_name}</span> solicitou uma visita.
                             </p>
                             <p className="text-xs text-neutral-500 mt-0.5">
                                 Imóvel: {schedule.properties?.codigo || 'N/A'} • {new Date(schedule.created_at || new Date()).toLocaleDateString('pt-BR')}
                             </p>
                         </div>
                     </div>
                 ))}
                 {schedules.length === 0 && <p className="text-neutral-400 text-center italic">Nenhuma atividade recente.</p>}
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
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 hover:shadow-lg transition-shadow">
        <div className={`p-3 rounded-full ${iconBg} ${iconColor}`}>
            {icon}
        </div>
        <div className="overflow-hidden">
            <p className="text-sm text-neutral-500">{title}</p>
            <p className={`text-2xl font-bold text-neutral-800 ${isTitle ? 'text-base truncate' : ''}`}>{isTitle ? change : value}</p>
            <p className={`text-xs mt-1 ${isTitle ? 'text-neutral-500' : 'text-green-600'}`}>{isTitle ? `${value} visualizações` : change}</p>
        </div>
    </div>
);


export default DashboardPage;