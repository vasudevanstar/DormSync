import React, { useMemo } from 'react';
import { ServiceRequest } from '../types';
import Card from './Card';
import { BarChartIcon, BoltIcon, DropletsIcon, HammerIcon, WrenchIcon } from '../constants';

interface PerformanceAnalyticsProps {
  completedTasks: ServiceRequest[];
}

const CategoryStat: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string }> = ({ icon, label, value, color }) => (
    <div className="flex items-center justify-between p-2 bg-base-100 dark:bg-neutral-700/50 rounded-md">
        <div className="flex items-center gap-3">
            <div className={`p-1 rounded-md ${color}`}>
                {icon}
            </div>
            <span className="font-semibold text-neutral-800 dark:text-base-200">{label}</span>
        </div>
        <span className="font-bold text-lg text-primary dark:text-emerald-400">{value}</span>
    </div>
);

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ completedTasks }) => {
    const stats = useMemo(() => {
        const initialStats = {
            Electrical: 0,
            Plumbing: 0,
            Carpentry: 0,
            Other: 0,
        };

        return completedTasks.reduce((acc, task) => {
            if (acc.hasOwnProperty(task.category)) {
                acc[task.category]++;
            }
            return acc;
        }, initialStats as Record<ServiceRequest['category'], number>);
    }, [completedTasks]);

    const totalCompleted = completedTasks.length;

    return (
        <Card>
            <div className="flex items-center gap-3 mb-4">
                <BarChartIcon />
                <h3 className="text-xl font-bold">Performance Analytics</h3>
            </div>
            
            <div className="text-center p-4 mb-4 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/20">
                <p className="text-sm font-semibold text-primary dark:text-emerald-400">Total Tasks Completed</p>
                <p className="text-5xl font-extrabold text-primary dark:text-emerald-300">{totalCompleted}</p>
            </div>

            <div className="space-y-2">
                <h4 className="text-sm font-bold text-neutral-600 dark:text-base-300 mb-2">Breakdown by Category:</h4>
                <CategoryStat icon={<BoltIcon />} label="Electrical" value={stats.Electrical} color="bg-yellow-500/20 text-yellow-600" />
                <CategoryStat icon={<DropletsIcon />} label="Plumbing" value={stats.Plumbing} color="bg-blue-500/20 text-blue-600" />
                <CategoryStat icon={<HammerIcon />} label="Carpentry" value={stats.Carpentry} color="bg-orange-500/20 text-orange-600" />
                <CategoryStat icon={<WrenchIcon />} label="Other" value={stats.Other} color="bg-gray-500/20 text-gray-600" />
            </div>
        </Card>
    );
};

export default PerformanceAnalytics;
