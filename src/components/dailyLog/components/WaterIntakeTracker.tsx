
import React, { useState } from 'react';
import { Droplet } from 'lucide-react';

interface WaterIntakeTrackerProps {
  waterIntake: string;
  onWaterIntakeChange: (value: string) => void;
}

const WaterIntakeTracker = ({ waterIntake, onWaterIntakeChange }: WaterIntakeTrackerProps) => {
  const [animatingWater, setAnimatingWater] = useState<number | null>(null);
  
  const currentWaterCount = parseInt(waterIntake) || 0;
  const waterPercentage = (currentWaterCount / 8) * 100;

  const handleDropletClick = (index: number) => {
    const newWater = currentWaterCount === index + 1 ? index : index + 1;
    onWaterIntakeChange(newWater.toString());
    setAnimatingWater(index);
    setTimeout(() => setAnimatingWater(null), 300);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
            <Droplet className="w-5 h-5 text-white" />
          </div>
          <label className="text-lg font-semibold text-primary">Water Intake</label>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentWaterCount}/8</div>
          <div className="text-sm text-secondary">glasses</div>
        </div>
      </div>
      
      {/* Water Progress Container */}
      <div className="relative bg-card border border-custom rounded-lg p-6 overflow-hidden transition-all duration-200">
        {/* Animated Progress Background */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-400/20 dark:bg-blue-500/20 transition-all duration-1000 ease-out rounded-lg"
          style={{ height: `${waterPercentage}%` }}
        />
        
        {/* Droplet Icons */}
        <div className="relative z-10 flex gap-3 justify-center">
          {Array.from({ length: 8 }, (_, index) => (
            <button
              key={index}
              onClick={() => handleDropletClick(index)}
              className={`transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded ${
                animatingWater === index ? 'animate-bounce' : ''
              }`}
            >
              <Droplet 
                className={`w-7 h-7 transition-colors duration-300 ${
                  index < currentWaterCount 
                    ? 'text-blue-500 fill-blue-500 drop-shadow-sm' 
                    : 'text-secondary hover:text-blue-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-secondary">
          <span className={`${waterPercentage >= 100 ? 'text-green-600 dark:text-green-400 font-bold' : 'text-blue-600 dark:text-blue-400'}`}>
            {Math.round(waterPercentage)}% of daily target
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaterIntakeTracker;
