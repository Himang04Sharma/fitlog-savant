
import React from 'react';
import { Scale, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WeightTrackerProps {
  weight: string;
  onWeightChange: (value: string) => void;
}

const WeightTracker = ({ weight, onWeightChange }: WeightTrackerProps) => {
  const weightValue = parseFloat(weight) || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <label className="text-lg font-semibold text-primary">Weight Today</label>
        </div>
        <div className="text-right flex items-center gap-2">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{weightValue || '--'}</div>
          <div className="text-sm text-secondary">kg</div>
          {weightValue > 0 && (
            <div className="flex items-center">
              <TrendingDown className="w-4 h-4 text-green-500" />
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-card border border-custom rounded-lg p-4 transition-all duration-200">
        <Input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          placeholder="Enter your weight in kg"
          className="border-0 bg-secondary/20 rounded-lg focus:ring-2 focus:ring-amber-400 transition-all h-12 text-center text-lg font-semibold text-primary placeholder:text-secondary"
        />
        <div className="mt-3 text-center text-sm text-secondary">
          Track your progress over time
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
