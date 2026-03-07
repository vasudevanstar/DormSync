
import React from 'react';
import { OutingRequest, RequestStatus } from '../types';
import { WalkingIcon, QrCodeIcon } from '../constants';
import { motion } from 'framer-motion';

interface OutingRequestCardProps {
    request: OutingRequest;
    onShowGatePass: (request: OutingRequest) => void;
}

const getStatusClasses = (status: RequestStatus) => {
    switch (status) {
        case RequestStatus.PENDING: return 'bg-yellow-500/10 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 border border-yellow-500/20';
        case RequestStatus.APPROVED: return 'bg-green-500/10 text-green-800 dark:bg-green-500/20 dark:text-green-300 border border-green-500/20';
        case RequestStatus.REJECTED: return 'bg-red-500/10 text-red-800 dark:bg-red-500/20 dark:text-red-300 border border-red-500/20';
        default: return 'bg-gray-500/10 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300';
    }
};

const formatDate = (dateString: string) => {
    // Adding a 'T00:00:00' to avoid timezone issues where the date might shift
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const OutingRequestCard: React.FC<OutingRequestCardProps> = ({ request, onShowGatePass }) => {
    return (
        <motion.div variants={{hidden: {opacity:0, y:20}, visible:{opacity:1,y:0}}} className="bg-base-100/50 dark:bg-neutral-800/50 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className='flex items-center gap-3'>
                    <div className='text-accent'><WalkingIcon /></div>
                    <div>
                        <p className="font-bold text-lg text-neutral-800 dark:text-white">
                            <span className="bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-md mr-2">{request.type}</span>
                            {request.purpose}
                        </p>
                    </div>
                </div>
                 <div className="text-right">
                    <span className={`text-xs font-medium shrink-0 px-2.5 py-0.5 rounded-full ${getStatusClasses(request.status)}`}>
                        {request.status}
                    </span>
                    {request.status === RequestStatus.APPROVED && (
                        <motion.button 
                            onClick={() => onShowGatePass(request)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary dark:text-emerald-400"
                        >
                            <QrCodeIcon className="h-4 w-4" />
                            <span>Gate Pass</span>
                        </motion.button>
                    )}
                </div>
            </div>
             <div className="mt-2 pl-10 text-sm grid grid-cols-2 gap-x-4 gap-y-1 text-neutral-600 dark:text-base-300">
                <p><strong>From:</strong> {formatDate(request.fromDate)}</p>
                <p><strong>Time:</strong> {request.fromTime}</p>
                <p><strong>To:</strong> {formatDate(request.toDate)}</p>
                <p><strong>Time:</strong> {request.toTime}</p>
            </div>
        </motion.div>
    );
};

export default OutingRequestCard;
