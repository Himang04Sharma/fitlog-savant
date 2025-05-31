
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
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <label className="text-lg font-semibold text-gray-800">Weight Today</label>
        </div>
        <div className="text-right flex items-center gap-2">
          <div className="text-2xl font-bold text-amber-600">{weightValue || '--'}</div>
          <div className="text-sm text-gray-600">kg</div>
          {weightValue > 0 && (
            <div className="flex items-center">
              <TrendingDown className="w-4 h-4 text-green-500" />
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4">
        <Input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          placeholder="Enter your weight in kg"
          className="border-0 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-amber-300 transition-all h-12 text-center text-lg font-semibold"
        />
        <div className="mt-3 text-center text-sm text-gray-600">
          Track your progress over time
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
