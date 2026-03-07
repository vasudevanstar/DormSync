import React, { useEffect, useState } from 'react';
import Card from './Card';
import { motion, useSpring } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
}

const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const springValue = useSpring(0, { damping: 20, stiffness: 100 });

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            setDisplayValue(Math.round(latest));
        });
        return unsubscribe;
    }, [springValue]);

    return <motion.span>{displayValue}</motion.span>;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass }) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className={`p-4 rounded-xl mr-4 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-base-300 font-medium">{label}</p>
          <p className="text-3xl font-bold text-neutral-800 dark:text-white">
            <AnimatedNumber value={value} />
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;