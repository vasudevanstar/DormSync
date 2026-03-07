// Fix: Create BookingCard.tsx component.
import React from 'react';
import Card from './Card';
import { BedIcon } from '../constants';
import { motion } from 'framer-motion';

interface BookingCardProps {
    onStartBooking: () => void;
    hasActiveBooking: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ onStartBooking, hasActiveBooking }) => {

    const handleViewOptions = () => {
        if (hasActiveBooking) {
            alert("You are already in a booking group. Please resolve it before creating a new one.");
            return;
        }
        onStartBooking();
    };

    return (
        <>
            <Card>
                <h3 className="text-xl font-bold mb-4 text-primary dark:text-emerald-400">Room Booking</h3>
                <div className="space-y-4">
                     <div className="flex items-center gap-4 bg-base-100/50 dark:bg-neutral-800/50 p-3 rounded-lg">
                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg text-primary dark:text-emerald-300">
                            <BedIcon />
                        </div>
                        <div>
                            <p className="font-bold">4-Person Sharing</p>
                            <p className="text-sm text-green-600 dark:text-green-400">Available for Group Booking</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-base-100/50 dark:bg-neutral-800/50 p-3 rounded-lg">
                        <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg text-primary dark:text-emerald-300">
                            <BedIcon />
                        </div>
                        <div>
                            <p className="font-bold">2-Person Sharing</p>
                            <p className="text-sm text-green-600 dark:text-green-400">Available for Group Booking</p>
                        </div>
                    </div>
                   
                    <motion.button 
                        onClick={handleViewOptions}
                        whileHover={{ scale: hasActiveBooking ? 1 : 1.05 }} 
                        whileTap={{ scale: hasActiveBooking ? 1 : 0.95 }} 
                        disabled={hasActiveBooking}
                        className="w-full bg-gradient-to-r from-secondary to-accent text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Group Booking
                    </motion.button>
                </div>
            </Card>
        </>
    );
};

export default BookingCard;