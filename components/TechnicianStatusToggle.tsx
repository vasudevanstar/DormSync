import React from 'react';
import { Technician } from '../types';
import Card from './Card';
import { motion } from 'framer-motion';

interface TechnicianStatusToggleProps {
  technician: Technician;
  isBusy: boolean;
  effectiveStatus: 'Online' | 'Offline' | 'On-Task';
  onStatusChange: (newStatus: 'Online' | 'Offline') => void;
}

const statusConfig = {
    Online: { color: 'bg-green-500', text: 'You are Online', subtext: 'Ready to accept new tasks.' },
    Offline: { color: 'bg-gray-500', text: 'You are Offline', subtext: 'You will not be assigned new tasks.' },
    'On-Task': { color: 'bg-yellow-500', text: 'You are On-Task', subtext: 'Your status is automatic while on a job.' },
};

const TechnicianStatusToggle: React.FC<TechnicianStatusToggleProps> = ({
  technician,
  isBusy,
  effectiveStatus,
  onStatusChange,
}) => {
  const handleToggle = () => {
    if (!isBusy) {
      onStatusChange(technician.status === 'Online' ? 'Offline' : 'Online');
    }
  };

  const { color, text, subtext } = statusConfig[effectiveStatus];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold">My Status</h3>
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color} transition-colors`}></div>
            <span className="font-semibold text-sm">{text}</span>
        </div>
      </div>
       <p className="text-xs text-neutral-500 dark:text-base-400 mb-4 h-8">{subtext}</p>
      
      <div className="flex items-center justify-center">
        <span className={`font-semibold text-sm ${technician.status === 'Offline' && !isBusy ? 'text-neutral-800 dark:text-white' : 'text-neutral-400'}`}>
            Offline
        </span>
        <button
          onClick={handleToggle}
          disabled={isBusy}
          className={`relative inline-flex h-6 w-11 mx-3 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:cursor-not-allowed ${
            technician.status === 'Online' && !isBusy ? 'bg-green-600' : 'bg-gray-400 dark:bg-neutral-600'
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              technician.status === 'Online' && !isBusy ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`font-semibold text-sm ${technician.status === 'Online' && !isBusy ? 'text-neutral-800 dark:text-white' : 'text-neutral-400'}`}>
            Online
        </span>
      </div>
    </Card>
  );
};

export default TechnicianStatusToggle;