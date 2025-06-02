
import React from 'react';

interface NutritionSummaryProps {
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
}

const NutritionSummary = ({ macros, macroTargets }: NutritionSummaryProps) => {
  const calculateProgress = (current: string, target: number) => {
    const currentValue = parseFloat(current) || 0;
    return Math.min((currentValue / target) * 100, 100);
  };

  const summaryData = [
    { key: 'calories', label: 'Calories', color: 'blue' },
    { key: 'protein', label: 'Protein', color: 'green' },
    { key: 'carbs', label: 'Carbs', color: 'orange' },
    { key: 'fat', label: 'Fat', color: 'red' }
  ];

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="grid grid-cols-4 gap-3">
        {summaryData.map(({ key, label, color }) => (
          <div key={key} className={`text-center p-2 bg-${color}-50 rounded-lg`}>
            <div className={`text-sm font-semibold text-${color}-600`}>
              {Math.round(calculateProgress(macros[key as keyof typeof macros], macroTargets[key as keyof typeof macroTargets]))}%
            </div>
            <div className="text-xs text-gray-600">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionSummary;
