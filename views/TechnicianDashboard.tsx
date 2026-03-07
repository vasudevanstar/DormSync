// Fix: Create TechnicianDashboard view component.
import React, { useState } from 'react';
import { ServiceRequest, RequestStatus, Technician } from '../types';
import StatCard from '../components/StatCard';
import { WrenchIcon, CheckCircleIcon, ClipboardListIcon, PhotoIcon } from '../constants';
import Card from '../components/Card';
import { motion, AnimatePresence } from 'framer-motion';
import PredictiveInsights from '../components/PredictiveInsights';
import TechnicianHeatmap from '../components/TechnicianHeatmap';
import ConfirmationModal from '../components/ConfirmationModal';
import Modal from '../components/Modal';
import CompleteTaskModal from '../components/CompleteTaskModal';
import PerformanceAnalytics from '../components/PerformanceAnalytics';
import TechnicianStatusToggle from '../components/TechnicianStatusToggle';

interface TechnicianDashboardProps {
  tasks: ServiceRequest[];
  onUpdateStatus: (id: string, newStatus: RequestStatus, completionImageUrl?: string) => void;
  technician: Technician;
  onUpdateTechnicianStatus: (id: string, newStatus: 'Online' | 'Offline') => void;
}

const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ tasks, onUpdateStatus, technician, onUpdateTechnicianStatus }) => {
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '' as string | React.ReactNode,
        onConfirm: () => {},
        confirmText: 'Confirm',
        confirmColor: 'bg-secondary',
    });
    const [imageToView, setImageToView] = useState<string | null>(null);
    const [completeTaskModal, setCompleteTaskModal] = useState<{ isOpen: boolean; task: ServiceRequest | null }>({ isOpen: false, task: null });

    const confirmUpdateStatus = (task: ServiceRequest, newStatus: RequestStatus.IN_PROGRESS | RequestStatus.COMPLETED) => {
        if (newStatus === RequestStatus.COMPLETED) {
            setCompleteTaskModal({ isOpen: true, task: task });
            return;
        }
        
        const taskDescription = (
            <span>
                <strong>{task.category}</strong> issue in <strong>Room {task.roomNumber}</strong>:
                <em className="block mt-2 text-sm text-neutral-500 dark:text-base-400">"{task.description}"</em>
            </span>
        );

        setConfirmationModal({
            isOpen: true,
            title: 'Confirm Start Task',
            message: (
                <div>
                    <p className="mb-4">
                        Are you sure you want to start working on the following task?
                    </p>
                    <div className="p-3 bg-base-100 dark:bg-neutral-700/50 rounded-md border border-base-300 dark:border-neutral-600">
                        {taskDescription}
                    </div>
                </div>
            ),
            onConfirm: () => onUpdateStatus(task.id, newStatus),
            confirmText: 'Start',
            confirmColor: 'bg-accent text-white hover:bg-yellow-600',
        });
    };

    const handleConfirmCompletion = (taskId: string, completionImageUrl: string) => {
        onUpdateStatus(taskId, RequestStatus.COMPLETED, completionImageUrl);
    };

    const myTasks = tasks.filter(task => task.technicianId === 'TEC001' && task.status !== RequestStatus.COMPLETED);
    const newTasks = myTasks.filter(t => t.status === RequestStatus.APPROVED);
    const inProgressTasks = myTasks.filter(t => t.status === RequestStatus.IN_PROGRESS);
    const completedTasks = tasks.filter(t => t.technicianId === 'TEC001' && t.status === RequestStatus.COMPLETED);
    
    const isBusy = inProgressTasks.length > 0;
    const effectiveStatus = isBusy ? 'On-Task' : technician.status;

    return (
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-white">Technician Dashboard</h2>

            <motion.div
                variants={{ hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
                <StatCard icon={<ClipboardListIcon />} label="New Tasks" value={newTasks.length} colorClass="bg-secondary/10 dark:bg-secondary/20 text-secondary" />
                <StatCard icon={<WrenchIcon />} label="In Progress" value={inProgressTasks.length} colorClass="bg-accent/10 dark:bg-accent/20 text-accent" />
                <StatCard icon={<CheckCircleIcon />} label="Completed Today" value={completedTasks.length} colorClass="bg-primary/10 dark:bg-primary/20 text-primary" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <h3 className="text-xl font-bold mb-4">My Task Queue</h3>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                             <AnimatePresence>
                                {myTasks.length > 0 ? (
                                    myTasks.map(task => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="bg-base-200/50 dark:bg-neutral-800/50 p-4 rounded-lg shadow-md border-l-4 border-secondary"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-grow">
                                                    <p className="font-bold">{task.category} - Room {task.roomNumber}</p>
                                                    <p className="text-sm text-neutral-600 dark:text-base-300 mt-1">{task.description}</p>
                                                    {task.imageUrl && (
                                                        <motion.button onClick={() => setImageToView(task.imageUrl!)} whileHover={{scale:1.05}} className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary dark:text-emerald-400 bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-md">
                                                            <PhotoIcon /> View Image
                                                        </motion.button>
                                                    )}
                                                </div>
                                                <span className={`text-xs font-medium shrink-0 px-2.5 py-0.5 rounded-full ${task.status === RequestStatus.IN_PROGRESS ? 'bg-indigo-500/20 text-indigo-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex gap-2 justify-end items-center">
                                                {task.status === RequestStatus.APPROVED && (
                                                    <motion.button
                                                        onClick={() => confirmUpdateStatus(task, RequestStatus.IN_PROGRESS)}
                                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                        className="text-sm font-semibold py-2 px-4 bg-accent/20 text-accent rounded-lg"
                                                    >
                                                        Start Work
                                                    </motion.button>
                                                )}
                                                {task.status === RequestStatus.IN_PROGRESS && (
                                                    <motion.button
                                                        onClick={() => confirmUpdateStatus(task, RequestStatus.COMPLETED)}
                                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                        className="text-sm font-semibold py-2 px-4 bg-green-500/20 text-green-500 rounded-lg"
                                                    >
                                                        Mark as Completed
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-neutral-500 dark:text-base-400 text-center py-8">No active tasks. Well done!</p>
                                )}
                            </AnimatePresence>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <TechnicianStatusToggle
                        technician={technician}
                        isBusy={isBusy}
                        effectiveStatus={effectiveStatus}
                        onStatusChange={(newStatus) => onUpdateTechnicianStatus(technician.id, newStatus)}
                    />
                    <PerformanceAnalytics completedTasks={completedTasks} />
                    <PredictiveInsights />
                    <TechnicianHeatmap />
                </div>
            </div>
            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
                confirmText={confirmationModal.confirmText}
                confirmColor={confirmationModal.confirmColor}
            />
            <CompleteTaskModal
                isOpen={completeTaskModal.isOpen}
                onClose={() => setCompleteTaskModal({ isOpen: false, task: null })}
                task={completeTaskModal.task}
                onConfirm={handleConfirmCompletion}
            />
            <Modal isOpen={!!imageToView} onClose={() => setImageToView(null)} title="Attached Image" size="xl">
                <img src={imageToView || ''} alt="Service Request Attachment" className="w-full h-auto rounded-lg" />
            </Modal>
        </div>
    );
};

export default TechnicianDashboard;