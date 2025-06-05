
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkoutExerciseRow from './WorkoutExerciseRow';
import CardioExerciseRow from './CardioExerciseRow';

interface Exercise {
  sets: string;
  reps: string;
  exercise: string;
  weight: string;
}

interface CardioExercise {
  exercise: string;
  duration: string;
}

interface MuscleGroupWorkoutSectionProps {
  muscleGroup: string;
  exercises: Exercise[];
  onExercisesChange: (exercises: Exercise[]) => void;
}

const MuscleGroupWorkoutSection = ({ muscleGroup, exercises, onExercisesChange }: MuscleGroupWorkoutSectionProps) => {
  const isCardio = muscleGroup === 'Cardio';

  const addExercise = () => {
    const newExercise = isCardio 
      ? { exercise: '', duration: '', sets: '', reps: '', weight: '' }
      : { sets: '', reps: '', exercise: '', weight: '' };
    onExercisesChange([...exercises, newExercise]);
  };

  const updateExercise = (index: number, updatedExercise: Exercise) => {
    const newExercises = [...exercises];
    newExercises[index] = updatedExercise;
    onExercisesChange(newExercises);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      const newExercises = exercises.filter((_, i) => i !== index);
      onExercisesChange(newExercises);
    }
  };

  const handleCardioExerciseChange = (index: number, cardioExercise: CardioExercise) => {
    const updatedExercise: Exercise = {
      exercise: cardioExercise.exercise,
      sets: '', // Not used for cardio
      reps: cardioExercise.duration, // Store duration in reps field
      weight: '' // Not used for cardio
    };
    updateExercise(index, updatedExercise);
  };

  return (
    <Card className="rounded-lg shadow-sm border border-gray-100 bg-white">
      <CardHeader className="pb-3 border-b border-gray-100">
        <CardTitle className="text-md font-semibold text-gray-800">
          {muscleGroup} {isCardio ? 'Workouts' : 'Exercises'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        {isCardio ? (
          <>
            <div className="grid grid-cols-12 gap-3 items-center text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-6">Exercise</div>
              <div className="col-span-4">Duration</div>
              <div className="col-span-2"></div>
            </div>
            
            {exercises.map((exercise, index) => (
              <CardioExerciseRow
                key={index}
                exercise={{
                  exercise: exercise.exercise,
                  duration: exercise.reps // Duration stored in reps field
                }}
                onExerciseChange={(cardioExercise) => handleCardioExerciseChange(index, cardioExercise)}
                onRemove={() => removeExercise(index)}
                canRemove={exercises.length > 1}
              />
            ))}
          </>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-3 items-center text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-2">Sets</div>
              <div className="col-span-2">Reps</div>
              <div className="col-span-5">Exercise</div>
              <div className="col-span-2">Weight</div>
              <div className="col-span-1"></div>
            </div>
            
            {exercises.map((exercise, index) => (
              <WorkoutExerciseRow
                key={index}
                exercise={exercise}
                onExerciseChange={(updatedExercise) => updateExercise(index, updatedExercise)}
                onRemove={() => removeExercise(index)}
                canRemove={exercises.length > 1}
              />
            ))}
          </>
        )}

        <Button
          variant="outline"
          onClick={addExercise}
          className="w-full mt-3 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {isCardio ? 'Cardio Exercise' : 'Exercise'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MuscleGroupWorkoutSection;
