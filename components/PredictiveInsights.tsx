// Fix: Create PredictiveInsights component.
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { MaintenancePrediction } from '../types';
import { getMaintenancePredictions } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, ChevronRightIcon } from '../constants';
import PredictionDetailsModal from './PredictionDetailsModal';

const PredictiveInsights: React.FC = () => {
  const [predictions, setPredictions] = useState<MaintenancePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState<MaintenancePrediction | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getMaintenancePredictions();
        setPredictions(data);
      } catch (err) {
        setError('Could not fetch predictive insights.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood > 0.7) return 'text-red-500';
    if (likelihood > 0.5) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <>
      <Card>
        <div className="flex items-center gap-3 mb-4">
            <SparklesIcon />
            <h3 className="text-xl font-bold">Predictive Maintenance</h3>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {isLoading && <p className="text-neutral-500">Analyzing data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <AnimatePresence>
            {!isLoading && predictions.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: index * 0.1 } }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => setSelectedPrediction(p)}
                className="bg-base-200/50 dark:bg-neutral-800/50 p-3 rounded-lg cursor-pointer hover:bg-base-300/50 dark:hover:bg-neutral-700/50"
              >
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold text-neutral-800 dark:text-white">{p.category} Issue</p>
                        <p className="text-sm text-neutral-500 dark:text-base-300">Wing {p.wing}, Floor {p.floor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${getLikelihoodColor(p.likelihood)}`}>
                            {Math.round(p.likelihood * 100)}%
                        </span>
                        <ChevronRightIcon />
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
      <PredictionDetailsModal
        prediction={selectedPrediction}
        isOpen={!!selectedPrediction}
        onClose={() => setSelectedPrediction(null)}
      />
    </>
  );
};

export default PredictiveInsights;
