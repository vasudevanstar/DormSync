
import React, { useState } from 'react';
import Modal from './Modal';
import { Resident } from '../types';
import { UserCircleIcon, MailIcon, PhoneIcon, BedIcon } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface ResidentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  residents: Resident[];
}

const ResidentListModal: React.FC<ResidentListModalProps> = ({ isOpen, onClose, residents }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredResidents = residents.filter(resident =>
        resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="All Residents" size="2xl">
            <div className="flex flex-col h-[70vh]">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search by name, room, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 bg-base-100 dark:bg-neutral-700/50 border border-base-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                    />
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    <AnimatePresence>
                        {filteredResidents.length > 0 ? filteredResidents.map(resident => (
                            <motion.div
                                layout
                                key={resident.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-base-200/50 dark:bg-neutral-800/50 p-4 rounded-lg"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary dark:text-emerald-300">
                                            <UserCircleIcon />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-neutral-800 dark:text-white">{resident.name}</p>
                                            <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-base-400">
                                                <BedIcon />
                                                <span>{resident.roomNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-neutral-600 dark:text-base-300">
                                            <MailIcon />
                                            <a href={`mailto:${resident.email}`} className="hover:underline">{resident.email}</a>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-600 dark:text-base-300">
                                            <PhoneIcon />
                                            <a href={`tel:${resident.phone}`} className="hover:underline">{resident.phone}</a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <p className="text-neutral-500 dark:text-base-400 text-center py-8">No residents found.</p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Modal>
    );
};

export default ResidentListModal;
