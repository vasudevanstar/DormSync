import React from 'react';
import { ServiceRequest, RequestStatus } from '../types';
import { BoltIcon, DropletsIcon, HammerIcon, WrenchIcon, PhotoIcon, CheckCircleIcon } from '../constants';
import { motion } from 'framer-motion';

interface ServiceRequestCardProps {
    request: ServiceRequest;
    onViewCompletionImage?: (imageUrl: string) => void;
}

const getStatusClasses = (status: RequestStatus) => {
    switch (status) {
        case RequestStatus.PENDING: return 'bg-yellow-500/10 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 border border-yellow-500/20';
        case RequestStatus.APPROVED: return 'bg-blue-500/10 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/20';
        case RequestStatus.IN_PROGRESS: return 'bg-indigo-500/10 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-500/20';
        case RequestStatus.COMPLETED: return 'bg-green-500/10 text-green-800 dark:bg-green-500/20 dark:text-green-300 border border-green-500/20';
        case RequestStatus.REJECTED: return 'bg-red-500/10 text-red-800 dark:bg-red-500/20 dark:text-red-300 border border-red-500/20';
        default: return 'bg-gray-500/10 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300';
    }
};

const getCategoryIcon = (category: ServiceRequest['category']) => {
    switch(category) {
        case 'Electrical': return <BoltIcon />;
        case 'Plumbing': return <DropletsIcon />;
        case 'Carpentry': return <HammerIcon />;
        default: return <WrenchIcon />;
    }
};

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ request, onViewCompletionImage }) => {
    return (
        <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1,y:0}}}>
            <div className="flex justify-between items-start">
                <div className='flex items-center gap-3'>
                    <div className='text-secondary'>{getCategoryIcon(request.category)}</div>
                    <div>
                        <p className="font-bold text-lg text-neutral-800 dark:text-white">{request.category} Issue</p>
                        <p className="text-sm text-neutral-500 dark:text-base-400">Room: {request.roomNumber} | Reported by: {request.residentName}</p>
                    </div>
                </div>
                <span className={`text-xs font-medium shrink-0 px-2.5 py-0.5 rounded-full ${getStatusClasses(request.status)}`}>
                    {request.status}
                </span>
            </div>
            <p className="mt-2 text-neutral-700 dark:text-base-300 pl-9">{request.description}</p>
            <div className="mt-3 text-xs text-neutral-400 dark:text-neutral-500 pl-9 flex justify-between items-center">
                <span>Created: {request.createdAt}</span>
                <div className="flex items-center gap-4">
                     {request.imageUrl && (
                        <div className="flex items-center gap-1 text-primary dark:text-emerald-400" title="Image attached">
                            <PhotoIcon />
                            <span className="font-semibold">Image Attached</span>
                        </div>
                    )}
                    {request.status === RequestStatus.COMPLETED && request.completionImageUrl && onViewCompletionImage && (
                        <motion.button 
                            onClick={() => onViewCompletionImage(request.completionImageUrl!)}
                            whileHover={{scale:1.05}}
                            className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 px-2 py-1 rounded-md"
                        >
                            <CheckCircleIcon /> View Completion
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceRequestCard;
