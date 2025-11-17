
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import type { Property } from '../types';
import { getFeaturedProperties, getAllProperties } from '../services/propertyService';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilters from '../components/property/PropertyFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [featuredData, allData] = await Promise.all([
          getFeaturedProperties(),
          getAllProperties()
        ]);
        setFeatured(featuredData);
        setAllProperties(allData);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-neutral-100">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/seed/hero/1920/1080)' }}>
        <div className="absolute inset-0 bg-neutral-800/60" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-extrabold text-white font-heading"
            >
                Encontre o seu <span className="text-primary-500">Lar</span> Perfeito
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-lg md:text-xl text-neutral-200 max-w-2xl"
            >
                Com a ajuda da nossa inteligência artificial, encontrar o imóvel dos seus sonhos nunca foi tão fácil e preciso.
            </motion.p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyFilters />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Properties */}
        <section>
          <h2 className="text-3xl font-bold text-neutral-800 font-heading">Imóveis em Destaque</h2>
          <p className="mt-2 text-neutral-600">As melhores oportunidades selecionadas para você.</p>
          {loading ? <LoadingSpinner className="h-64" /> : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {featured.map(property => (
                <motion.div key={property.id} variants={itemVariants}>
                    <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* All Properties */}
        <section className="mt-16">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-800 font-heading">Todos os Imóveis</h2>
              <p className="mt-2 text-neutral-600">Explore nosso catálogo completo.</p>
            </div>
            <Button variant="secondary">Ver Todos</Button>
          </div>
          {loading ? <LoadingSpinner className="h-64"/> : (
             <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
             >
              {allProperties.slice(0, 6).map(property => (
                <motion.div key={property.id} variants={itemVariants}>
                    <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
