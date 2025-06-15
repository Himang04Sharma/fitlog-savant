
import React, { useState } from 'react';
import { Apple } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MealsFormSection from './components/MealsFormSection';
import NutritionGoalsDialog from './components/NutritionGoalsDialog';
import MacroProgressSection from './components/MacroProgressSection';
import NutritionSummary from './components/NutritionSummary';

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
  
  // Default macro targets with ability to customize
  const [macroTargets, setMacroTargets] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  });

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

  return (
    <Card className="rounded-lg shadow-sm border border-custom bg-card">
      <CardHeader className="pb-4 border-b border-custom">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <Apple className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          Meals & Nutrition
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Meals Section - Compact Grid */}
        <MealsFormSection 
          meals={localMeals}
          onMealChange={handleMealChange}
        />

        {/* Daily Nutrition Progress */}
        <div className="space-y-4 pt-4 border-t border-custom">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
              📊 Daily Nutrition Progress
            </h4>
            
            <NutritionGoalsDialog
              macroTargets={macroTargets}
              onTargetsChange={setMacroTargets}
            />
          </div>
          
          <MacroProgressSection
            macros={localMacros}
            macroTargets={macroTargets}
            onMacroChange={handleMacroChange}
          />

          <NutritionSummary
            macros={localMacros}
            macroTargets={macroTargets}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MealsTableSection;
