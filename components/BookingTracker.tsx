import React, { useState, useEffect } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { GroupBooking, GroupBookingMember } from '../types';
import { XCircleIcon, CheckCircleIcon, XIcon } from '../constants';

interface BookingTrackerProps {
  booking: GroupBooking | null;
  currentUser: { id: string, name: string };
  onUpdateStatus: (bookingId: string, residentId: string, newStatus: 'Accepted' | 'Rejected') => void;
  onDismissBooking: (bookingId: string) => void;
}

const CountdownCircle: React.FC<{ timeLeft: number, totalDuration: number }> = ({ timeLeft, totalDuration }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / totalDuration;
    const offset = circumference * (1 - progress);
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    return (
        <div className="relative w-28 h-28 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                    cx="50" cy="50" r={radius}
                    className="stroke-current text-primary/10 dark:text-primary/20"
                    strokeWidth="8" fill="transparent"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="50" cy="50" r={radius}
                    className="stroke-current text-primary dark:text-emerald-400"
                    strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                 <p className="text-2xl font-bold text-primary dark:text-emerald-400 tracking-wider">
                    {minutes}:{seconds}
                </p>
            </div>
        </div>
    );
};

const BookingTracker: React.FC<BookingTrackerProps> = ({ booking, currentUser, onUpdateStatus, onDismissBooking }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const totalDuration = 10 * 60; // 10 minutes

  useEffect(() => {
    if (!booking || booking.status !== 'PendingConfirmation') {
      setTimeLeft(0);
      return;
    }
    
    const calculateTimeLeft = () => {
        const difference = +new Date(booking.expiresAt) - +new Date();
        return difference > 0 ? Math.floor(difference / 1000) : 0;
    }

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [booking]);


  const getStatusColor = (status: GroupBookingMember['status']) => {
    switch (status) {
      case 'Accepted': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Expired': return 'bg-red-500';
      case 'Rejected': return 'bg-gray-500';
    }
  };
  
  const handleUpdate = (newStatus: 'Accepted' | 'Rejected') => {
    if (booking) {
        onUpdateStatus(booking.id, currentUser.id, newStatus);
    }
  };

  if (!booking) {
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-primary dark:text-emerald-400">Live Group Booking</h3>
            <div className="text-center text-neutral-500 dark:text-base-300 p-4">
                You are not part of any active group booking.
            </div>
        </Card>
    );
  }
  
  const currentUserMember = booking.members.find(m => m.residentId === currentUser.id);
  const isFinalState = ['Confirmed', 'Expired', 'Cancelled'].includes(booking.status);

  return (
    <Card className="relative">
      {isFinalState && (
         <motion.button 
            onClick={() => onDismissBooking(booking.id)}
            whileHover={{ scale: 1.2, rotate: 90 }} whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
            aria-label="Dismiss"
         >
            <XIcon />
         </motion.button>
      )}
      <h3 className="text-xl font-bold mb-4 text-primary dark:text-emerald-400">Live Group Booking</h3>
      <p className="text-neutral-600 dark:text-base-300 mb-4">Room: {booking.roomType}</p>
      
      {booking.status === 'PendingConfirmation' && (
          <div className="text-center p-4 rounded-lg mb-4">
              <p className="font-semibold text-primary dark:text-emerald-300 mb-2">Invitation Expires In:</p>
              <CountdownCircle timeLeft={timeLeft} totalDuration={totalDuration} />
          </div>
      )}

      {booking.status === 'Confirmed' && (
        <div className="text-center bg-green-500/10 text-green-800 dark:text-green-300 p-4 rounded-lg mb-4 border border-green-500/20">
            <h4 className="font-bold text-lg">Booking Confirmed!</h4>
            <p>Your room has been successfully allocated.</p>
        </div>
      )}

      {(booking.status === 'Expired' || booking.status === 'Cancelled') && (
         <div className="text-center bg-red-500/10 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4 border border-red-500/20">
            <h4 className="font-bold text-lg">{booking.status === 'Expired' ? 'Booking Expired' : 'Booking Cancelled'}</h4>
            <p>{booking.status === 'Expired' ? 'Not all members accepted in time.' : 'A member rejected the invitation.'}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {booking.members.map(member => (
          <div key={member.residentId} className="flex items-center justify-between bg-base-100/50 dark:bg-neutral-800/50 p-3 rounded-md">
            <div className="flex items-center">
              <motion.span 
                animate={member.status === 'Pending' ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(member.status)}`}
              ></motion.span>
              <p className="font-medium text-neutral-800 dark:text-base-200">{member.name}</p>
            </div>
            <p className={`text-sm font-semibold ${
              member.status === 'Accepted' ? 'text-green-500' :
              member.status === 'Pending' ? 'text-yellow-500' :
              member.status === 'Expired' ? 'text-red-500' :
              'text-gray-500'
            }`}>
              {member.status}
            </p>
          </div>
        ))}
      </div>
      
      {currentUserMember?.status === 'Pending' && booking.status === 'PendingConfirmation' && (
        <div className="mt-4 grid grid-cols-2 gap-3">
            <motion.button 
              onClick={() => handleUpdate('Rejected')}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 text-sm font-bold bg-red-500 text-white py-2 px-3 rounded-full hover:bg-red-600"
            >
              <XCircleIcon /> Reject
            </motion.button>
            <motion.button 
              onClick={() => handleUpdate('Accepted')}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 text-sm font-bold bg-green-500 text-white py-2 px-3 rounded-full hover:bg-green-600"
            >
              <CheckCircleIcon /> Accept
            </motion.button>
        </div>
      )}
    </Card>
  );
};

export default BookingTracker;