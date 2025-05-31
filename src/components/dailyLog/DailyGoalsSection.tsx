
import React from 'react';
import { Target, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyGoalsSectionProps {
  goals?: string[];
  waterIntake?: string;
  steps?: string;
  weight?: string;
  onGoalsChange?: (goals: string[]) => void;
  onWaterIntakeChange?: (value: string) => void;
  onStepsChange?: (value: string) => void;
  onWeightChange?: (value: string) => void;
}

const DailyGoalsSection = ({
  goals = [''],
  waterIntake = '',
  steps = '',
  weight = '',
  onGoalsChange,
  onWaterIntakeChange,
  onStepsChange,
  onWeightChange
}: DailyGoalsSectionProps) => {

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    onGoalsChange?.(newGoals);
  };

  const addGoal = () => {
    onGoalsChange?.([...goals, '']);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      const newGoals = goals.filter((_, i) => i !== index);
      onGoalsChange?.(newGoals);
    }
  };

  const handleDropletClick = (index: number) => {
    const currentWater = parseInt(waterIntake) || 0;
    const newWater = currentWater === index + 1 ? index : index + 1;
    onWaterIntakeChange?.(newWater.toString());
  };

  const currentWaterCount = parseInt(waterIntake) || 0;

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Target className="w-6 h-6 text-green-600" />
          Today's Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goals Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Daily Goals</label>
          {goals.map((goal, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                placeholder={`Goal ${index + 1}`}
                className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-green-300 transition-all h-12"
              />
              {goals.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(index)}
                  className="h-12 w-12 rounded-xl hover:bg-red-100"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={addGoal}
            className="w-full h-12 rounded-xl border-2 border-dashed border-green-300 hover:bg-green-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-green-200">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">💧 Water Intake</label>
            <div className="flex gap-2 justify-center">
              {Array.from({ length: 8 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleDropletClick(index)}
                  className={`text-2xl transition-all duration-200 hover:scale-110 ${
                    index < currentWaterCount ? 'text-blue-500' : 'text-gray-300'
                  }`}
                >
                  💧
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              {currentWaterCount} / 8 glasses
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">👟 Steps Today</label>
            <Input
              type="number"
              value={steps}
              onChange={(e) => onStepsChange?.(e.target.value)}
              placeholder="Number of steps"
              className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-green-300 transition-all h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">⚖️ Weight Today (kg)</label>
            <Input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => onWeightChange?.(e.target.value)}
              placeholder="Weight in kg"
              className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-green-300 transition-all h-12"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalsSection;
