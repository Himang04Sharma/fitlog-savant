
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

  const handleMealChange = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', value: string) => {
    // Allow any text input for meal descriptions - no numeric validation needed
    onMealChange(mealType, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mealTypes.map(({ key, label, icon }) => (
        <div key={key} className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-primary">
            <span className="text-base">{icon}</span>
            {label}
          </label>
          <Input
            value={meals[key as keyof typeof meals]}
            onChange={(e) => handleMealChange(key as 'breakfast' | 'lunch' | 'dinner' | 'snacks', e.target.value)}
            placeholder={`What did you have for ${label.toLowerCase()}?`}
            className="h-9 bg-card border-custom rounded-lg focus:ring-2 focus:ring-accent-green text-primary placeholder:text-secondary transition-all duration-200"
          />
        </div>
      ))}
    </div>
  );
};

export default MealsFormSection;
