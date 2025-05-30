
import React, { useState } from 'react';
import { Apple } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MealsTableSectionProps {
  meals?: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  macros?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  onMealsChange?: (meals: any) => void;
  onMacrosChange?: (macros: any) => void;
}

const MealsTableSection = ({ 
  meals = { breakfast: '', lunch: '', dinner: '', snacks: '' },
  macros = { calories: '', protein: '', carbs: '', fat: '' },
  onMealsChange,
  onMacrosChange 
}: MealsTableSectionProps) => {
  const [localMeals, setLocalMeals] = useState(meals);
  const [localMacros, setLocalMacros] = useState(macros);

  const handleMealChange = (mealType: keyof typeof localMeals, value: string) => {
    const updatedMeals = { ...localMeals, [mealType]: value };
    setLocalMeals(updatedMeals);
    onMealsChange?.(updatedMeals);
  };

  const handleMacroChange = (macroType: keyof typeof localMacros, value: string) => {
    const updatedMacros = { ...localMacros, [macroType]: value };
    setLocalMacros(updatedMacros);
    onMacrosChange?.(updatedMacros);
  };

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snacks', label: 'Snacks', icon: '🍎' }
  ];

  const macroTypes = [
    { key: 'calories', label: 'Calories', unit: '' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' }
  ];

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-orange-50 to-amber-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Apple className="w-6 h-6 text-orange-600" />
          Meals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meals Section */}
        <div className="space-y-4">
          {mealTypes.map(({ key, label, icon }) => (
            <div key={key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="text-lg">{icon}</span>
                {label}
              </label>
              <Input
                value={localMeals[key as keyof typeof localMeals]}
                onChange={(e) => handleMealChange(key as keyof typeof localMeals, e.target.value)}
                placeholder={`What did you have for ${label.toLowerCase()}?`}
                className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-orange-300 transition-all h-12"
              />
            </div>
          ))}
        </div>

        {/* Macros Section */}
        <div className="space-y-4 pt-4 border-t border-orange-200">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📊 Macros
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {macroTypes.map(({ key, label, unit }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {label} {unit && `(${unit})`}
                </label>
                <Input
                  type="number"
                  value={localMacros[key as keyof typeof localMacros]}
                  onChange={(e) => handleMacroChange(key as keyof typeof localMacros, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-orange-300 transition-all h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealsTableSection;
