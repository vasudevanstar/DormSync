import React, { useState, useEffect } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, UserCircleIcon, MailIcon, PhoneIcon, BedIcon } from '../constants';

interface ProfileData {
  name: string;
  roomNumber: string;
  email: string;
  phone: string;
}

interface ResidentProfileProps {
  profile: ProfileData;
  onUpdate: (data: { email: string, phone: string }) => void;
  onBack: () => void;
}

const InfoRow: React.FC<{icon: React.ReactNode, label: string, value: string}> = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 py-3 border-b border-base-200 dark:border-neutral-700">
        <div className="text-secondary">{icon}</div>
        <div>
            <p className="text-sm text-neutral-500 dark:text-base-300">{label}</p>
            <p className="font-semibold text-neutral-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const ResidentProfile: React.FC<ResidentProfileProps> = ({ profile, onUpdate, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ email: profile.email, phone: profile.phone });
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({ email: profile.email, phone: profile.phone });
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.email.includes('@') || formData.phone.length < 10) {
            setError('Please enter a valid email and phone number.');
            return;
        }
        setError('');
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ email: profile.email, phone: profile.phone });
        setIsEditing(false);
        setError('');
    }

  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
        <div className="flex items-center mb-6">
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-base-200/50 dark:hover:bg-neutral-800/50">
                <ChevronLeftIcon />
            </motion.button>
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-white">My Profile</h2>
        </div>
        <Card className="max-w-2xl">
            <div className="text-center mb-6">
                <div className="mx-auto w-24 h-24 bg-primary/10 text-primary dark:bg-primary/20 dark:text-emerald-300 rounded-full flex items-center justify-center mb-2">
                    <UserCircleIcon />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">{profile.name}</h3>
                <p className="text-neutral-500 dark:text-base-300">Resident</p>
            </div>
            
            <div className="space-y-2">
                <InfoRow icon={<UserCircleIcon />} label="Full Name" value={profile.name} />
                <InfoRow icon={<BedIcon />} label="Room Number" value={profile.roomNumber} />
                
                {isEditing ? (
                    <>
                        <div className="flex items-center gap-4 py-3 border-b border-base-200 dark:border-neutral-700">
                             <div className="text-secondary"><MailIcon /></div>
                             <div className="flex-1">
                                <label htmlFor="email" className="text-sm text-neutral-500 dark:text-base-300">Email Address</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent font-semibold text-neutral-800 dark:text-white focus:outline-none" />
                            </div>
                        </div>
                         <div className="flex items-center gap-4 py-3">
                             <div className="text-secondary"><PhoneIcon /></div>
                             <div className="flex-1">
                                <label htmlFor="phone" className="text-sm text-neutral-500 dark:text-base-300">Phone Number</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-transparent font-semibold text-neutral-800 dark:text-white focus:outline-none" />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <InfoRow icon={<MailIcon />} label="Email Address" value={profile.email} />
                        <InfoRow icon={<PhoneIcon />} label="Phone Number" value={profile.phone} />
                    </>
                )}
            </div>

            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
            
            <div className="mt-8 flex justify-end gap-4">
                {isEditing ? (
                    <>
                        <motion.button onClick={handleCancel} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="py-2 px-4 bg-base-200 dark:bg-neutral-600 font-semibold rounded-lg">Cancel</motion.button>
                        <motion.button onClick={handleSave} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="py-2 px-4 bg-primary text-white font-semibold rounded-lg">Save Changes</motion.button>
                    </>
                ) : (
                    <motion.button onClick={() => setIsEditing(true)} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="py-2 px-4 bg-secondary text-white font-semibold rounded-lg">Edit Profile</motion.button>
                )}
            </div>
        </Card>
    </motion.div>
  );
};

export default ResidentProfile;