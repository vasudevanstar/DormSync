import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { OutingRequest } from '../types';

interface NewOutingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<OutingRequest, 'id' | 'status' | 'residentName' | 'roomNumber'>) => void;
}

const NewOutingRequestModal: React.FC<NewOutingRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<'Outing' | 'Leave' | 'Emergency Leave'>('Outing');
  const [purpose, setPurpose] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setType('Outing');
      setPurpose('');
      setFromDate('');
      setToDate('');
      setFromTime('');
      setToTime('');
      setError('');
    }
  }, [isOpen]);
  
  // Effect to automatically set the 'To Date' for single-day outings.
  useEffect(() => {
    if (type === 'Outing' && fromDate) {
      setToDate(fromDate);
    }
  }, [type, fromDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim() || !fromDate || !toDate || !fromTime || !toTime) {
      setError('All fields are required.');
      return;
    }
    if (new Date(`${toDate}T${toTime}`) < new Date(`${fromDate}T${fromTime}`)) {
        setError('The "To" date and time must be after the "From" date and time.');
        return;
    }
    setError('');
    onSubmit({ type, purpose, fromDate, toDate, fromTime, toTime });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a New Outing/Leave">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-neutral-700 dark:text-base-300">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="mt-1 block w-full px-3 py-2 bg-base-100 dark:bg-neutral-700 border border-base-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
          >
            <option>Outing</option>
            <option>Leave</option>
            <option value="Emergency Leave">Emergency Leave</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-neutral-700 dark:text-base-300">Purpose</label>
          <textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-base-100 dark:bg-neutral-700 border border-base-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
            rows={3}
            required
            placeholder="e.g., Weekend trip home, local guardian visit."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                 <label htmlFor="fromDate" className="block text-sm font-medium text-neutral-700 dark:text-base-300">From Date</label>
                 <input type="date" id="fromDate" value={fromDate} onChange={e => setFromDate(e.target.value)} min={today} required className="mt-1 block w-full date-input" />
            </div>
             <div>
                 <label htmlFor="toDate" className="block text-sm font-medium text-neutral-700 dark:text-base-300">To Date</label>
                 <input 
                    type="date" 
                    id="toDate" 
                    value={toDate} 
                    onChange={e => setToDate(e.target.value)} 
                    min={fromDate || today} 
                    required 
                    disabled={type === 'Outing'}
                    className="mt-1 block w-full date-input disabled:opacity-50 disabled:cursor-not-allowed" 
                 />
            </div>
             <div>
                 <label htmlFor="fromTime" className="block text-sm font-medium text-neutral-700 dark:text-base-300">From Time</label>
                 <input type="time" id="fromTime" value={fromTime} onChange={e => setFromTime(e.target.value)} required className="mt-1 block w-full date-input" />
            </div>
             <div>
                 <label htmlFor="toTime" className="block text-sm font-medium text-neutral-700 dark:text-base-300">To Time</label>
                 <input type="time" id="toTime" value={toTime} onChange={e => setToTime(e.target.value)} required className="mt-1 block w-full date-input" />
            </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-end gap-4 pt-2">
          <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-2 px-4 bg-base-200 dark:bg-neutral-600 text-neutral-800 dark:text-base-200 font-semibold rounded-lg hover:bg-base-300 dark:hover:bg-neutral-500">Cancel</motion.button>
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-focus">Submit Request</motion.button>
        </div>
      </form>
      <style>{`
        .date-input {
            padding: 0.5rem 0.75rem;
            background-color: var(--tw-bg-base-100);
            border: 1px solid var(--tw-border-base-300);
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .dark .date-input {
            background-color: var(--tw-bg-neutral-700);
            border-color: var(--tw-border-neutral-600);
            color: white;
        }
        .date-input:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
            --tw-ring-color: var(--tw-color-secondary);
            border-color: var(--tw-color-secondary);
        }
      `}</style>
    </Modal>
  );
};

export default NewOutingRequestModal;