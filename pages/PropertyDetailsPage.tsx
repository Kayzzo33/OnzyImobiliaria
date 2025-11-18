
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Property } from '../types';
import { getPropertyById, incrementPropertyViews } from '../services/propertyService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const PropertyDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            if (id) {
                setLoading(true);
                const data = await getPropertyById(id);
                setProperty(data || null);
                setLoading(false);
                // Increment view count
                incrementPropertyViews(id);
            }
        };
        fetchProperty();
    }, [id]);

    const formatPrice = (price: number, finalidade: 'venda' | 'aluguel') => {
        let options: Intl.NumberFormatOptions = {
          style: 'currency',
          currency: 'BRL',
        };
    
        if (finalidade === 'aluguel') {
            options.minimumFractionDigits = 0;
            options.maximumFractionDigits = 0;
        }
    
        return new Intl.NumberFormat('pt-BR', options).format(price);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    if (!property) {
        return <div className="text-center py-20">Imóvel não encontrado.</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <span className="text-sm font-bold uppercase text-primary-500">
                {property.finalidade === 'venda' ? 'Imóvel à Venda' : 'Imóvel para Alugar'}
            </span>
            <h1 className="text-4xl font-bold font-heading text-neutral-800 mt-1">{property.title}</h1>
            <div className="flex justify-between items-end mt-2">
                <p className="text-lg text-neutral-600">{property.neighborhood}, {property.city}</p>
                <p className="text-sm text-neutral-500">{property.views || 0} visualizações</p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <img src={property.images[0]} alt={property.title} className="w-full h-auto rounded-lg shadow-lg object-cover" />
                </div>
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-sm text-neutral-500">{property.finalidade === 'venda' ? 'Valor de Venda' : 'Aluguel Mensal'}</p>
                        <h2 className="text-3xl font-bold font-heading text-primary-500">{formatPrice(property.price, property.finalidade)}</h2>
                        <p className="mt-4 text-neutral-700">{property.description}</p>
                        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
                            <p><strong>Quartos:</strong> {property.bedrooms}</p>
                            <p><strong>Banheiros:</strong> {property.bathrooms}</p>
                            <p><strong>Vagas:</strong> {property.vagas}</p>
                            <p><strong>Área:</strong> {property.area_m2} m²</p>
                            <p><strong>Código:</strong> {property.codigo}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold font-heading">Página de Detalhes em Construção</h2>
                <p>Aqui teríamos a galeria de fotos completa, mapa interativo com Leaflet, scores detalhados da IA, imóveis similares e formulário de agendamento.</p>
            </div>
        </div>
    );
};

export default PropertyDetailsPage;
