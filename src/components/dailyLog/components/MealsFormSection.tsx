
import React from 'react';
import { Input } from '@/components/ui/input';

interface MealsFormSectionProps {
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  onMealChange: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', value: string) => void;
}

const MealsFormSection = ({ meals, onMealChange }: MealsFormSectionProps) => {
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snacks', label: 'Snacks', icon: '🍎' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mealTypes.map(({ key, label, icon }) => (
        <div key={key} className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="text-base">{icon}</span>
            {label}
          </label>
          <Input
            value={meals[key as keyof typeof meals]}
            onChange={(e) => onMealChange(key as 'breakfast' | 'lunch' | 'dinner' | 'snacks', e.target.value)}
            placeholder={`What did you have for ${label.toLowerCase()}?`}
            className="h-9 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-white transition-all"
          />
        </div>
      ))}
    </div>
  );
};

export default MealsFormSection;
