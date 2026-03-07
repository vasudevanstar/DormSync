
import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import { XIcon } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error("The element #modal-root was not found");
    return null;
  }
  
  const sizeClasses: Record<string, string> = {
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`w-full relative ${sizeClasses[size]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="!p-0">
                <div className="flex justify-between items-center p-6 border-b border-base-300 dark:border-neutral-700">
                    <h3 className="text-xl font-bold text-primary dark:text-emerald-400">{title}</h3>
                    <motion.button whileHover={{scale: 1.2}} whileTap={{scale: 0.8}} onClick={onClose} className="p-1 rounded-full hover:bg-base-200 dark:hover:bg-neutral-700">
                       <XIcon />
                    </motion.button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;
