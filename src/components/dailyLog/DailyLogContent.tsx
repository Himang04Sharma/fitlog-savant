
import React from 'react';
import DailyGoalsSection from './DailyGoalsSection';
import MealsTableSection from './MealsTableSection';
import WorkoutTrackerSection from './WorkoutTrackerSection';

interface DailyLogContentProps {
  loading: boolean;
  exercises: any[];
  meals: any[];
  onSaveData: () => void;
  onDeleteExercise: (id: string) => void;
  onAddExercise: (exercise: any) => void;
  onUpdateExercise: (exercise: any) => void;
  onDeleteMeal: (id: string) => void;
  onAddMeal: (meal: any) => void;
  onUpdateMeal: (meal: any) => void;
}

const DailyLogContent: React.FC<DailyLogContentProps> = ({
  loading
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse text-muted-foreground">Loading your fitness data...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 min-h-[600px]">
      {/* Left Half - Daily Goals + Meals */}
      <div className="space-y-6">
        <DailyGoalsSection />
        <MealsTableSection />
      </div>
      
      {/* Right Half - Workout Tracker */}
      <div className="space-y-6">
        <WorkoutTrackerSection />
      </div>
    </div>
  );
};

export default DailyLogContent;
