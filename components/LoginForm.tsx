import React, { useState } from 'react';
import { Role } from '../types';
import { UserIcon, LockIcon, ChevronLeftIcon } from '../constants';
import { motion } from 'framer-motion';
import { authenticateUser } from '../services/authService';

interface LoginFormProps {
  role: Role;
  onLogin: (role: Role) => void;
  onBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onLogin, onBack }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId.trim() || !password.trim()) {
      setError('User ID and Password cannot be empty.');
      return;
    }

    setIsLoading(true);
    const isAuthenticated = await authenticateUser(role, userId, password);
    setIsLoading(false);

    if (isAuthenticated) {
      onLogin(role);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20 dark:border-black/30"
      >
         <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full text-neutral-500 dark:text-base-300 hover:bg-white/10 dark:hover:bg-black/20">
            <ChevronLeftIcon />
            <span className="sr-only">Back</span>
         </motion.button>
        <h2 className="text-3xl font-bold text-center mb-2 text-primary dark:text-emerald-400">{roleName} Login</h2>
        <p className="text-center text-neutral-500 dark:text-base-300 mb-8">Enter your credentials to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-neutral-700 dark:text-base-300">{roleName} ID</label>
            <div className="mt-1 relative rounded-md">
                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <UserIcon />
                 </div>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 bg-base-200/50 dark:bg-neutral-800/50 border border-base-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    placeholder="Your ID"
                    disabled={isLoading}
                />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-base-300">Password</label>
             <div className="mt-1 relative rounded-md">
                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <LockIcon />
                 </div>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 bg-base-200/50 dark:bg-neutral-800/50 border border-base-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    placeholder="••••••••"
                    disabled={isLoading}
                />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <motion.button
              type="submit"
              whileHover={{ scale: isLoading ? 1 : 1.05, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-secondary to-accent hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;