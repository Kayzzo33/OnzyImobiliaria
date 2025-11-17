
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Property } from '../types';
import { getPropertyById } from '../services/propertyService';
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
            }
        };
        fetchProperty();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    if (!property) {
        return <div className="text-center py-20">Imóvel não encontrado.</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold font-heading text-neutral-800">{property.title}</h1>
            <p className="text-lg text-neutral-600 mt-2">{property.neighborhood}, {property.city}</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <img src={property.images[0]} alt={property.title} className="w-full h-auto rounded-lg shadow-lg object-cover" />
                </div>
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold font-heading text-primary-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}</h2>
                        <p className="mt-4 text-neutral-700">{property.description}</p>
                        <div className="mt-6 space-y-2">
                            <p><strong>Quartos:</strong> {property.bedrooms}</p>
                            <p><strong>Banheiros:</strong> {property.bathrooms}</p>
                            <p><strong>Área:</strong> {property.area_m2} m²</p>
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
