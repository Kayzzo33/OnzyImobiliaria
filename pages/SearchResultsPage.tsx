
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Property } from '../types';
import { getAllProperties } from '../services/propertyService';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SearchResultsPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // In a real app, you would use URL search params to filter
        // const searchParams = new URLSearchParams(location.search);
        
        const fetchProperties = async () => {
            setLoading(true);
            const data = await getAllProperties();
            setProperties(data);
            setLoading(false);
        };

        fetchProperties();
    }, [location]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-heading text-neutral-800">Resultados da Busca</h1>
            <p className="mt-2 text-neutral-600">Encontramos {properties.length} imóveis para você.</p>
            
            {loading ? <LoadingSpinner className="h-64" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
             <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold font-heading">Página de Busca em Construção</h2>
                <p>Aqui teríamos filtros avançados na lateral, paginação ou scroll infinito e ordenação de resultados.</p>
            </div>
        </div>
    );
};

export default SearchResultsPage;
