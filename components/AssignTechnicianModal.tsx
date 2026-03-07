import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { ServiceRequest, Technician } from '../types';
import { SendIcon } from '../constants';

type EffectiveStatus = 'Online' | 'Offline' | 'On-Task';

interface TechnicianWithStatus extends Technician {
    effectiveStatus: EffectiveStatus;
}

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  technicians: TechnicianWithStatus[];
  onAssign: (requestId: string, technicianId: string) => void;
}

const StatusIndicator: React.FC<{ status: EffectiveStatus }> = ({ status }) => {
    const statusConfig = {
        Online: { color: 'bg-green-500', text: 'Online' },
        Offline: { color: 'bg-gray-500', text: 'Offline' },
        'On-Task': { color: 'bg-yellow-500', text: 'On-Task' },
    };
    const { color, text } = statusConfig[status];

    return (
        <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
            <span className="text-xs font-medium">{text}</span>
        </div>
    );
};


const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({ isOpen, onClose, request, technicians, onAssign }) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');

  useEffect(() => {
    if (technicians.length > 0) {
      // Prioritize selecting an online technician by default
      const onlineTech = technicians.find(t => t.effectiveStatus === 'Online');
      setSelectedTechnician(onlineTech ? onlineTech.id : technicians[0].id);
    }
  }, [technicians, isOpen]);

  if (!request) return null;

  const handleAssign = () => {
    if (!selectedTechnician) {
      alert('Please select a technician.');
      return;
    }
    onAssign(request.id, selectedTechnician);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Service Request">
      <div className="space-y-4">
        <div>
            <h4 className="font-bold text-neutral-800 dark:text-white">Request Details</h4>
            <p className="text-sm text-neutral-600 dark:text-base-300">
                <span className="font-semibold">{request.category}</span> issue in Room <span className="font-semibold">{request.roomNumber}</span>
            </p>
            <p className="mt-2 text-sm bg-base-200/50 dark:bg-neutral-800/50 p-3 rounded-md">{request.description}</p>
        </div>
        <div>
          <label htmlFor="technician" className="block text-sm font-medium text-neutral-700 dark:text-base-300">Assign To</label>
          <div className="mt-1 space-y-2">
            {technicians.map(tech => (
              <div 
                key={tech.id} 
                onClick={() => setSelectedTechnician(tech.id)}
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border-2 transition-all ${selectedTechnician === tech.id ? 'border-secondary bg-secondary/10' : 'border-transparent bg-base-100 dark:bg-neutral-700/50 hover:bg-base-200 dark:hover:bg-neutral-700'}`}
              >
                  <label htmlFor={`tech-${tech.id}`} className="font-semibold text-neutral-800 dark:text-white">{tech.name}</label>
                  <StatusIndicator status={tech.effectiveStatus} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-2 px-4 bg-base-200 dark:bg-neutral-600 text-neutral-800 dark:text-base-200 font-semibold rounded-lg hover:bg-base-300 dark:hover:bg-neutral-500">Cancel</motion.button>
          <motion.button
            onClick={handleAssign}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-focus"
          >
            <SendIcon />
            Assign Task
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignTechnicianModal;