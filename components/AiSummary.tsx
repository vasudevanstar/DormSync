import React, { useState, useEffect } from 'react';
import { ServiceRequest, OutingRequest } from '../types';
import { generateWardenSummary } from '../services/geminiService';
import { SparklesIcon } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';


interface AiSummaryProps {
  serviceRequests: ServiceRequest[];
  outingRequests: OutingRequest[];
}

const AiSummary: React.FC<AiSummaryProps> = ({ serviceRequests, outingRequests }) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await generateWardenSummary(serviceRequests, outingRequests);
      setSummary(result);
    } catch (err) {
      setError('Failed to generate summary.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateSummary();
  }, [serviceRequests, outingRequests]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-2xl p-6 shadow-lg border border-white/20 dark:border-black/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-primary dark:text-emerald-400">AI-Powered Insights</h3>
        <motion.button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-secondary to-accent text-white font-semibold py-2 px-4 rounded-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <motion.div
            animate={{ rotate: isLoading ? [0, 360] : 0 }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
          >
            <SparklesIcon />
          </motion.div>
          {isLoading ? 'Generating...' : 'Refresh'}
        </motion.button>
      </div>

      {isLoading && <div className="text-center p-4 text-neutral-600 dark:text-base-300">Generating your daily briefing...</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}
      
      <AnimatePresence>
        {!isLoading && summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="prose prose-sm dark:prose-invert max-w-none bg-base-100/50 dark:bg-neutral-800/50 p-4 rounded-md shadow-inner overflow-hidden"
            dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AiSummary;