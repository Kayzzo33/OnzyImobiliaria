
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isFeatured?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', isFeatured = false }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${isFeatured ? 'border-2 border-yellow-400' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
