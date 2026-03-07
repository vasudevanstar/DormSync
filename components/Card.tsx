import React from 'react';
import { motion, Variants } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, duration: 0.5 },
  },
};

const Card: React.FC<CardProps> = ({ children, className = '', variants = itemVariants }) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-white/40 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20 dark:border-black/30 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;