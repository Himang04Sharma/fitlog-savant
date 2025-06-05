
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Exercise {
  sets: string;
  reps: string;
  exercise: string;
  weight: string;
}

interface MuscleGroupWorkoutSectionProps {
  muscleGroup: string;
  exercises: Exercise[];
  onExercisesChange: (exercises: Exercise[]) => void;
}

const MuscleGroupWorkoutSection = ({ 
  muscleGroup, 
  exercises, 
  onExercisesChange 
}: MuscleGroupWorkoutSectionProps) => {
  const setsOptions = ['1', '2', '3', '4', '5'];
  const repsOptions = ['8-10', '10-12', '12-15'];

  const addExercise = () => {
    const newExercise = { sets: '', reps: '', exercise: '', weight: '' };
    onExercisesChange([...exercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    onExercisesChange(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === index ? { ...exercise, [field]: value } : exercise
    );
    onExercisesChange(updatedExercises);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
        {muscleGroup} Workouts
      </h3>

      {exercises.length > 0 && (
        <div className="grid gap-3 text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded-lg" 
             style={{ gridTemplateColumns: '60px 80px 1fr 80px 40px' }}>
          <div>Sets</div>
          <div>Reps</div>
          <div>Exercise</div>
          <div>Weight</div>
          <div></div>
        </div>
      )}

      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <div key={index} className="grid gap-3 items-center" 
               style={{ gridTemplateColumns: '60px 80px 1fr 80px 40px' }}>
            <Select 
              value={exercise.sets} 
              onValueChange={(value) => updateExercise(index, 'sets', value)}
            >
              <SelectTrigger className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
                <SelectValue placeholder="Sets" />
              </SelectTrigger>
              <SelectContent className="rounded-lg bg-white">
                {setsOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={exercise.reps} 
              onValueChange={(value) => updateExercise(index, 'reps', value)}
            >
              <SelectTrigger className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
                <SelectValue placeholder="Reps" />
              </SelectTrigger>
              <SelectContent className="rounded-lg bg-white">
                {repsOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              value={exercise.exercise}
              onChange={(e) => updateExercise(index, 'exercise', e.target.value)}
              placeholder="Exercise name"
              className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white"
            />

            <Input
              value={exercise.weight}
              onChange={(e) => updateExercise(index, 'weight', e.target.value)}
              placeholder="Weight"
              type="number"
              className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white"
            />

            <div className="flex justify-center">
              <Button
                onClick={() => removeExercise(index)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button
          onClick={addExercise}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Exercise
        </Button>
      </div>
    </div>
  );
};

export default MuscleGroupWorkoutSection;
