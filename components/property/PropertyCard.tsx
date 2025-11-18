import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Ruler, Heart, Star, BarChart, Car } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import type { Property } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useAppStore } from '../../stores/useAppStore';
import toast from 'react-hot-toast';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { addFavorite, removeFavorite, isFavorite } = useAppStore();
  const favorite = isFavorite(property.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(property.id);
      toast.error('Removido dos favoritos!');
    } else {
      addFavorite(property.id);
      toast.success('Adicionado aos favoritos!');
    }
  };

  const formatPrice = (price: number) => {
    // FIX: Explicitly typed `options` as `Intl.NumberFormatOptions` to allow dynamically adding properties.
    let options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: 'BRL',
    };

    if (property.finalidade === 'aluguel') {
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 0;
    }

    return new Intl.NumberFormat('pt-BR', options).format(price);
  };
  
  const totalScore = Math.round((property.score.location + property.score.costBenefit + property.score.appreciation) / 3);

  return (
    <Card isFeatured={property.featured}>
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="h-56"
        >
          {property.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Foto ${index + 1} de ${property.title}`} className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <Badge status={property.status} />
        </div>
         <div className="absolute top-3 right-12 z-10 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-md">
            CÓD: {property.codigo}
        </div>
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-10 p-2 bg-white/70 rounded-full backdrop-blur-sm"
        >
          <Heart size={20} className={`transition-colors ${favorite ? 'text-red-500 fill-current' : 'text-neutral-800'}`} />
        </motion.button>
      </div>
      <div className="p-4">
        <p className="text-sm text-neutral-600 flex items-center">
            <MapPin size={14} className="mr-1.5" />
            {property.neighborhood}, {property.city}
        </p>
        <h3 className="text-lg font-bold text-neutral-800 mt-1 truncate font-heading">{property.title}</h3>

        <div className="flex items-center justify-between mt-4 text-neutral-600">
            <div className="flex items-center space-x-1">
                <BedDouble size={16} />
                <span className="text-sm">{property.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-1">
                <Bath size={16} />
                <span className="text-sm">{property.bathrooms}</span>
            </div>
            <div className="flex items-center space-x-1">
                <Car size={16} />
                <span className="text-sm">{property.vagas}</span>
            </div>
             <div className="flex items-center space-x-1">
                <Ruler size={16} />
                <span className="text-sm">{property.area_m2} m²</span>
            </div>
        </div>

        <div className="mt-4 p-3 bg-primary-50 rounded-lg">
             <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-primary-700 flex items-center"><BarChart size={16} className="mr-2"/>Imóvel Score</p>
                <div className="flex items-center font-bold text-primary-700">
                    <Star size={16} className="mr-1 text-yellow-500 fill-current" />
                    <span>{totalScore} / 100</span>
                </div>
            </div>
            <p className="text-xs text-primary-700/80 mt-1 truncate">{property.score.analysis}</p>
        </div>

        <div className="mt-4 flex items-end justify-between">
            <div>
                 <p className="text-sm text-neutral-500">{property.finalidade === 'venda' ? 'Valor de Venda' : 'Aluguel Mensal'}</p>
                <p className="text-xl font-bold text-primary-500 font-heading">{formatPrice(property.price)}</p>
            </div>
            <button className="px-4 py-2 text-sm font-semibold text-primary-500 bg-white border-2 border-primary-500 rounded-lg hover:bg-primary-50 transition-colors">
                Ver Detalhes
            </button>
        </div>

      </div>
    </Card>
  );
};

export default PropertyCard;
