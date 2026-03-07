import React from 'react';
import { Role } from '../types';
import { HomeIcon, BedIcon, WalkingIcon, WrenchIcon, ClipboardListIcon, UsersIcon, BarChartIcon, XIcon, HomeLogo, LoginIcon } from '../constants';
// Fix: Import Variants type from framer-motion.
import { motion, AnimatePresence, Variants } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
    role: Role;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    theme: string;
    toggleTheme: () => void;
}

// Fix: Explicitly type sidebarVariants with Variants to fix type inference issue.
const sidebarVariants: Variants = {
    open: { x: 0, transition: { type: "tween", ease: "circOut" } },
    closed: { x: "-100%", transition: { type: "tween", ease: "circIn" } },
};

const navItems: Record<Role, { name: string; icon: React.ReactNode; href: string }[]> = {
    [Role.RESIDENT]: [
        { name: 'Dashboard', icon: <HomeIcon />, href: '#' },
        { name: 'Room Booking', icon: <BedIcon />, href: '#' },
        { name: 'Outing Requests', icon: <WalkingIcon />, href: '#' },
        { name: 'Amenities', icon: <WrenchIcon />, href: '#' },
    ],
    [Role.WARDEN]: [
        { name: 'Dashboard', icon: <HomeIcon />, href: '#' },
        { name: 'Pending Approvals', icon: <ClipboardListIcon />, href: '#' },
        { name: 'Residents', icon: <UsersIcon />, href: '#' },
        { name: 'Technicians', icon: <WrenchIcon />, href: '#' },
        { name: 'Reports', icon: <BarChartIcon />, href: '#' },
    ],
    [Role.TECHNICIAN]: [
        { name: 'Dashboard', icon: <HomeIcon />, href: '#' },
        { name: 'Assigned Tasks', icon: <ClipboardListIcon />, href: '#' },
        { name: 'Heatmap', icon: <BarChartIcon />, href: '#' },
    ],
};

const NavLink: React.FC<{item: { name: string; icon: React.ReactNode; href: string }}> = ({ item }) => (
     <a href={item.href} className="flex items-center px-4 py-3 text-base-300 rounded-lg hover:bg-primary-focus hover:text-white transition-colors duration-200">
        <span className="mr-3">{item.icon}</span>
        <span>{item.name}</span>
    </a>
);

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, setOpen, onLogout, theme, toggleTheme }) => {
    const menuItems = navItems[role];

    return (
        <>
            {/* Overlay for mobile */}
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                />
            )}
            </AnimatePresence>

            <motion.aside
                variants={sidebarVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                className={`fixed top-0 left-0 h-full bg-neutral-800 text-white w-64 z-40 lg:relative lg:translate-x-0 lg:flex-shrink-0 flex flex-col`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-700">
                    <a href="#" className="flex items-center gap-2 text-secondary-focus">
                       <HomeLogo />
                       <span className="font-bold text-xl">DormSync</span>
                    </a>
                    <button onClick={() => setOpen(false)} className="p-2 rounded-md text-base-300 hover:bg-neutral-700 lg:hidden">
                        <XIcon />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => <NavLink key={item.name} item={item} />)}
                </nav>
                 <div className="p-4 border-t border-neutral-700 space-y-2">
                  <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-base-300">Toggle Theme</span>
                      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                  </div>
                  <button
                      onClick={onLogout}
                      className="w-full flex items-center px-4 py-3 text-base-300 rounded-lg hover:bg-red-900/50 hover:text-red-300 transition-colors duration-200"
                  >
                      <span className="mr-3"><LoginIcon /></span>
                      <span>Logout</span>
                  </button>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;