import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { UsersIcon } from '../constants';
import { GroupBooking } from '../types';

interface NewGroupBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomType: GroupBooking['roomType'], invitedMembers: { residentId: string, name: string }[]) => void;
}

const availableResidents = [ // Mock data of other residents
    { residentId: 'AlexRay', name: 'Alex Ray' },
    { residentId: 'JordanLee', name: 'Jordan Lee' },
    { residentId: 'ChrisGreen', name: 'Chris Green' },
    { residentId: 'JaneDoe', name: 'Jane Doe' },
    { residentId: 'JohnSmith', name: 'John Smith' },
];

const NewGroupBookingModal: React.FC<NewGroupBookingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [roomType, setRoomType] = useState<GroupBooking['roomType']>('4-Person Sharing');
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
  const [error, setError] = useState('');
  
  const requiredMembers = roomType === '4-Person Sharing' ? 3 : 1;

  useEffect(() => {
    if (isOpen) {
      setRoomType('4-Person Sharing');
      setInvitedMembers([]);
      setError('');
    }
  }, [isOpen]);

  // Reset selections when room type changes to prevent errors
  useEffect(() => {
    setInvitedMembers([]);
    setError('');
  }, [roomType]);

  const handleMemberToggle = (residentId: string) => {
    setInvitedMembers(prev => {
      if (prev.includes(residentId)) {
        return prev.filter(id => id !== residentId);
      }
      if (prev.length < requiredMembers) {
        return [...prev, residentId];
      }
      return prev; // Limit to required members
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invitedMembers.length !== requiredMembers) {
      setError(`You must invite exactly ${requiredMembers} member(s) to form a group for this room.`);
      return;
    }
    const membersToSubmit = availableResidents.filter(res => invitedMembers.includes(res.residentId));
    onSubmit(roomType, membersToSubmit);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Group Booking">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomType" className="block text-sm font-medium text-neutral-700 dark:text-base-300">Room Type</label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value as GroupBooking['roomType'])}
            className="mt-1 block w-full px-3 py-2 bg-base-100 dark:bg-neutral-700 border border-base-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
          >
            <option>4-Person Sharing</option>
            <option>2-Person Sharing</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-base-300">Invite Members ({invitedMembers.length}/{requiredMembers})</label>
          <div className="mt-2 p-2 border border-base-300 dark:border-neutral-600 rounded-md max-h-60 overflow-y-auto space-y-2">
            {availableResidents.map(resident => (
              <div key={resident.residentId} className="flex items-center justify-between p-2 rounded-md bg-base-100 dark:bg-neutral-700/50">
                <span className="font-medium text-neutral-800 dark:text-base-200">{resident.name}</span>
                <input
                  type="checkbox"
                  checked={invitedMembers.includes(resident.residentId)}
                  onChange={() => handleMemberToggle(resident.residentId)}
                  disabled={!invitedMembers.includes(resident.residentId) && invitedMembers.length >= requiredMembers}
                  className="h-5 w-5 rounded text-secondary focus:ring-secondary disabled:opacity-50"
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-end gap-4 pt-2">
          <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-2 px-4 bg-base-200 dark:bg-neutral-600 text-neutral-800 dark:text-base-200 font-semibold rounded-lg hover:bg-base-300 dark:hover:bg-neutral-500">Cancel</motion.button>
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-focus">
            <UsersIcon />
            Send Invitations
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};

export default NewGroupBookingModal;