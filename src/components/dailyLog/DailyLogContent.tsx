
import React from 'react';
import ExerciseSection from "./ExerciseSection";
import MealSection from "./MealSection";
import { Exercise } from "./ExerciseSection";
import { Meal } from "./MealSection";

interface DailyLogContentProps {
  loading: boolean;
  exercises: Exercise[];
  meals: Meal[];
  onSaveData: () => void;
  onDeleteExercise: (id: string) => void;
  onAddExercise: (exercise: Exercise) => void;
  onUpdateExercise: (exercise: Exercise) => void;
  onDeleteMeal: (id: string) => void;
  onAddMeal: (meal: Meal) => void;
  onUpdateMeal: (meal: Meal) => void;
}

const DailyLogContent: React.FC<DailyLogContentProps> = ({
  loading,
  exercises,
  meals,
  onSaveData,
  onDeleteExercise,
  onAddExercise,
  onUpdateExercise,
  onDeleteMeal,
  onAddMeal,
  onUpdateMeal
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse text-muted-foreground">Loading your fitness data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <ExerciseSection
        exercises={exercises}
        onSave={onSaveData}
        onDelete={onDeleteExercise}
        onAdd={onAddExercise}
        onUpdate={onUpdateExercise}
      />
      
      <MealSection
        meals={meals}
        onSave={onSaveData}
        onDelete={onDeleteMeal}
        onAdd={onAddMeal}
        onUpdate={onUpdateMeal}
      />
    </div>
  );
};

export default DailyLogContent;
