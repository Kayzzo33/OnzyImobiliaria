
import React, { useState, useEffect } from 'react';
import { Save, Building, Globe, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../../services/settingsService';
import type { AppSettings } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SettingsPage: React.FC = () => {
  const [formData, setFormData] = useState<AppSettings>({
      company_name: '', cnpj: '', description: '', phone: '', contact_email: '',
      address: '', city_state: '', instagram: '', facebook: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
      const fetchSettings = async () => {
          setLoading(true);
          const data = await getSettings();
          if (data) {
              setFormData(data);
          }
          setLoading(false);
      };
      fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateSettings(formData);
    if (error) {
        toast.error('Erro ao salvar: ' + error.message);
    } else {
        toast.success('Configurações salvas com sucesso!');
    }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-heading text-neutral-800 mb-6">Configurações</h1>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Informações da Empresa */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center"><Building size={20} className="mr-2 text-primary-500"/> Informações da Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="company_name" label="Nome da Imobiliária" value={formData.company_name || ''} onChange={handleChange} />
                <Input id="cnpj" label="CNPJ/CRECI" value={formData.cnpj || ''} onChange={handleChange} />
                <div className="md:col-span-2">
                    <Input id="description" label="Descrição Curta" value={formData.description || ''} onChange={handleChange} />
                </div>
            </div>
        </div>

        {/* Contato */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
             <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center"><Phone size={20} className="mr-2 text-primary-500"/> Contato & Endereço</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="phone" label="Telefone Principal" value={formData.phone || ''} onChange={handleChange} icon={<Phone size={16}/>} />
                <Input id="contact_email" label="Email de Contato" value={formData.contact_email || ''} onChange={handleChange} icon={<Mail size={16}/>} />
                <Input id="address" label="Endereço" value={formData.address || ''} onChange={handleChange} />
                <Input id="city_state" label="Cidade/Estado" value={formData.city_state || ''} onChange={handleChange} />
            </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
             <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center"><Globe size={20} className="mr-2 text-primary-500"/> Redes Sociais</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input id="instagram" label="Instagram" placeholder="@..." value={formData.instagram || ''} onChange={handleChange} icon={<Instagram size={16}/>} />
                <Input id="facebook" label="Facebook" placeholder="/..." value={formData.facebook || ''} onChange={handleChange} icon={<Facebook size={16}/>} />
            </div>
        </div>

        <div className="flex justify-end">
            <Button type="submit" size="lg" iconLeft={<Save size={20}/>} isLoading={saving}>Salvar Alterações</Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
