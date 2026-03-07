// Fix: Create ResidentDashboard.tsx view component.
import React, { useState } from 'react';
import { ServiceRequest, RequestStatus, OutingRequest, GroupBooking } from '../types';
import StatCard from '../components/StatCard';
import { WrenchIcon, PlusIcon, WalkingIcon, UserCircleIcon } from '../constants';
import Card from '../components/Card';
import NewServiceRequestModal from '../components/NewServiceRequestModal';
import ServiceRequestCard from '../components/ServiceRequestCard';
import BookingTracker from '../components/BookingTracker';
import NewOutingRequestModal from '../components/NewOutingRequestModal';
import OutingRequestCard from '../components/OutingRequestCard';
import ResidentProfile from '../components/ResidentProfile';
import { motion, AnimatePresence } from 'framer-motion';
import BookingCard from '../components/BookingCard';
import GatePassModal from '../components/GatePassModal';
import NewGroupBookingModal from '../components/NewGroupBookingModal';
import MessMenu from '../components/MessMenu';
import AiHelpdesk from '../components/AiHelpdesk';
import Modal from '../components/Modal';

const mockProfile = {
  name: 'Barani',
  id: 'Barani',
  roomNumber: 'A-402',
  email: 'barani@example.com',
  phone: '123-456-7890',
};

type View = 'dashboard' | 'profile';

interface ResidentDashboardProps {
  serviceRequests: ServiceRequest[];
  outingRequests: OutingRequest[];
  onNewRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>) => void;
  onNewOutingRequest: (request: Omit<OutingRequest, 'id' | 'status' | 'residentName' | 'roomNumber'>) => void;
  onCheckOut: (requestId: string) => void;
  onCheckIn: (requestId: string) => void;
  groupBookings: GroupBooking[];
  onCreateGroupBooking: (roomType: '2-Person Sharing' | '4-Person Sharing', invitedMembers: { residentId: string, name: string }[]) => void;
  onUpdateBookingMemberStatus: (bookingId: string, residentId: string, newStatus: 'Accepted' | 'Rejected') => void;
  onDismissBooking: (bookingId: string) => void;
}

