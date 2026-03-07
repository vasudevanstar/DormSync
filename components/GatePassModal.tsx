
import React from 'react';
import Modal from './Modal';
import { OutingRequest } from '../types';
import { motion } from 'framer-motion';
import { UserCircleIcon, CalendarClockIcon, CheckCircleIcon, XCircleIcon } from '../constants';

interface GatePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: OutingRequest | null;
  onCheckOut: (requestId: string) => void;
  onCheckIn: (requestId: string) => void;
}

const GatePassModal: React.FC<GatePassModalProps> = ({ isOpen, onClose, request, onCheckOut, onCheckIn }) => {
  if (!request) return null;

  const qrData = encodeURIComponent(JSON.stringify({
    outingId: request.id,
    residentName: request.residentName,
    roomNumber: request.roomNumber,
  }));

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

  const formatDateTime = (date: string, time: string) => new Date(`${date}T${time}`).toLocaleString();

  const handleCheckOut = () => {
      onCheckOut(request.id);
  }

  const handleCheckIn = () => {
      onCheckIn(request.id);
      // Don't close immediately, let the user see the confirmation message.
      // onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Gate Pass">
      <div className="text-center">
        <div className="bg-base-100 dark:bg-neutral-800 p-4 rounded-lg inline-block border border-base-300 dark:border-neutral-700">
            <img src={qrCodeUrl} alt="Gate Pass QR Code" width="200" height="200" />
        </div>
        <p className="text-xs text-neutral-500 mt-2">Present this QR code to the security personnel.</p>

        <div className="text-left my-6 space-y-3">
            <div className="flex items-center gap-3">
                <UserCircleIcon />
                <div>
                    <p className="font-bold text-lg">{request.residentName}</p>
                    <p className="text-sm text-neutral-500 dark:text-base-300">{request.roomNumber}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <CalendarClockIcon className="h-6 w-6 text-secondary" />
                <div>
                    <p className="font-semibold text-neutral-800 dark:text-white">Valid From:</p>
                    <p className="text-sm text-neutral-500 dark:text-base-300">{formatDateTime(request.fromDate, request.fromTime)}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <CalendarClockIcon className="h-6 w-6 text-secondary" />
                <div>
                    <p className="font-semibold text-neutral-800 dark:text-white">Valid Until:</p>
                    <p className="text-sm text-neutral-500 dark:text-base-300">{formatDateTime(request.toDate, request.toTime)}</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            {!request.checkOut ? (
                 <motion.button 
                    onClick={handleCheckOut}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg"
                 >
                    <XCircleIcon />
                    Simulate Check-Out Scan
                 </motion.button>
            ) : !request.checkIn ? (
                <>
                    <p className="text-sm text-green-600 dark:text-green-400 font-semibold">Checked out at: {new Date(request.checkOut).toLocaleString()}</p>
                    <motion.button 
                        onClick={handleCheckIn}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-green-600 text-white font-bold rounded-lg"
                    >
                        <CheckCircleIcon />
                        Simulate Check-In Scan
                    </motion.button>
                </>
            ) : (
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold p-4 bg-green-500/10 rounded-lg">
                    Journey complete! Checked in at {new Date(request.checkIn).toLocaleString()}.
                </p>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default GatePassModal;
