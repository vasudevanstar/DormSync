import React, { useState, useEffect } from 'react';
import Card from './Card';
import { motion } from 'framer-motion';
import { DownloadIcon } from '../constants';

// Define a more detailed data structure
interface HeatmapDataPoint {
  floor: number;
  room: number;
  requests: {
    total: number;
    electrical: number;
    plumbing: number;
    carpentry: number;
    other: number;
  };
}

// Updated mock data with category breakdown.
const initialHeatmapData: HeatmapDataPoint[] = [
  { floor: 1, room: 101, requests: { total: 3, electrical: 2, plumbing: 1, carpentry: 0, other: 0 } },
  { floor: 1, room: 102, requests: { total: 5, electrical: 1, plumbing: 3, carpentry: 1, other: 0 } },
  { floor: 1, room: 108, requests: { total: 1, electrical: 0, plumbing: 0, carpentry: 0, other: 1 } },
  { floor: 2, room: 203, requests: { total: 1, electrical: 1, plumbing: 0, carpentry: 0, other: 0 } },
  { floor: 2, room: 205, requests: { total: 6, electrical: 2, plumbing: 2, carpentry: 2, other: 0 } },
  { floor: 2, room: 210, requests: { total: 2, electrical: 0, plumbing: 2, carpentry: 0, other: 0 } },
  { floor: 3, room: 301, requests: { total: 8, electrical: 5, plumbing: 1, carpentry: 1, other: 1 } },
  { floor: 3, room: 302, requests: { total: 2, electrical: 0, plumbing: 0, carpentry: 2, other: 0 } },
  { floor: 3, room: 306, requests: { total: 1, electrical: 1, plumbing: 0, carpentry: 0, other: 0 } },
  { floor: 4, room: 404, requests: { total: 4, electrical: 1, plumbing: 3, carpentry: 0, other: 0 } },
  { floor: 4, room: 405, requests: { total: 1, electrical: 0, plumbing: 0, carpentry: 0, other: 1 } },
  { floor: 4, room: 407, requests: { total: 2, electrical: 2, plumbing: 0, carpentry: 0, other: 0 } },
  { floor: 5, room: 501, requests: { total: 1, electrical: 0, plumbing: 1, carpentry: 0, other: 0 } },
  { floor: 5, room: 509, requests: { total: 3, electrical: 1, plumbing: 1, carpentry: 1, other: 0 } },
  { floor: 5, room: 510, requests: { total: 5, electrical: 0, plumbing: 4, carpentry: 0, other: 1 } },
];


const FLOORS = [5, 4, 3, 2, 1];
const ROOMS_PER_FLOOR = 10;

