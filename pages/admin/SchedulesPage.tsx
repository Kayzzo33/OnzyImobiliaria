
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, User, PlusCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSchedules, updateScheduleStatus, addSchedule, deleteSchedule } from '../../services/scheduleService';
import { getAllProperties } from '../../services/propertyService';
import type { Schedule, Property } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  
  // New Schedule Form State
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    client_name: '',
    client_phone: '',
    date: '',
    time: '',
    property_id: '',
    status: 'pending'
  });

  const fetchData = async () => {
    setLoading(true);
    const [schedulesData, propertiesData] = await Promise.all([
        getSchedules(),
        getAllProperties()
    ]);
    setSchedules(schedulesData);
    setProperties(propertiesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    const { error } = await updateScheduleStatus(id, newStatus);
    if (error) {
        toast.error('Erro ao atualizar status.');
    } else {
        toast.success('Status atualizado!');
        fetchData();
    }
  };
  
  const handleDelete = async (id: number) => {
      if(!window.confirm("Deseja excluir este agendamento?")) return;
      const { error } = await deleteSchedule(id);
      if (error) {
          toast.error("Erro ao excluir.");
      } else {
          toast.success("Agendamento excluído.");
          fetchData();
      }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newSchedule.property_id || !newSchedule.date || !newSchedule.time) {
          toast.error("Preencha todos os campos obrigatórios.");
          return;
      }

      const { error } = await addSchedule(newSchedule as Schedule);
      if (error) {
          toast.error("Erro ao criar agendamento.");
          console.error(error);
      } else {
          toast.success("Agendamento criado!");
          setIsModalOpen(false);
          setNewSchedule({ client_name: '', client_phone: '', date: '', time: '', property_id: '', status: 'pending' });
          fetchData();
      }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-800">Agendamentos</h1>
          <p className="text-neutral-600">Gerencie as visitas aos imóveis.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} iconLeft={<PlusCircle size={18}/>}>
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pendentes */}
        <div className="bg-neutral-100 p-4 rounded-xl">
            <h2 className="font-bold text-neutral-700 mb-4 flex items-center"><Clock size={18} className="mr-2"/> Pendentes</h2>
            <div className="space-y-4">
                {schedules.filter(s => s.status === 'pending').map(schedule => (
                    <ScheduleCard key={schedule.id} schedule={schedule} onAction={handleStatusUpdate} onDelete={handleDelete} />
                ))}
                {schedules.filter(s => s.status === 'pending').length === 0 && <p className="text-sm text-neutral-400 text-center italic">Nenhum agendamento pendente.</p>}
            </div>
        </div>

        {/* Confirmados */}
        <div className="bg-neutral-100 p-4 rounded-xl">
            <h2 className="font-bold text-neutral-700 mb-4 flex items-center"><CheckCircle size={18} className="mr-2 text-blue-600"/> Confirmados</h2>
             <div className="space-y-4">
                {schedules.filter(s => s.status === 'confirmed').map(schedule => (
                    <ScheduleCard key={schedule.id} schedule={schedule} onAction={handleStatusUpdate} onDelete={handleDelete} />
                ))}
                 {schedules.filter(s => s.status === 'confirmed').length === 0 && <p className="text-sm text-neutral-400 text-center italic">Nenhum agendamento confirmado.</p>}
            </div>
        </div>

        {/* Histórico (Realizados/Cancelados) */}
        <div className="bg-neutral-100 p-4 rounded-xl">
            <h2 className="font-bold text-neutral-700 mb-4 flex items-center"><Calendar size={18} className="mr-2"/> Histórico Recente</h2>
             <div className="space-y-4 opacity-80">
                {schedules.filter(s => s.status === 'done' || s.status === 'canceled').map(schedule => (
                    <ScheduleCard key={schedule.id} schedule={schedule} onAction={handleStatusUpdate} onDelete={handleDelete} readOnly />
                ))}
            </div>
        </div>
      </div>

      {/* Modal Novo Agendamento */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
              <Card className="w-full max-w-md p-6">
                  <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                      <Input label="Nome do Cliente" value={newSchedule.client_name} onChange={e => setNewSchedule({...newSchedule, client_name: e.target.value})} required />
                      <Input label="Telefone" value={newSchedule.client_phone} onChange={e => setNewSchedule({...newSchedule, client_phone: e.target.value})} />
                      <div>
                          <label className="block text-sm font-medium text-neutral-800 mb-1">Imóvel</label>
                          <select 
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                            value={newSchedule.property_id}
                            onChange={e => setNewSchedule({...newSchedule, property_id: e.target.value})}
                            required
                          >
                              <option value="">Selecione um imóvel</option>
                              {properties.map(p => (
                                  <option key={p.id} value={p.id}>{p.codigo} - {p.title}</option>
                              ))}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="date" label="Data" value={newSchedule.date} onChange={e => setNewSchedule({...newSchedule, date: e.target.value})} required />
                        <Input type="time" label="Hora" value={newSchedule.time} onChange={e => setNewSchedule({...newSchedule, time: e.target.value})} required />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                          <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                          <Button type="submit">Salvar</Button>
                      </div>
                  </form>
              </Card>
          </div>
      )}
    </div>
  );
};

interface ScheduleCardProps {
  schedule: Schedule;
  onAction: (id: number, status: string) => void;
  onDelete: (id: number) => void;
  readOnly?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onAction, onDelete, readOnly = false }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 relative group">
        <button onClick={() => onDelete(schedule.id)} className="absolute top-2 right-2 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={16} />
        </button>
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-neutral-800 truncate w-3/4">{schedule.client_name}</h3>
            {readOnly && (
                 <span className={`w-2 h-2 rounded-full ${schedule.status === 'done' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            )}
        </div>
        <p className="text-xs text-neutral-500 mb-2 flex items-center"><User size={12} className="mr-1"/> {schedule.client_phone || 'Sem telefone'}</p>
        <p className="text-sm text-primary-600 font-medium mb-3 truncate">
            {schedule.properties ? `${schedule.properties.codigo} - ${schedule.properties.title}` : 'Imóvel removido'}
        </p>
        
        <div className="flex items-center text-xs text-neutral-500 mb-3">
            <Calendar size={14} className="mr-1"/> {new Date(schedule.date).toLocaleDateString('pt-BR')}
            <Clock size={14} className="ml-3 mr-1"/> {schedule.time}
        </div>

        {!readOnly && schedule.status === 'pending' && (
            <div className="flex gap-2 mt-2">
                <button onClick={() => onAction(schedule.id, 'confirmed')} className="flex-1 bg-green-50 text-green-700 py-1.5 rounded text-xs font-bold hover:bg-green-100 transition-colors">Confirmar</button>
                <button onClick={() => onAction(schedule.id, 'canceled')} className="flex-1 bg-red-50 text-red-700 py-1.5 rounded text-xs font-bold hover:bg-red-100 transition-colors">Cancelar</button>
            </div>
        )}
         {!readOnly && schedule.status === 'confirmed' && (
            <div className="flex gap-2 mt-2">
                <button onClick={() => onAction(schedule.id, 'done')} className="flex-1 bg-neutral-800 text-white py-1.5 rounded text-xs font-bold hover:bg-neutral-700 transition-colors">Concluir</button>
                <button onClick={() => onAction(schedule.id, 'canceled')} className="bg-red-50 text-red-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-red-100 transition-colors">X</button>
            </div>
        )}
    </div>
);

export default SchedulesPage;