const ResidentDashboard: React.FC<ResidentDashboardProps> = ({ 
    serviceRequests, outingRequests, onNewRequest, onNewOutingRequest, onCheckOut, onCheckIn,
    groupBookings, onCreateGroupBooking, onUpdateBookingMemberStatus, onDismissBooking
}) => {
  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [isOutingModalOpen, setOutingModalOpen] = useState(false);
  const [isGroupBookingModalOpen, setGroupBookingModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [gatePassModal, setGatePassModal] = useState<{ isOpen: boolean; request: OutingRequest | null }>({ isOpen: false, request: null });
  const [imageToView, setImageToView] = useState<string | null>(null);

  const handleNewRequest = (request: Omit<ServiceRequest, 'id' | 'residentName' | 'floor' | 'status' | 'createdAt'>) => {
    onNewRequest({
      ...request,
      residentName: profile.name,
      floor: 4, // Assuming floor from room number logic would be here
    });
  };

  const handleProfileUpdate = (data: {email: string, phone: string}) => {
    setProfile(prev => ({ ...prev, ...data }));
    // In a real app, you'd call an API here.
  };

  const handleShowGatePass = (request: OutingRequest) => {
    setGatePassModal({ isOpen: true, request });
  };

  const handleViewCompletionImage = (imageUrl: string) => {
    setImageToView(imageUrl);
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const residentRequests = serviceRequests.filter(req => req.residentName === profile.name);
  const residentOutingRequests = outingRequests.filter(req => req.residentName === profile.name);
  
  // Find the booking to show in the tracker. This can be in any state until dismissed.
  const bookingToDisplay = groupBookings.find(b => 
      b.members.some(m => m.residentId === profile.id)
  );

  // A user should only be blocked from creating a new booking if one is currently pending confirmation.
  const hasPendingBooking = bookingToDisplay?.status === 'PendingConfirmation';

  const renderDashboard = () => (
    <>
      <h2 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-white">Welcome, {profile.name}!</h2>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<WrenchIcon />} label="Pending Requests" value={residentRequests.filter(r => r.status === RequestStatus.PENDING || r.status === RequestStatus.IN_PROGRESS).length} colorClass="bg-secondary/10 dark:bg-secondary/20 text-secondary" />
            <StatCard icon={<WalkingIcon />} label="Pending Outings" value={residentOutingRequests.filter(r => r.status === RequestStatus.PENDING).length} colorClass="bg-accent/10 dark:bg-accent/20 text-accent" />
            <motion.div 
                variants={{hidden:{opacity:0,y:20}, visible:{opacity:1,y:0}}}
                whileHover={{ y: -5 }} 
                className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-emerald-300 rounded-2xl flex items-center justify-center cursor-pointer"
                onClick={() => setCurrentView('profile')}
            >
                <div className="text-center">
                    <div className="mx-auto w-12 h-12"><UserCircleIcon /></div>
                    <p className="font-bold mt-2">My Profile</p>
                </div>
            </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-8">
                 <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">My Service Requests</h3>
                        <motion.button onClick={() => setServiceModalOpen(true)} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="flex items-center gap-2 bg-secondary text-white font-semibold py-2 px-4 rounded-lg">
                            <PlusIcon />
                            <span>New Request</span>
                        </motion.button>
                    </div>
                    <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                        <AnimatePresence>
                            {residentRequests.length > 0 ? residentRequests.map(req => (
                                <ServiceRequestCard key={req.id} request={req} onViewCompletionImage={handleViewCompletionImage} />
                            )) : (
                                <p className="text-neutral-500 dark:text-base-400">You have no active service requests.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">My Outing/Leave Requests</h3>
                        <motion.button onClick={() => setOutingModalOpen(true)} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="flex items-center gap-2 bg-accent text-white font-semibold py-2 px-4 rounded-lg">
                            <PlusIcon />
                            <span>New Outing</span>
                        </motion.button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                         <AnimatePresence>
                            {residentOutingRequests.length > 0 ? residentOutingRequests.map(req => (
                                <OutingRequestCard key={req.id} request={req} onShowGatePass={handleShowGatePass} />
                            )) : (
                                <p className="text-neutral-500 dark:text-base-400">You have no active outing requests.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                <MessMenu />
                <BookingTracker 
                    booking={bookingToDisplay || null}
                    currentUser={profile}
                    onUpdateStatus={onUpdateBookingMemberStatus}
                    onDismissBooking={onDismissBooking}
                />
                <BookingCard onStartBooking={() => setGroupBookingModalOpen(true)} hasActiveBooking={hasPendingBooking} />
            </motion.div>
        </div>
        <AiHelpdesk />
    </>
  );

  return (
    <div className="container mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={currentView}>
           {currentView === 'dashboard' ? renderDashboard() : <ResidentProfile profile={profile} onUpdate={handleProfileUpdate} onBack={() => setCurrentView('dashboard')} />}
        </motion.div>
      </AnimatePresence>
      <NewServiceRequestModal isOpen={isServiceModalOpen} onClose={() => setServiceModalOpen(false)} onSubmit={handleNewRequest} />
      <NewOutingRequestModal isOpen={isOutingModalOpen} onClose={() => setOutingModalOpen(false)} onSubmit={onNewOutingRequest} />
      <NewGroupBookingModal
        isOpen={isGroupBookingModalOpen}
        onClose={() => setGroupBookingModalOpen(false)}
        onSubmit={onCreateGroupBooking}
      />
      <GatePassModal
        isOpen={gatePassModal.isOpen}
        onClose={() => setGatePassModal({ isOpen: false, request: null })}
        request={gatePassModal.request}
        onCheckOut={onCheckOut}
        onCheckIn={onCheckIn}
      />
      <Modal isOpen={!!imageToView} onClose={() => setImageToView(null)} title="Completion Photo" size="xl">
        <img src={imageToView || ''} alt="Work completion photo" className="w-full h-auto rounded-lg" />
      </Modal>
    </div>
  );
};

export default ResidentDashboard;