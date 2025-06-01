
import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressRing from './components/ProgressRing';
import GoalsList from './components/GoalsList';
import WaterIntakeTracker from './components/WaterIntakeTracker';
import StepsTracker from './components/StepsTracker';
import WeightTracker from './components/WeightTracker';

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
  const [completedGoals, setCompletedGoals] = useState<boolean[]>(goals.map(() => false));

  // Reset completed goals when goals change from parent
  useEffect(() => {
    setCompletedGoals(goals.map(() => false));
  }, [goals.length]);

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    onGoalsChange?.(newGoals);
  };

  const toggleGoalCompletion = (index: number) => {
    const newCompleted = [...completedGoals];
    newCompleted[index] = !newCompleted[index];
    setCompletedGoals(newCompleted);

    // If goal is being completed, remove it after a short delay for visual feedback
    if (!newCompleted[index] === false) { // Goal is being marked as completed
      setTimeout(() => {
        removeGoal(index);
      }, 500); // Give time for the animation to show
    }
  };

  const addGoal = () => {
    onGoalsChange?.([...goals, '']);
    setCompletedGoals([...completedGoals, false]);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      const newGoals = goals.filter((_, i) => i !== index);
      const newCompleted = completedGoals.filter((_, i) => i !== index);
      onGoalsChange?.(newGoals);
      setCompletedGoals(newCompleted);
    }
  };

  // Calculate completion percentage for remaining goals
  const completionRate = goals.length > 0 ? (completedGoals.filter(Boolean).length / goals.length) * 100 : 0;

  return (
    <Card className="rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-3xl group">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
      
      <CardHeader className="pb-6 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Today's Goals
              </span>
              <div className="text-sm font-normal text-gray-600 mt-1">
                {completedGoals.filter(Boolean).length} of {goals.length} completed
              </div>
            </div>
          </CardTitle>
          
          <ProgressRing percentage={completionRate} />
        </div>
      </CardHeader>

      <CardContent className="space-y-8 relative z-10 p-8">
        {/* Goals Section */}
        <GoalsList
          goals={goals}
          completedGoals={completedGoals}
          onGoalChange={handleGoalChange}
          onToggleCompletion={toggleGoalCompletion}
          onAddGoal={addGoal}
          onRemoveGoal={removeGoal}
        />

        {/* Metrics Section */}
        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-emerald-200/50">
          <WaterIntakeTracker
            waterIntake={waterIntake}
            onWaterIntakeChange={onWaterIntakeChange}
          />

          <StepsTracker
            steps={steps}
            onStepsChange={onStepsChange}
          />

          <WeightTracker
            weight={weight}
            onWeightChange={onWeightChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalsSection;
