
import React from 'react';
import Modal from './Modal';
import { motion } from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'bg-secondary text-white hover:bg-secondary-focus',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-neutral-700 dark:text-base-300 mb-6">
        {message}
      </div>
      <div className="flex justify-end gap-4">
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="py-2 px-4 bg-base-200 dark:bg-neutral-600 font-semibold rounded-lg"
        >
          {cancelText}
        </motion.button>
        <motion.button
          type="button"
          onClick={handleConfirm}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`py-2 px-4 font-semibold rounded-lg ${confirmColor}`}
        >
          {confirmText}
        </motion.button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
