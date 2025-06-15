
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
    { key: 'calories', label: 'Calories', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
    { key: 'protein', label: 'Protein', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-600 dark:text-green-400' },
    { key: 'carbs', label: 'Carbs', bgColor: 'bg-orange-50 dark:bg-orange-900/20', textColor: 'text-orange-600 dark:text-orange-400' },
    { key: 'fat', label: 'Fat', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-600 dark:text-red-400' }
  ];

  return (
    <div className="mt-4 pt-4 border-t border-custom">
      <div className="grid grid-cols-4 gap-3">
        {summaryData.map(({ key, label, bgColor, textColor }) => (
          <div key={key} className={`text-center p-2 ${bgColor} rounded-lg`}>
            <div className={`text-sm font-semibold ${textColor}`}>
              {Math.round(calculateProgress(macros[key as keyof typeof macros], macroTargets[key as keyof typeof macroTargets]))}%
            </div>
            <div className="text-xs text-secondary">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionSummary;
