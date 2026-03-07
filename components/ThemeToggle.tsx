import React from 'react';
import { SunIcon, MoonIcon } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-neutral-500 dark:text-base-200 hover:bg-base-200/50 dark:hover:bg-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;