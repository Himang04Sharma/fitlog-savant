
import React, { useState } from 'react';
import { Apple } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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

  // Macro targets and calculations
  const macroTargets = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  };

  const macroColors = {
    calories: 'bg-blue-500',
    protein: 'bg-green-500',
    carbs: 'bg-orange-500',
    fat: 'bg-red-500'
  };

  const calculateProgress = (current: string, target: number) => {
    const currentValue = parseFloat(current) || 0;
    return Math.min((currentValue / target) * 100, 100);
  };

  return (
    <Card className="rounded-lg shadow-sm border border-gray-100 bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Apple className="w-5 h-5 text-orange-600" />
          </div>
          Meals & Nutrition
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Meals Section - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealTypes.map(({ key, label, icon }) => (
            <div key={key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="text-base">{icon}</span>
                {label}
              </label>
              <Input
                value={localMeals[key as keyof typeof localMeals]}
                onChange={(e) => handleMealChange(key as keyof typeof localMeals, e.target.value)}
                placeholder={`What did you have for ${label.toLowerCase()}?`}
                className="h-9 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-white transition-all"
              />
            </div>
          ))}
        </div>

        {/* Macros Progress Section */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            📊 Daily Nutrition Progress
          </h4>
          
          <div className="space-y-4">
            {/* Calories */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Calories</label>
                  <Input
                    type="number"
                    value={localMacros.calories}
                    onChange={(e) => handleMacroChange('calories', e.target.value)}
                    placeholder="0"
                    className="w-20 h-7 text-xs border-gray-200 rounded bg-white"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {localMacros.calories || 0} / {macroTargets.calories}
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={calculateProgress(localMacros.calories, macroTargets.calories)} 
                  className="h-2"
                />
                <div 
                  className="absolute top-0 left-0 h-2 rounded-full bg-blue-500 transition-all"
                  style={{ width: `${calculateProgress(localMacros.calories, macroTargets.calories)}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Protein (g)</label>
                  <Input
                    type="number"
                    value={localMacros.protein}
                    onChange={(e) => handleMacroChange('protein', e.target.value)}
                    placeholder="0"
                    className="w-20 h-7 text-xs border-gray-200 rounded bg-white"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {localMacros.protein || 0} / {macroTargets.protein}g
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={calculateProgress(localMacros.protein, macroTargets.protein)} 
                  className="h-2"
                />
                <div 
                  className="absolute top-0 left-0 h-2 rounded-full bg-green-500 transition-all"
                  style={{ width: `${calculateProgress(localMacros.protein, macroTargets.protein)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Carbs (g)</label>
                  <Input
                    type="number"
                    value={localMacros.carbs}
                    onChange={(e) => handleMacroChange('carbs', e.target.value)}
                    placeholder="0"
                    className="w-20 h-7 text-xs border-gray-200 rounded bg-white"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {localMacros.carbs || 0} / {macroTargets.carbs}g
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={calculateProgress(localMacros.carbs, macroTargets.carbs)} 
                  className="h-2"
                />
                <div 
                  className="absolute top-0 left-0 h-2 rounded-full bg-orange-500 transition-all"
                  style={{ width: `${calculateProgress(localMacros.carbs, macroTargets.carbs)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Fat (g)</label>
                  <Input
                    type="number"
                    value={localMacros.fat}
                    onChange={(e) => handleMacroChange('fat', e.target.value)}
                    placeholder="0"
                    className="w-20 h-7 text-xs border-gray-200 rounded bg-white"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {localMacros.fat || 0} / {macroTargets.fat}g
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={calculateProgress(localMacros.fat, macroTargets.fat)} 
                  className="h-2"
                />
                <div 
                  className="absolute top-0 left-0 h-2 rounded-full bg-red-500 transition-all"
                  style={{ width: `${calculateProgress(localMacros.fat, macroTargets.fat)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-sm font-semibold text-blue-600">
                  {Math.round(calculateProgress(localMacros.calories, macroTargets.calories))}%
                </div>
                <div className="text-xs text-gray-600">Calories</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-sm font-semibold text-green-600">
                  {Math.round(calculateProgress(localMacros.protein, macroTargets.protein))}%
                </div>
                <div className="text-xs text-gray-600">Protein</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <div className="text-sm font-semibold text-orange-600">
                  {Math.round(calculateProgress(localMacros.carbs, macroTargets.carbs))}%
                </div>
                <div className="text-xs text-gray-600">Carbs</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <div className="text-sm font-semibold text-red-600">
                  {Math.round(calculateProgress(localMacros.fat, macroTargets.fat))}%
                </div>
                <div className="text-xs text-gray-600">Fat</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealsTableSection;