const TechnicianHeatmap: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState(initialHeatmapData);
  const [lastUpdatedCell, setLastUpdatedCell] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number | undefined;
    
    const intervalId = setInterval(() => {
      const floorToUpdate = FLOORS[Math.floor(Math.random() * FLOORS.length)];
      const roomSuffixToUpdate = Math.floor(Math.random() * ROOMS_PER_FLOOR) + 1;
      const roomToUpdate = floorToUpdate * 100 + roomSuffixToUpdate;
      
      const categories: (keyof Omit<HeatmapDataPoint['requests'], 'total'>)[] = ['electrical', 'plumbing', 'carpentry', 'other'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      setHeatmapData(prevData => {
        const newData = [...prevData];
        const existingIndex = newData.findIndex(d => d.room === roomToUpdate);

        if (existingIndex > -1) {
          const existingPoint = newData[existingIndex];
          const newRequests = { ...existingPoint.requests };
          newRequests[randomCategory] += 1;
          newRequests.total += 1;
          newData[existingIndex] = { ...existingPoint, requests: newRequests };
        } else {
           const newRequests: HeatmapDataPoint['requests'] = { total: 1, electrical: 0, plumbing: 0, carpentry: 0, other: 0 };
           newRequests[randomCategory] = 1;
           newData.push({ floor: floorToUpdate, room: roomToUpdate, requests: newRequests });
        }
        return newData;
      });
      
      const updatedKey = `${floorToUpdate}-${roomSuffixToUpdate}`;
      setLastUpdatedCell(updatedKey);
      
      timeoutId = window.setTimeout(() => setLastUpdatedCell(null), 1500);

    }, 10000);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const getRequestCount = (floor: number, roomSuffix: number) => {
    const room = floor * 100 + roomSuffix;
    return heatmapData.find(d => d.room === room)?.requests.total || 0;
  };

  const getColor = (requests: number) => {
    if (requests === 0) return 'bg-base-200/50 dark:bg-neutral-800/50 hover:bg-base-300/70 dark:hover:bg-neutral-700/50';
    if (requests <= 2) return 'bg-green-400/40 hover:bg-green-400/60 border-green-500/30';
    if (requests <= 5) return 'bg-yellow-400/50 hover:bg-yellow-400/70 border-yellow-500/40';
    return 'bg-red-500/60 hover:bg-red-500/80 border-red-500/50';
  };
  
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Floor,Room,Total Requests,Electrical,Plumbing,Carpentry,Other\n";

    heatmapData
      .sort((a, b) => a.room - b.room)
      .forEach(item => {
        const { requests } = item;
        const row = `${item.floor},${item.room},${requests.total},${requests.electrical},${requests.plumbing},${requests.carpentry},${requests.other}`;
        csvContent += row + "\n";
      });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "heatmap_data_detailed.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h3 className="text-xl font-bold mb-2 text-primary dark:text-emerald-400">Repair Density Heatmap</h3>
        <p className="text-sm text-neutral-500 dark:text-base-300 mb-4">Live overview of service request frequency across hostel floors.</p>
        
        <div className="overflow-x-auto">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `auto repeat(${ROOMS_PER_FLOOR}, minmax(0, 1fr))`}}>
            {/* Header */}
            <div />
            {Array.from({ length: ROOMS_PER_FLOOR }, (_, i) => (
              <div key={`header-${i}`} className="text-center text-xs font-semibold text-neutral-500 dark:text-base-300">
                {String(i + 1).padStart(2, '0')}
              </div>
            ))}

            {/* Grid Body */}
            {FLOORS.map(floor => (
              <React.Fragment key={floor}>
                <div className="flex items-center justify-center font-bold text-sm text-neutral-600 dark:text-base-300">
                  F{floor}
                </div>
                {Array.from({ length: ROOMS_PER_FLOOR }, (_, i) => {
                  const roomSuffix = i + 1;
                  const requests = getRequestCount(floor, roomSuffix);
                  const cellKey = `${floor}-${roomSuffix}`;
                  const isUpdated = lastUpdatedCell === cellKey;

                  return (
                    <motion.div
                      key={cellKey}
                      title={`Room ${floor * 100 + roomSuffix}\nRequests: ${requests}`}
                      whileHover={{ scale: 1.1, zIndex: 10, boxShadow: '0 0 15px rgba(234, 88, 12, 0.6)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className={`w-full aspect-square rounded-md flex items-center justify-center cursor-pointer border transition-colors ${getColor(requests)} ${isUpdated ? 'animate-pulse-once' : ''}`}
                    >
                      <span className="text-xs font-bold text-neutral-800 dark:text-white select-none">
                        {requests > 0 ? requests : ''}
                      </span>
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-base-300">
                <span className="font-semibold">Legend:</span>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-400/40" /> Low</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-yellow-400/50" /> Med</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500/60" /> High</div>
            </div>
            <motion.button
              onClick={handleExportCSV}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-emerald-400 hover:text-primary-focus dark:hover:text-emerald-300"
            >
              <DownloadIcon />
              <span>Export CSV</span>
            </motion.button>
        </div>
      </motion.div>
    </Card>
  );
};

export default TechnicianHeatmap;