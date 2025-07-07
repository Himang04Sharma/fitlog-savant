
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
    { 
      key: 'calories', 
      label: 'Calories', 
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/20', 
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    { 
      key: 'protein', 
      label: 'Protein', 
      bgColor: 'bg-green-50/50 dark:bg-green-950/20', 
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    { 
      key: 'carbs', 
      label: 'Carbs', 
      bgColor: 'bg-orange-50/50 dark:bg-orange-950/20', 
      textColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    { 
      key: 'fat', 
      label: 'Fat', 
      bgColor: 'bg-red-50/50 dark:bg-red-950/20', 
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ];

  return (
    <div className="mt-4 pt-4 border-t border-custom">
      <div className="grid grid-cols-4 gap-3">
        {summaryData.map(({ key, label, bgColor, textColor, borderColor }) => (
          <div key={key} className={`text-center p-3 ${bgColor} rounded-lg border ${borderColor} transition-all duration-200`}>
            <div className={`text-sm font-semibold ${textColor}`}>
              {Math.round(calculateProgress(macros[key as keyof typeof macros], macroTargets[key as keyof typeof macroTargets]))}%
            </div>
            <div className="text-xs text-secondary mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionSummary;
