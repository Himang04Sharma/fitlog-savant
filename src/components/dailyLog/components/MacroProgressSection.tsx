
import React from 'react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface MacroProgressSectionProps {
  macros: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  macroTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  onMacroChange: (macroType: 'calories' | 'protein' | 'carbs' | 'fat', value: string) => void;
}

const MacroProgressSection = ({ macros, macroTargets, onMacroChange }: MacroProgressSectionProps) => {
  const calculateProgress = (current: string, target: number) => {
    const currentValue = parseFloat(current) || 0;
    return Math.min((currentValue / target) * 100, 100);
  };

  const handleMacroChange = (macroType: 'calories' | 'protein' | 'carbs' | 'fat', value: string) => {
    // Prevent negative values
    const numericValue = parseFloat(value);
    if (value !== '' && (isNaN(numericValue) || numericValue < 0)) {
      return; // Don't update if value is negative or invalid
    }
    onMacroChange(macroType, value);
  };

  const macroData = [
    { 
      key: 'calories', 
      label: 'Calories', 
      color: 'from-blue-500 to-blue-600', 
      unit: '',
      bgColor: 'bg-blue-500'
    },
    { 
      key: 'protein', 
      label: 'Protein (g)', 
      color: 'from-green-500 to-green-600', 
      unit: 'g',
      bgColor: 'bg-green-500'
    },
    { 
      key: 'carbs', 
      label: 'Carbs (g)', 
      color: 'from-orange-500 to-orange-600', 
      unit: 'g',
      bgColor: 'bg-orange-500'
    },
    { 
      key: 'fat', 
      label: 'Fat (g)', 
      color: 'from-red-500 to-red-600', 
      unit: 'g',
      bgColor: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-4">
      {macroData.map(({ key, label, color, unit, bgColor }) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-primary">{label}</label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={macros[key as keyof typeof macros]}
                onChange={(e) => handleMacroChange(key as 'calories' | 'protein' | 'carbs' | 'fat', e.target.value)}
                placeholder="0"
                className="w-20 h-7 text-xs bg-card border-custom rounded text-primary placeholder:text-secondary focus:ring-2 focus:ring-accent-green transition-all duration-200"
              />
            </div>
            <span className="text-sm text-secondary">
              {macros[key as keyof typeof macros] || 0} / {macroTargets[key as keyof typeof macroTargets]}{unit}
            </span>
          </div>
          <div className="relative">
            <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
              <div 
                className={`h-full ${bgColor} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${calculateProgress(macros[key as keyof typeof macros], macroTargets[key as keyof typeof macroTargets])}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MacroProgressSection;
