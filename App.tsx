




import React, { useState, useEffect, useCallback } from 'react';
import { Role, ServiceRequest, RequestStatus, OutingRequest, GroupBooking, Resident, Technician } from './types';
import ResidentDashboard from './views/ResidentDashboard';
import WardenDashboard from './views/WardenDashboard';
import TechnicianDashboard from './views/TechnicianDashboard';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import { motion, AnimatePresence, Transition, Variants } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine, IOptions, RecursivePartial } from "tsparticles-engine";

const allInitialServiceRequests: ServiceRequest[] = [
    // Resident specific, already in progress or completed
    { id: 'SR001', residentName: 'Barani', roomNumber: 'A-402', floor: 4, category: 'Electrical', description: 'Study lamp not working.', status: RequestStatus.IN_PROGRESS, createdAt: '1 day ago', technicianId: 'TEC001' },
    { id: 'SR002', residentName: 'Barani', roomNumber: 'A-402', floor: 4, category: 'Plumbing', description: 'Shower head leaking.', status: RequestStatus.COMPLETED, createdAt: '3 days ago', technicianId: 'TEC001', imageUrl: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAgACADAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL/AAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//2Q==` },
    
    // Warden's pending list
    { id: 'SR003', residentName: 'Jane Doe', roomNumber: 'B-101', floor: 1, category: 'Plumbing', description: 'Shower drain clogged.', status: RequestStatus.PENDING, createdAt: '2 hours ago' },
    { id: 'SR004', residentName: 'John Smith', roomNumber: 'C-305', floor: 3, category: 'Electrical', description: 'Main light flickers constantly.', status: RequestStatus.PENDING, createdAt: '5 hours ago' },
    
    // Technician's assigned list (approved by warden but not started)
    { id: 'SR006', residentName: 'Chris Green', roomNumber: 'D-210', floor: 2, category: 'Plumbing', description: 'Bathroom sink is leaking from the pipe below.', status: RequestStatus.APPROVED, createdAt: '3 hours ago', technicianId: 'TEC001' },
];
const initialOutingRequests: OutingRequest[] = [
  { id: 'OR001', residentName: 'Jane Doe', roomNumber: 'B-101', type: 'Leave', purpose: 'Weekend trip home', fromDate: '2024-08-10', toDate: '2024-08-12', fromTime: '17:00', toTime: '19:00', status: RequestStatus.PENDING },
  { id: 'OR002', residentName: 'John Smith', roomNumber: 'C-305', type: 'Outing', purpose: 'Local guardian visit', fromDate: '2024-08-09', toDate: '2024-08-09', fromTime: '09:00', toTime: '17:00', status: RequestStatus.PENDING },
  { id: 'OR003', residentName: 'Barani', roomNumber: 'A-402', type: 'Leave', purpose: 'Attending a family function.', status: RequestStatus.APPROVED, fromDate: '2024-08-20', toDate: '2024-08-21', fromTime: '10:00', toTime: '22:00'},
  { id: 'OR004', residentName: 'Barani', roomNumber: 'A-402', type: 'Outing', purpose: 'Evening movie plan', status: RequestStatus.APPROVED, fromDate: '2024-08-15', toDate: '2024-08-15', fromTime: '18:00', toTime: '22:00' },
  { id: 'OR005', residentName: 'Barani', roomNumber: 'A-402', type: 'Outing', purpose: 'Dinner with friends', status: RequestStatus.APPROVED, fromDate: '2024-08-14', toDate: '2024-08-14', fromTime: '19:00', toTime: '21:00', checkOut: '2024-08-14T19:05:00Z' },
  // Additional data for demonstration
  { id: 'OR006', residentName: 'Jane Doe', roomNumber: 'B-101', type: 'Outing', purpose: 'Shopping', fromDate: '2024-08-16', toDate: '2024-08-16', fromTime: '16:00', toTime: '20:00', status: RequestStatus.APPROVED },
  { id: 'OR007', residentName: 'John Smith', roomNumber: 'C-305', type: 'Leave', purpose: 'Conference', fromDate: '2024-08-17', toDate: '2024-08-18', fromTime: '08:00', toTime: '18:00', status: RequestStatus.APPROVED, checkOut: '2024-08-17T08:10:00Z' },
  { id: 'OR008', residentName: 'Barani', roomNumber: 'A-402', type: 'Outing', purpose: 'Project work', fromDate: '2024-08-15', toDate: '2024-08-15', fromTime: '14:00', toTime: '18:00', status: RequestStatus.APPROVED, checkOut: '2024-08-15T14:02:00Z', checkIn: '2024-08-15T17:55:00Z' },
];

const initialResidents: Resident[] = [
  { id: 'Barani', name: 'Barani', roomNumber: 'A-402', phone: '123-456-7890', email: 'barani@example.com' },
  { id: 'JaneDoe', name: 'Jane Doe', roomNumber: 'B-101', phone: '234-567-8901', email: 'jane.d@example.com' },
  { id: 'JohnSmith', name: 'John Smith', roomNumber: 'C-305', phone: '345-678-9012', email: 'john.s@example.com' },
  { id: 'ChrisGreen', name: 'Chris Green', roomNumber: 'D-210', phone: '456-789-0123', email: 'chris.g@example.com' },
  { id: 'AlexRay', name: 'Alex Ray', roomNumber: 'A-105', phone: '567-890-1234', email: 'alex.r@example.com' },
  { id: 'JordanLee', name: 'Jordan Lee', roomNumber: 'B-208', phone: '678-901-2345', email: 'jordan.l@example.com' },
  { id: 'SamTaylor', name: 'Sam Taylor', roomNumber: 'C-110', phone: '789-012-3456', email: 'sam.t@example.com'},
  { id: 'PatRivera', name: 'Pat Rivera', roomNumber: 'D-401', phone: '890-123-4567', email: 'pat.r@example.com'},
  { id: 'MorganCasey', name: 'Morgan Casey', roomNumber: 'A-303', phone: '901-234-5678', email: 'morgan.c@example.com'},
];

const initialTechnicians: Technician[] = [
    { id: 'TEC001', name: 'Pradeeep', status: 'Online' },
    { id: 'TEC002', name: 'Vishnu', status: 'Offline' },
];


const App: React.FC = () => {
  const [userRole, setUserRole] = useState<Role | null>(() => sessionStorage.getItem('userRole') as Role | null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showLanding, setShowLanding] = useState(!userRole); // Don't show landing if already logged in
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(allInitialServiceRequests);
  const [outingRequests, setOutingRequests] = useState<OutingRequest[]>(initialOutingRequests);
  const [residents, setResidents] = useState<Resident[]>(initialResidents);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [groupBookings, setGroupBookings] = useState<GroupBooking[]>([
    {
        id: 'GB001',
        roomType: '4-Person Sharing',
        creatorId: 'JaneDoe',
        members: [
            { residentId: 'JaneDoe', name: 'Jane Doe', status: 'Accepted' },
            { residentId: 'Barani', name: 'Barani', status: 'Pending' },
            { residentId: 'JordanLee', name: 'Jordan Lee', status: 'Pending' },
        ],
        status: 'PendingConfirmation',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
    }
]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Timer to check for expired group bookings
  useEffect(() => {
    const interval = setInterval(() => {
        setGroupBookings(prevBookings => {
            let hasChanged = false;
            const updatedBookings = prevBookings.map(booking => {
                if (booking.status === 'PendingConfirmation' && new Date(booking.expiresAt) < new Date()) {
                    hasChanged = true;
                    return {
                        ...booking,
                        status: 'Expired' as const,
                        members: booking.members.map(m => 
                            m.status === 'Pending' ? { ...m, status: 'Expired' as const } : m
                        )
                    };
                }
                return booking;
            });
            return hasChanged ? updatedBookings : prevBookings;
        });
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleRoleSelect = (role: Role) => setSelectedRole(role);
  
  const handleLogin = (role: Role) => {
    sessionStorage.setItem('userRole', role);
    setUserRole(role);
    setSelectedRole(null);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    setUserRole(null);
    setSelectedRole(null);
  };
  
  const handleBackToRoleSelection = () => setSelectedRole(null);

  const handleNewServiceRequest = (newRequestData: Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: ServiceRequest = {
      ...newRequestData,
      id: `SR${String(Math.random()).slice(2, 7)}`,
      status: RequestStatus.PENDING,
      createdAt: 'Just now',
    };
    setServiceRequests(prev => [newRequest, ...prev]);
  };

  const handleAssignTechnician = (requestId: string, technicianId: string) => {
    setServiceRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status: RequestStatus.APPROVED, technicianId: technicianId }
          : req
      )
    );
    // Remove assigned request from warden's pending view immediately
    setServiceRequests(prev => prev.filter(req => req.id !== requestId || req.status !== RequestStatus.PENDING));
  };
  
  const handleRejectServiceRequest = (requestId: string) => {
    // In a real app, you might change status to REJECTED instead of removing
    setServiceRequests(prev => prev.filter(req => req.id !== requestId));
  };
  
  const handleUpdateTaskStatus = (taskId: string, newStatus: RequestStatus, completionImageUrl?: string) => {
    setServiceRequests(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus, completionImageUrl: completionImageUrl } : task
      )
    );
  };
  
  const handleNewOutingRequest = (newRequestData: Omit<OutingRequest, 'id' | 'status' | 'residentName' | 'roomNumber'>) => {
      const newRequest: OutingRequest = {
        ...newRequestData,
        id: `OR${String(Math.random()).slice(2, 7)}`,
        status: RequestStatus.PENDING,
        residentName: 'Barani', // Mocked for current user
        roomNumber: 'A-402',    // Mocked for current user
      };
      setOutingRequests(prev => [newRequest, ...prev]);
  };

  const handleUpdateOutingRequest = (requestId: string, newStatus: RequestStatus.APPROVED | RequestStatus.REJECTED) => {
      setOutingRequests(prev =>
          prev.map(req =>
              req.id === requestId ? { ...req, status: newStatus } : req
          )
      );
  };

  const handleCheckOut = (requestId: string) => {
      setOutingRequests(prev =>
          prev.map(req =>
              req.id === requestId ? { ...req, checkOut: new Date().toISOString() } : req
          )
      );
  };

  const handleCheckIn = (requestId: string) => {
      setOutingRequests(prev =>
          prev.map(req =>
              req.id === requestId ? { ...req, checkIn: new Date().toISOString() } : req
          )
      );
  };

  const handleCreateGroupBooking = (roomType: '2-Person Sharing' | '4-Person Sharing', invitedMembers: { residentId: string, name: string }[]) => {
      const creator = { residentId: 'Barani', name: 'Barani', status: 'Accepted' as const };
      const newBooking: GroupBooking = {
          id: `GB${String(Math.random()).slice(2, 7)}`,
          roomType,
          creatorId: 'Barani',
          members: [creator, ...invitedMembers.map(m => ({ ...m, status: 'Pending' as const }))],
          status: 'PendingConfirmation',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      };
      setGroupBookings(prev => [...prev.filter(b => !b.members.some(m => m.residentId === 'Barani')), newBooking]);
  };

  const handleUpdateBookingMemberStatus = (bookingId: string, residentId: string, newStatus: 'Accepted' | 'Rejected') => {
      setGroupBookings(prev => prev.map(booking => {
          if (booking.id === bookingId) {
              const updatedMembers = booking.members.map(member => 
                  member.residentId === residentId ? { ...member, status: newStatus } : member
              );
              
              const allAccepted = updatedMembers.every(m => m.status === 'Accepted');
              
              return {
                  ...booking,
                  members: updatedMembers,
                  status: allAccepted ? 'Confirmed' : (newStatus === 'Rejected' ? 'Cancelled' : booking.status),
              };
          }
          return booking;
      }));
  };

  const handleDismissBooking = (bookingId: string) => {
    setGroupBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const handleUpdateTechnicianStatus = (technicianId: string, newStatus: 'Online' | 'Offline') => {
    setTechnicians(prev => prev.map(tech => 
        tech.id === technicianId ? { ...tech, status: newStatus } : tech
    ));
  };

  const particlesOptions: RecursivePartial<IOptions> = {
      background: {
        color: { value: theme === 'light' ? '#F8FAFC' : '#000000' },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          resize: true,
        },
        modes: {
          repulse: { distance: 80, duration: 0.4 },
        },
      },
      particles: {
        color: { value: theme === 'light' ? '#EA580C' : '#F59E0B' },
        links: {
          color: theme === 'light' ? '#0D9488' : '#34d399',
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: { enable: true, area: 800 },
          value: 40,
        },
        opacity: { value: 0.3 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: true,
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition: Transition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const renderContent = () => {
      if (showLanding) {
        return <LandingPage onEnter={() => setShowLanding(false)} particlesInit={particlesInit} />;
      }
      
      if (userRole) {
        let DashboardComponent;
        let dashboardProps: any = {};
        
        switch (userRole) {
            case Role.RESIDENT:
                DashboardComponent = ResidentDashboard;
                dashboardProps = {
                    serviceRequests: serviceRequests,
                    onNewRequest: handleNewServiceRequest,
                    outingRequests: outingRequests,
                    onNewOutingRequest: handleNewOutingRequest,
                    onCheckOut: handleCheckOut,
                    onCheckIn: handleCheckIn,
                    groupBookings: groupBookings,
                    onCreateGroupBooking: handleCreateGroupBooking,
                    onUpdateBookingMemberStatus: handleUpdateBookingMemberStatus,
                    onDismissBooking: handleDismissBooking,
                };
                break;
            case Role.WARDEN:
                DashboardComponent = WardenDashboard;
                dashboardProps = {
                    residents: residents,
                    technicians: technicians,
                    serviceRequests: serviceRequests,
                    onAssignTechnician: handleAssignTechnician,
                    onRejectRequest: handleRejectServiceRequest,
                    outingRequests: outingRequests,
                    onUpdateOutingRequest: handleUpdateOutingRequest,
                };
                break;
            case Role.TECHNICIAN:
                DashboardComponent = TechnicianDashboard;
                 dashboardProps = {
                    tasks: serviceRequests,
                    onUpdateStatus: handleUpdateTaskStatus,
                    technician: technicians.find(t => t.id === 'TEC001'), // Mock current tech
                    onUpdateTechnicianStatus: handleUpdateTechnicianStatus,
                };
                break;
            default: return null;
        }
        return (
            <div className="flex flex-col h-screen bg-base-100 dark:bg-dark-bg">
                <Navbar onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100 dark:bg-dark-bg px-4 sm:px-6 lg:px-8 py-8">
                        <AnimatePresence mode="wait">
                            <motion.div key={userRole} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <DashboardComponent {...dashboardProps} />
                            </motion.div>
                        </AnimatePresence>
                    </main>
                    <Footer />
                </div>
            </div>
        );
      }
      
      return (
        <div className={`min-h-screen font-sans bg-base-100 dark:bg-dark-bg`}>
            <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
            <main className="relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div key={selectedRole ? 'login' : 'role-select'} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                        {selectedRole ? (
                            <LoginForm role={selectedRole} onLogin={handleLogin} onBack={handleBackToRoleSelection} />
                        ) : (
                            <RoleSelectionScreen onSelectRole={handleRoleSelect} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
      )
  };

  return renderContent();
};

interface RoleSelectionScreenProps {
  onSelectRole: (role: Role) => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden p-4">
        <video autoPlay loop muted playsInline className="absolute z-0 w-auto min-w-full min-h-full max-w-none opacity-20 dark:opacity-10">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-university-students-walking-in-a-hallway-4482-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div className="relative z-10 text-center mb-12">
            <motion.h2 variants={itemVariants} initial="hidden" animate="visible" className="text-4xl font-extrabold text-neutral-800 dark:text-white sm:text-5xl md:text-6xl">
            Smart Living, <span className="text-secondary dark:text-secondary-focus">Smarter Management.</span>
            </motion.h2>
            <motion.p variants={itemVariants} initial="hidden" animate="visible" className="mt-4 max-w-2xl mx-auto text-xl text-neutral-500 dark:text-base-300">
            Your all-in-one digital hostel experience starts here.
            </motion.p>
        </div>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <RoleCard role={Role.RESIDENT} onSelectRole={onSelectRole} />
            <RoleCard role={Role.WARDEN} onSelectRole={onSelectRole} />
            <RoleCard role={Role.TECHNICIAN} onSelectRole={onSelectRole} />
        </motion.div>
    </div>
  );
};

interface RoleCardProps {
    role: Role;
    onSelectRole: (role: Role) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onSelectRole }) => {
    const descriptions: Record<Role, string> = {
        [Role.RESIDENT]: "Book rooms, request services, and manage outings.",
        [Role.WARDEN]: "Approve requests, view analytics, and manage hostel operations.",
        [Role.TECHNICIAN]: "View assigned tasks, update status, and resolve issues.",
    };
    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    };

    return (
        <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -10 }} className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20 dark:border-black/20 text-center">
            <h3 className="text-2xl font-bold capitalize text-primary dark:text-emerald-400">{role}</h3>
            <p className="text-neutral-600 dark:text-base-300 mt-2 mb-6 h-12">{descriptions[role]}</p>
            <motion.button
                onClick={() => onSelectRole(role)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-secondary to-accent text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl transition-shadow"
            >
                Login as {role}
            </motion.button>
        </motion.div>
    );
};

export default App;