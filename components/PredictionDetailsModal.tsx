// Fix: Create PredictionDetailsModal component.
import React from 'react';
import Modal from './Modal';
import { MaintenancePrediction } from '../types';
import { motion } from 'framer-motion';

interface PredictionDetailsModalProps {
  prediction: MaintenancePrediction | null;
  isOpen: boolean;
  onClose: () => void;
}

const PredictionDetailsModal: React.FC<PredictionDetailsModalProps> = ({ prediction, isOpen, onClose }) => {
  if (!prediction) return null;
  
  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood > 0.7) return 'bg-red-500/20 text-red-500 border-red-500/30';
    if (likelihood > 0.5) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    return 'bg-green-500/20 text-green-500 border-green-500/30';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Maintenance Prediction Details">
      <div className="space-y-4">
        <div className="text-center p-4 rounded-lg border bg-base-200/50 dark:bg-neutral-800/50">
          <p className="font-bold text-lg">{prediction.category} Fault</p>
          <p className="text-sm text-neutral-500 dark:text-base-300">Wing {prediction.wing}, Floor {prediction.floor}</p>
        </div>
        <div className={`p-4 rounded-lg text-center border ${getLikelihoodColor(prediction.likelihood)}`}>
          <p className="text-sm font-medium">Predicted Likelihood</p>
          <p className="text-4xl font-bold">{Math.round(prediction.likelihood * 100)}%</p>
        </div>
        <div>
          <h4 className="font-bold text-neutral-800 dark:text-white">Reasoning</h4>
          <p className="text-sm mt-1 text-neutral-600 dark:text-base-300 bg-base-100 dark:bg-neutral-700/50 p-3 rounded-md">{prediction.reasoning}</p>
        </div>
        <div>
          <h4 className="font-bold text-neutral-800 dark:text-white">Suggested Action</h4>
          <p className="text-sm mt-1 text-neutral-600 dark:text-base-300 bg-base-100 dark:bg-neutral-700/50 p-3 rounded-md">{prediction.suggestedAction}</p>
        </div>
        <div className="flex justify-end pt-4">
            <motion.button 
                onClick={onClose} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="py-2 px-4 bg-secondary text-white font-semibold rounded-lg"
            >
                Acknowledge & Close
            </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default PredictionDetailsModal;
