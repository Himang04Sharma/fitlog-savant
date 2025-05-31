
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
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <Footprints className="w-5 h-5 text-white" />
          </div>
          <label className="text-lg font-semibold text-gray-800">Steps Today</label>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{stepsCount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">steps</div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
        <Input
          type="number"
          value={steps}
          onChange={(e) => onStepsChange(e.target.value)}
          placeholder="Enter today's step count"
          className="border-0 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-300 transition-all h-12 text-center text-lg font-semibold"
        />
        <div className="mt-3 text-center">
          <div className="text-sm text-gray-600">
            Goal: 10,000 steps • 
            <span className={`ml-1 font-semibold ${
              stepsCount >= 10000 ? 'text-green-600' : 'text-purple-600'
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
