
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BarChart, Save, Info, Camera, MapPin, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

import type { Property } from '../../types';
import { addProperty, updateProperty } from '../../services/propertyService';
import { generatePropertyDescription, generatePropertyScore } from '../../services/geminiService';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface PropertyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    property: Property | null;
}

const emptyProperty: Partial<Property> = {
    codigo: '',
    title: '',
    description: '',
    type: 'apartamento',
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    vagas: 0,
    area_m2: 0,
    address: '',
    city: 'Americana',
    neighborhood: '',
    latitude: -22.7393,
    longitude: -47.3307,
    images: ['https://picsum.photos/seed/newprop/800/600'],
    status: 'disponivel',
    finalidade: 'venda',
    featured: false,
    score: { location: 0, costBenefit: 0, appreciation: 0, analysis: '' },
    // Amenities
    pool: false, barbecue_grill: false, backyard: false, furnished: false, pets_allowed: false,
    leisure_area: false, gym: false, concierge_24h: false, elevator: false, balcony: false,
    built_in_closets: false, air_conditioning: false,
};

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ isOpen, onClose, onSave, property }) => {
    const [formData, setFormData] = useState<Partial<Property>>(emptyProperty);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [isGeneratingScore, setIsGeneratingScore] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (isOpen) {
            setActiveTab('basic'); // Reset to first tab on open
            if (property) {
                setFormData(property);
            } else {
                setFormData(emptyProperty);
            }
        }
    }, [property, isOpen]);
    
    const isEditing = useMemo(() => !!property, [property]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: any = value;
        if (type === 'number') {
            processedValue = value ? parseFloat(value) : 0;
        } else if (type === 'checkbox') {
            processedValue = (e.target as HTMLInputElement).checked;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        const description = await generatePropertyDescription(formData);
        setFormData(prev => ({ ...prev, description }));
        setIsGeneratingDesc(false);
    };
    
    const handleGenerateScore = async () => {
        setIsGeneratingScore(true);
        const score = await generatePropertyScore(formData);
        if(score) {
            setFormData(prev => ({ ...prev, score }));
        } else {
            toast.error("Não foi possível gerar o score.");
        }
        setIsGeneratingScore(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const toastId = toast.loading(isEditing ? 'Atualizando imóvel...' : 'Adicionando imóvel...');
        
        const { id, created_at, score, ...saveData } = formData;
        const dataToSave = { ...emptyProperty, ...saveData };

        try {
            let error;
            if (isEditing && id) {
                ({ error } = await updateProperty(id, dataToSave));
            } else {
                ({ error } = await addProperty(dataToSave as any));
            }
            if (error) throw error;
            toast.success(`Imóvel ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`);
            onSave();
        } catch (err: any) {
            console.error(err);
            if (err.message && err.message.includes('row-level security')) {
                 toast.error('Erro de Permissão: Verifique as Policies (RLS) no Supabase.');
            } else {
                 toast.error(`Erro: ${err.message}`);
            }
        } finally {
            setIsSaving(false);
            toast.dismiss(toastId);
        }
    };

    const amenities = [
        { key: 'pool', label: 'Piscina' }, { key: 'barbecue_grill', label: 'Churrasqueira' },
        { key: 'backyard', label: 'Quintal' }, { key: 'furnished', label: 'Mobiliado' },
        { key: 'pets_allowed', label: 'Aceita pet' }, { key: 'leisure_area', label: 'Área de lazer' },
        { key: 'gym', label: 'Academia' }, { key: 'concierge_24h', label: 'Portaria 24h' },
        { key: 'elevator', label: 'Elevador' }, { key: 'balcony', label: 'Sacada' },
        { key: 'built_in_closets', label: 'Armários embutidos' }, { key: 'air_conditioning', label: 'Ar condicionado' },
    ];

    const TabButton = ({ tabId, icon, label }: { tabId: string, icon: React.ReactNode, label: string }) => (
        <button
            type="button"
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tabId
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}
        >
            {icon} {label}
        </button>
    );
    
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.95 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold font-heading">{isEditing ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}</h2>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-100"><X size={20} /></button>
                        </div>

                        <div className="border-b border-neutral-200">
                             <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                                <TabButton tabId="basic" icon={<Info size={16} />} label="Informações Básicas" />
                                <TabButton tabId="media" icon={<Camera size={16} />} label="Mídia & Detalhes" />
                                <TabButton tabId="location" icon={<MapPin size={16} />} label="Localização" />
                                <TabButton tabId="analysis" icon={<BarChart size={16} />} label="Análise IA" />
                             </nav>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex-grow overflow-hidden">
                            <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
                                {activeTab === 'basic' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input label="Título do Imóvel" name="title" value={formData.title} onChange={handleChange} required />
                                            <Input label="Código" name="codigo" value={formData.codigo} onChange={handleChange} required />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-neutral-800 mb-1">Descrição</label>
                                            <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
                                            <Button type="button" size="sm" variant="secondary" className="absolute bottom-3 right-3" onClick={handleGenerateDescription} isLoading={isGeneratingDesc} iconLeft={<Sparkles size={14}/>}>Gerar com IA</Button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <Input label="Preço (R$)" name="price" type="number" value={formData.price || ''} onChange={handleChange} required />
                                            <Input label="Área (m²)" name="area_m2" type="number" value={formData.area_m2 || ''} onChange={handleChange} required />
                                            <Input label="Quartos" name="bedrooms" type="number" value={formData.bedrooms || ''} onChange={handleChange} required />
                                            <Input label="Banheiros" name="bathrooms" type="number" value={formData.bathrooms || ''} onChange={handleChange} required />
                                            <Input label="Vagas" name="vagas" type="number" value={formData.vagas || ''} onChange={handleChange} required />
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-800 mb-1">Tipo</label>
                                                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                                                    <option value="apartamento">Apartamento</option>
                                                    <option value="casa">Casa</option>
                                                    <option value="kitnet">Kitnet</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-800 mb-1">Finalidade</label>
                                                <select name="finalidade" value={formData.finalidade} onChange={handleChange} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                                                    <option value="venda">Venda</option>
                                                    <option value="aluguel">Aluguel</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-800 mb-1">Status</label>
                                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                                                    <option value="disponivel">Disponível</option>
                                                    <option value="alugado">Alugado</option>
                                                    <option value="vendido">Vendido</option>
                                                </select>
                                            </div>
                                        </div>
                                         <div className="flex items-center space-x-2 pt-2">
                                            <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"/>
                                            <label htmlFor="featured" className="text-sm font-medium text-neutral-800">Marcar como destaque?</label>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'media' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-neutral-800 mb-2">Fotos do Imóvel</h3>
                                            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center text-neutral-500">
                                                <p>Área de Upload de Fotos (Drag & Drop em construção)</p>
                                                <Button type="button" variant="secondary" className="mt-4">Selecionar Arquivos</Button>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-neutral-800 mb-2">Características Adicionais</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {amenities.map(amenity => (
                                                     <div key={amenity.key} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={amenity.key}
                                                            name={amenity.key}
                                                            checked={!!formData[amenity.key as keyof Property]}
                                                            onChange={handleChange}
                                                            className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                                                        />
                                                        <label htmlFor={amenity.key} className="ml-2 text-sm text-neutral-700">{amenity.label}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'location' && (
                                     <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Input label="Endereço" name="address" value={formData.address} onChange={handleChange} />
                                            <Input label="Bairro" name="neighborhood" value={formData.neighborhood} onChange={handleChange} />
                                            <Input label="Cidade" name="city" value={formData.city} onChange={handleChange} />
                                        </div>
                                        <div className="p-4 bg-neutral-100 rounded-lg text-center text-neutral-500">
                                            Mapa Interativo (Em Construção)
                                        </div>
                                        <div className="flex justify-center">
                                            <Button type="button" variant="secondary" iconLeft={<MapPin size={16} />}>Buscar Coordenadas</Button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'analysis' && (
                                    <div className="p-3 bg-primary-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-semibold text-primary-700 flex items-center"><BarChart size={20} className="mr-2"/>Imóvel Score (IA)</p>
                                            <Button type="button" size="md" variant="secondary" onClick={handleGenerateScore} isLoading={isGeneratingScore} iconLeft={<Sparkles size={16}/>}>Gerar/Atualizar Score</Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                                            <div><p className="text-sm text-neutral-600">Localização</p><p className="font-bold text-2xl text-primary-700">{formData.score?.location || 'N/A'}</p></div>
                                            <div><p className="text-sm text-neutral-600">Custo x Benefício</p><p className="font-bold text-2xl text-primary-700">{formData.score?.costBenefit || 'N/A'}</p></div>
                                            <div><p className="text-sm text-neutral-600">Valorização</p><p className="font-bold text-2xl text-primary-700">{formData.score?.appreciation || 'N/A'}</p></div>
                                        </div>
                                        <p className="text-sm text-primary-700/80 mt-4 text-center italic p-3 bg-white rounded-md">{formData.score?.analysis || 'A análise da IA sobre os pontos fortes do imóvel aparecerá aqui.'}</p>
                                    </div>
                                )}

                            </div>
                            <div className="flex justify-end items-center p-4 bg-neutral-50 border-t sticky bottom-0">
                                <Button type="button" variant="secondary" onClick={onClose} className="mr-2">Cancelar</Button>
                                <Button type="submit" isLoading={isSaving} iconLeft={<Save size={16}/>}>Salvar Imóvel</Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PropertyFormModal;
