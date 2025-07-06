
import React from 'react';
import { Footprints } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StepsTrackerProps {
  steps: string;
  onStepsChange: (value: string) => void;
}

const StepsTracker = ({ steps, onStepsChange }: StepsTrackerProps) => {
  const stepsCount = parseInt(steps) || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
            <Footprints className="w-5 h-5 text-white" />
          </div>
          <label className="text-lg font-semibold text-primary">Steps Today</label>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stepsCount.toLocaleString()}</div>
          <div className="text-sm text-secondary">steps</div>
        </div>
      </div>
      
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-custom">
        <Input
          type="number"
          value={steps}
          onChange={(e) => onStepsChange(e.target.value)}
          placeholder="Enter today's step count"
          className="border-0 bg-card rounded-lg focus:ring-2 focus:ring-purple-400 transition-all h-12 text-center text-lg font-semibold text-primary placeholder:text-secondary"
        />
        <div className="mt-3 text-center">
          <div className="text-sm text-secondary">
            Goal: 10,000 steps • 
            <span className={`ml-1 font-semibold ${
              stepsCount >= 10000 ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
            }`}>
              {stepsCount >= 10000 ? 'Goal Achieved! 🎉' : `${10000 - stepsCount} more to go`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsTracker;
