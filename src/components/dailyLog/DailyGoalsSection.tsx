
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
    setCompletedGoals(prev => {
      // Preserve existing completion state and add false for new goals
      const newCompleted = [...prev];
      while (newCompleted.length < goals.length) {
        newCompleted.push(false);
      }
      // Trim if we have more completion states than goals
      return newCompleted.slice(0, goals.length);
    });
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

  // Calculate completion percentage for all goals with content
  const activeGoalsCount = goals.filter(goal => goal.trim() !== '').length;
  const completedCount = completedGoals.filter((completed, index) => 
    completed && goals[index] && goals[index].trim() !== ''
  ).length;
  const completionRate = activeGoalsCount > 0 ? (completedCount / activeGoalsCount) * 100 : 0;

  return (
    <Card className="rounded-lg shadow-sm border-custom bg-card transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-6 border-b border-custom">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-primary">
            <div className="p-2 bg-accent-green rounded-lg shadow-sm">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-primary">Today's Goals</span>
              <div className="text-sm font-normal text-secondary mt-1">
                {completedCount} of {activeGoalsCount} completed
              </div>
            </div>
          </CardTitle>
          
          <ProgressRing percentage={completionRate} />
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
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
        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-custom">
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
