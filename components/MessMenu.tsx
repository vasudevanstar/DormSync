import React, { useState } from 'react';
import Card from './Card';
import { AcademicCapIcon } from '../constants'; // Using a relevant icon
import { motion, AnimatePresence } from 'framer-motion';

type Meal = {
    breakfast: string;
    lunch: string;
    dinner: string;
};

const menuData: Record<string, Meal> = {
    Monday: { breakfast: 'Idly, Sambar, Chutney', lunch: 'Rice, Dal, Veg Curry, Curd', dinner: 'Chapathi, Paneer Butter Masala' },
    Tuesday: { breakfast: 'Pongal, Vada Curry', lunch: 'Lemon Rice, Potato Fry, Sambar', dinner: 'Dosa, Chutney, Sambar' },
    Wednesday: { breakfast: 'Puri, Aloo Masala', lunch: 'Variety Rice, Aviyal', dinner: 'Rice, Rasam, Veg Poriyal' },
    Thursday: { breakfast: 'Kichadi, Coconut Chutney', lunch: 'Rice, Sambar, Beans Poriyal', dinner: 'Parotta, Veg Kurma' },
    Friday: { breakfast: 'Semiya Upma, Chutney', lunch: 'Full Meals with Special Sweet', dinner: 'Fried Rice, Gobi Manchurian' },
    Saturday: { breakfast: 'Masala Dosa, Sambar', lunch: 'Bisi Bele Bath, Appalam', dinner: 'Chapathi, Dal Fry' },
    Sunday: { breakfast: 'Aloo Paratha, Curd', lunch: 'Veg Biryani, Raita', dinner: 'Idly, Dosa, Sambar, Chutney' },
};

const days = Object.keys(menuData);

const MessMenu: React.FC = () => {
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    const [selectedDay, setSelectedDay] = useState(days.includes(today) ? today : 'Monday');

    return (
        <Card>
            <div className="flex items-center gap-3 mb-4">
                <AcademicCapIcon />
                <h3 className="text-xl font-bold">Weekly Mess Menu</h3>
            </div>
            <div className="flex space-x-1 rounded-xl bg-base-200 dark:bg-neutral-800 p-1 mb-4 overflow-x-auto">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors focus:outline-none ${
                            selectedDay === day 
                            ? 'bg-white dark:bg-neutral-700 shadow text-secondary' 
                            : 'text-neutral-600 dark:text-base-300 hover:bg-white/50 dark:hover:bg-neutral-700/50'
                        }`}
                    >
                        {day.substring(0,3)}
                    </button>
                ))}
            </div>
             <AnimatePresence mode="wait">
                <motion.div
                    key={selectedDay}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="space-y-3">
                        <div>
                            <p className="font-semibold text-sm text-neutral-500 dark:text-base-300">Breakfast</p>
                            <p className="text-neutral-800 dark:text-white">{menuData[selectedDay].breakfast}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-neutral-500 dark:text-base-300">Lunch</p>
                            <p className="text-neutral-800 dark:text-white">{menuData[selectedDay].lunch}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-neutral-500 dark:text-base-300">Dinner</p>
                            <p className="text-neutral-800 dark:text-white">{menuData[selectedDay].dinner}</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </Card>
    );
};

export default MessMenu;
