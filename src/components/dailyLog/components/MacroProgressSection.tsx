
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
  onMacroChange: (macroType: keyof typeof macros, value: string) => void;
}

const MacroProgressSection = ({ macros, macroTargets, onMacroChange }: MacroProgressSectionProps) => {
  const calculateProgress = (current: string, target: number) => {
    const currentValue = parseFloat(current) || 0;
    return Math.min((currentValue / target) * 100, 100);
  };

  const macroData = [
    { key: 'calories', label: 'Calories', color: 'blue', unit: '' },
    { key: 'protein', label: 'Protein (g)', color: 'green', unit: 'g' },
    { key: 'carbs', label: 'Carbs (g)', color: 'orange', unit: 'g' },
    { key: 'fat', label: 'Fat (g)', color: 'red', unit: 'g' }
  ];

  return (
    <div className="space-y-4">
      {macroData.map(({ key, label, color, unit }) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <Input
                type="number"
                value={macros[key as keyof typeof macros]}
                onChange={(e) => onMacroChange(key as keyof typeof macros, e.target.value)}
                placeholder="0"
                className="w-20 h-7 text-xs border-gray-200 rounded bg-white"
              />
            </div>
            <span className="text-sm text-gray-600">
              {macros[key as keyof typeof macros] || 0} / {macroTargets[key as keyof typeof macroTargets]}{unit}
            </span>
          </div>
          <div className="relative">
            <Progress value={calculateProgress(macros[key as keyof typeof macros], macroTargets[key as keyof typeof macroTargets])} className="h-2" />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full bg-${color}-500 transition-all`}
              style={{ width: `${calculateProgress(macros[key as keyof typeof macros], macroTargets[key as keyof typeof macroTargets])}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MacroProgressSection;
