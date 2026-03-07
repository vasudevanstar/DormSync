





import React, { useState, useEffect } from 'react';
import { ServiceRequest, OutingRequest, RequestStatus, Technician, Resident } from '../types';
import StatCard from '../components/StatCard';
import TechnicianHeatmap from '../components/TechnicianHeatmap';
import AiSummary from '../components/AiSummary';
import { UsersIcon, WrenchIcon, WalkingIcon, CheckCircleIcon, XCircleIcon, CalendarClockIcon, UserCircleIcon, ExclamationTriangleIcon, LightBulbIcon, PhotoIcon, EyeIcon } from '../constants';
import Card from '../components/Card';
import Modal from '../components/Modal';
import AssignTechnicianModal from '../components/AssignTechnicianModal';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../components/ConfirmationModal';
import { generateOutingSuggestion } from '../services/geminiService';
import ResidentListModal from '../components/ResidentListModal';

const containerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AiSuggestion: React.FC<{request: OutingRequest}> = ({ request }) => {
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        generateOutingSuggestion(request)
            .then(setSuggestion)
            .catch(() => setSuggestion('Could not get suggestion.'))
            .finally(() => setIsLoading(false));
    }, [request]);

    const getSuggestionColor = () => {
        if (suggestion.includes('Approval')) return 'text-green-600 dark:text-green-400';
        if (suggestion.includes('Review')) return 'text-yellow-600 dark:text-yellow-400';
        if (suggestion.includes('Caution')) return 'text-red-600 dark:text-red-400';
        return 'text-neutral-500 dark:text-base-400';
    };

    return (
        <div className="mt-2 flex items-center gap-2 p-2 bg-base-100/50 dark:bg-neutral-900/50 rounded-md">
            <LightBulbIcon />
            <p className={`text-xs font-semibold ${getSuggestionColor()}`}>
                {isLoading ? 'Generating suggestion...' : suggestion}
            </p>
        </div>
    );
};

