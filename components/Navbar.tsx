import React from 'react';
import { HomeLogo, LoginIcon } from '../constants';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

interface NavbarProps {
    onLogout: () => void;
    theme: string;
    toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, theme, toggleTheme }) => {
    return (
        <header className="bg-base-100/80 dark:bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-30 border-b border-base-300 dark:border-neutral-700/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2 text-secondary-focus">
                       <HomeLogo />
                       <span className="font-bold text-xl text-neutral-800 dark:text-white">DormSync</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        <motion.button
                            onClick={onLogout}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-base-300 hover:text-secondary dark:hover:text-secondary-focus"
                        >
                            <LoginIcon />
                            <span>Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;