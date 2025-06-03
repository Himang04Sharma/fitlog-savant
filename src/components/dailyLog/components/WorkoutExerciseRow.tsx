
import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkoutExerciseRowProps {
  workout: {
    muscleGroup: string;
    sets: string;
    reps: string;
    exercise: string;
    weight: string;
  };
  index: number;
  canDelete: boolean;
  onWorkoutChange: (index: number, field: string, value: string) => void;
  onRemoveRow: (index: number) => void;
}

const WorkoutExerciseRow = ({
  workout,
  index,
  canDelete,
  onWorkoutChange,
  onRemoveRow
}: WorkoutExerciseRowProps) => {
  const setsOptions = ['1', '2', '3', '4', '5'];
  const repsOptions = ['8-10', '10-12', '12-15'];

  return (
    <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '50px 90px 1fr 60px 30px' }}>
      <Select 
        value={workout.sets} 
        onValueChange={(value) => onWorkoutChange(index, 'sets', value)}
      >
        <SelectTrigger className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
          <SelectValue placeholder="Sets" />
        </SelectTrigger>
        <SelectContent className="rounded-lg bg-white z-50">
          {setsOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={workout.reps} 
        onValueChange={(value) => onWorkoutChange(index, 'reps', value)}
      >
        <SelectTrigger className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
          <SelectValue placeholder="Reps" />
        </SelectTrigger>
        <SelectContent className="rounded-lg bg-white z-50">
          {repsOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        value={workout.exercise}
        onChange={(e) => onWorkoutChange(index, 'exercise', e.target.value)}
        placeholder="Exercise name"
        className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white"
      />

      <Input
        value={workout.weight}
        onChange={(e) => onWorkoutChange(index, 'weight', e.target.value)}
        placeholder="Weight"
        className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white"
      />

      <div className="flex justify-center">
        {canDelete && (
          <Button
            onClick={() => onRemoveRow(index)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkoutExerciseRow;