interface WardenDashboardProps {
  residents: Resident[];
  technicians: Technician[];
  serviceRequests: ServiceRequest[];
  outingRequests: OutingRequest[];
  onAssignTechnician: (requestId: string, technicianId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onUpdateOutingRequest: (requestId: string, newStatus: RequestStatus.APPROVED | RequestStatus.REJECTED) => void;
}

const WardenDashboard: React.FC<WardenDashboardProps> = ({ residents, technicians, serviceRequests, outingRequests, onAssignTechnician, onRejectRequest, onUpdateOutingRequest }) => {
  const [assignModal, setAssignModal] = useState<{ isOpen: boolean; request: ServiceRequest | null }>({ isOpen: false, request: null });
  const [rejectionModal, setRejectionModal] = useState<{isOpen: boolean; requestId: string | null}>({isOpen: false, requestId: null});
  const [rejectionReason, setRejectionReason] = useState('');
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [imageToView, setImageToView] = useState<string | null>(null);
  const [isResidentListModalOpen, setIsResidentListModalOpen] = useState(false);

  const handleOpenAssignModal = (request: ServiceRequest) => {
    setAssignModal({ isOpen: true, request });
  };

  const confirmRejectServiceRequest = (requestId: string) => {
    setConfirmationModal({
        isOpen: true,
        title: 'Confirm Rejection',
        message: 'Are you sure you want to reject this service request? This action cannot be undone.',
        onConfirm: () => onRejectRequest(requestId),
    });
  };
  
  const handleOutingRequest = (id: string, newStatus: RequestStatus.APPROVED | RequestStatus.REJECTED) => {
      if (newStatus === RequestStatus.REJECTED) {
          setRejectionModal({ isOpen: true, requestId: id });
      } else {
          confirmApproveOutingRequest(id);
      }
  };

  const confirmApproveOutingRequest = (requestId: string) => {
    setConfirmationModal({
        isOpen: true,
        title: 'Confirm Approval',
        message: 'Are you sure you want to approve this outing request?',
        onConfirm: () => onUpdateOutingRequest(requestId, RequestStatus.APPROVED),
    });
  };

  const handleAssignConfirm = (requestId: string, technicianId: string) => {
    setConfirmationModal({
        isOpen: true,
        title: 'Confirm Assignment',
        message: `Are you sure you want to assign this task to technician ${technicianId}?`,
        onConfirm: () => {
            onAssignTechnician(requestId, technicianId);
            setAssignModal({ isOpen: false, request: null });
        },
    });
  };

  const handleConfirmReject = () => {
    if (!rejectionModal.requestId || !rejectionReason.trim()) {
      alert("Reason for rejection is mandatory.");
      return;
    }
    // This modal is now for outing requests
    onUpdateOutingRequest(rejectionModal.requestId!, RequestStatus.REJECTED);
    
    setRejectionModal({ isOpen: false, requestId: null });
    setRejectionReason('');
  };

  const getOutingStatus = (outing: OutingRequest) => {
    if (outing.checkIn) return <span className="text-green-500 font-semibold">Returned</span>;
    if (outing.checkOut && new Date() > new Date(`${outing.toDate}T${outing.toTime}`)) {
        return <span className="text-red-500 font-semibold animate-pulse">Overdue</span>;
    }
    if (outing.checkOut) return <span className="text-blue-500 font-semibold">Out</span>;
    return <span className="text-yellow-500 font-semibold">Approved</span>;
  };
  
  const pendingServiceRequests = serviceRequests.filter(req => req.status === RequestStatus.PENDING);
  const pendingOutingRequests = outingRequests.filter(req => req.status === RequestStatus.PENDING);

  const getStatusPriority = (outing: OutingRequest) => {
    if (outing.checkIn) return 3; // Returned
    if (outing.checkOut && new Date() > new Date(`${outing.toDate}T${outing.toTime}`)) return 0; // Overdue
    if (outing.checkOut) return 1; // Out
    return 2; // Approved
  };

  const trackedOutings = outingRequests
      .filter(req => req.status === RequestStatus.APPROVED)
      .sort((a, b) => getStatusPriority(a) - getStatusPriority(b));

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const techniciansWithStatus = technicians.map(tech => {
    const isOnTask = serviceRequests.some(req => 
        req.technicianId === tech.id && req.status === RequestStatus.IN_PROGRESS
    );
    return {
        ...tech,
        effectiveStatus: isOnTask ? 'On-Task' as const : tech.status,
    };
});


  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-white">Warden Command Center</h2>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<WrenchIcon />} label="Pending Service Requests" value={pendingServiceRequests.length} colorClass="bg-secondary/10 dark:bg-secondary/20 text-secondary" />
        <StatCard icon={<WalkingIcon />} label="Pending Outing Requests" value={pendingOutingRequests.length} colorClass="bg-accent/10 dark:bg-accent/20 text-accent" />
        <StatCard icon={<UsersIcon />} label="Total Occupancy" value={residents.length} colorClass="bg-primary/10 dark:bg-primary/20 text-primary" />
      </motion.div>

      <div className="mb-8">
        <AiSummary serviceRequests={pendingServiceRequests} outingRequests={pendingOutingRequests} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-8">
          <Card>
            <h3 className="text-xl font-bold mb-4">Service Request Approvals</h3>
            <motion.div layout className="space-y-4 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
              {pendingServiceRequests.length > 0 ? pendingServiceRequests.map(req => (
                <motion.div layout key={req.id} variants={itemVariants} initial="hidden" animate="visible" exit={{opacity: 0, x: -50}} className="bg-base-200/50 dark:bg-neutral-800/50 p-4 rounded-lg flex justify-between items-center shadow-md border border-secondary/20">
                  <div>
                    <p className="font-bold">{req.category} - Room {req.roomNumber}</p>
                    <p className="text-sm text-neutral-600 dark:text-base-300">{req.description}</p>
                    {req.imageUrl && (
                      <motion.button 
                        onClick={() => setImageToView(req.imageUrl!)} 
                        whileHover={{scale:1.05}} 
                        className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary dark:text-emerald-400 bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-md"
                      >
                        <PhotoIcon /> View Image
                      </motion.button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => handleOpenAssignModal(req)} className="p-2 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20"><CheckCircleIcon/></motion.button>
                    <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => confirmRejectServiceRequest(req.id)} className="p-2 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20"><XCircleIcon/></motion.button>
                  </div>
                </motion.div>
              )) : <p className="text-neutral-500 dark:text-base-400">No pending service requests.</p>}
              </AnimatePresence>
            </motion.div>
          </Card>
          
           <Card>
            <h3 className="text-xl font-bold mb-4">Outing/Leave Approvals</h3>
             <motion.div layout className="space-y-4 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
              {pendingOutingRequests.length > 0 ? pendingOutingRequests.map(req => (
                <motion.div layout key={req.id} variants={itemVariants} initial="hidden" animate="visible" exit={{opacity: 0, x: -50}} className={`bg-base-200/50 dark:bg-neutral-800/50 p-4 rounded-lg shadow-md border ${req.type === 'Emergency Leave' ? 'border-red-500/50' : 'border-secondary/20'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        {req.type === 'Emergency Leave' && <ExclamationTriangleIcon className="text-red-500" />}
                        <p className="font-bold">{req.residentName} - Room {req.roomNumber}</p>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-base-300">{req.type}: {req.purpose}</p>
                      <p className="text-xs text-neutral-500 dark:text-base-400 mt-1">
                          {req.fromDate} @ {req.fromTime} to {req.toDate} @ {req.toTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => handleOutingRequest(req.id, RequestStatus.APPROVED)} className="p-2 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20"><CheckCircleIcon/></motion.button>
                      <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => handleOutingRequest(req.id, RequestStatus.REJECTED)} className="p-2 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20"><XCircleIcon/></motion.button>
                    </div>
                  </div>
                  {req.type !== 'Emergency Leave' && <AiSuggestion request={req} />}
                </motion.div>
              )) : <p className="text-neutral-500 dark:text-base-400">No pending outing requests.</p>}
              </AnimatePresence>
            </motion.div>
          </Card>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-1 space-y-8">
          <TechnicianHeatmap />
          <Card>
            <div className="flex items-center gap-3 mb-4">
                <CalendarClockIcon />
                <h3 className="text-xl font-bold">Tracked Outings</h3>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {trackedOutings.length > 0 ? trackedOutings.map(outing => (
                    <motion.div variants={itemVariants} key={outing.id} className="bg-base-200/50 dark:bg-neutral-800/50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                           <div>
                             <p className="font-bold">{outing.residentName} ({outing.roomNumber})</p>
                             <p className="text-xs text-neutral-500 dark:text-base-400">{outing.purpose}</p>
                           </div>
                           {getOutingStatus(outing)}
                        </div>
                        {outing.checkOut && <p className="text-xs mt-1 text-neutral-600 dark:text-base-300">Out: {new Date(outing.checkOut).toLocaleString()}</p>}
                        {outing.checkIn && <p className="text-xs text-neutral-600 dark:text-base-300">In: {new Date(outing.checkIn).toLocaleString()}</p>}
                    </motion.div>
                )) : <p className="text-neutral-500 dark:text-base-400">No active outings to track.</p>}
            </motion.div>
          </Card>
           <Card>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <UsersIcon />
                    <h3 className="text-xl font-bold">Resident Directory</h3>
                </div>
                <motion.button
                    onClick={() => setIsResidentListModalOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-base-200/50 dark:hover:bg-neutral-700/50"
                    aria-label="View all residents"
                >
                    <EyeIcon />
                </motion.button>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search by name or room..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-base-100 dark:bg-neutral-700/50 border border-base-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                />
            </div>
            <motion.div layout className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                    {filteredResidents.length > 0 ? filteredResidents.map(resident => (
                        <motion.div 
                          layout 
                          key={resident.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-base-200/50 dark:bg-neutral-800/50 p-3 rounded-lg flex justify-between items-center"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full text-primary dark:text-emerald-300">
                                    <UserCircleIcon />
                                </div>
                                <div>
                                    <p className="font-bold">{resident.name}</p>
                                    <p className="text-xs text-neutral-500 dark:text-base-400">Room: {resident.roomNumber}</p>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <p className="text-neutral-500 dark:text-base-400 text-center py-4">No residents found.</p>
                    )}
                </AnimatePresence>
            </motion.div>
          </Card>
        </motion.div>
      </div>
      
       <Modal isOpen={rejectionModal.isOpen} onClose={() => setRejectionModal({isOpen: false, requestId: null})} title="Reason for Rejection">
          <p className="text-sm text-neutral-600 dark:text-base-300 mb-4">This is mandatory. The reason will be visible to the resident.</p>
          <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="w-full p-2 border rounded-md bg-base-100 dark:bg-neutral-700 border-base-300 dark:border-neutral-600"
          rows={4}
          placeholder="e.g., Incomplete information..."
          ></textarea>
          <div className="flex justify-end gap-4 mt-4">
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => setRejectionModal({isOpen: false, requestId: null})} className="py-2 px-4 bg-base-200 dark:bg-neutral-600 font-semibold rounded-lg">Cancel</motion.button>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={handleConfirmReject} className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg">Confirm Rejection</motion.button>
          </div>
      </Modal>
      <AssignTechnicianModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false, request: null })}
        request={assignModal.request}
        technicians={techniciansWithStatus}
        onAssign={handleAssignConfirm}
      />
       <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
      <Modal isOpen={!!imageToView} onClose={() => setImageToView(null)} title="Attached Image" size="xl">
        <img src={imageToView || ''} alt="Service Request Attachment" className="w-full h-auto rounded-lg" />
      </Modal>
      <ResidentListModal
        isOpen={isResidentListModalOpen}
        onClose={() => setIsResidentListModalOpen(false)}
        residents={residents}
      />
    </div>
  );
};

export default WardenDashboard;
