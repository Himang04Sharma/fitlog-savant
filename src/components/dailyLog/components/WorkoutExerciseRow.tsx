
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const setsOptions = ['1', '2', '3', '4', '5'];
  const repsOptions = ['8-10', '10-12', '12-15'];

  if (isMobile) {
    return (
      <div className="border border-custom rounded-lg p-3 space-y-3 bg-card">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary">Exercise {index + 1}</span>
          {canDelete && (
            <Button
              onClick={() => onRemoveRow(index)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          <Input
            value={workout.exercise}
            onChange={(e) => onWorkoutChange(index, 'exercise', e.target.value)}
            placeholder="Exercise name"
            className="h-10 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-primary"
          />
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-secondary mb-1 block">Sets</label>
              <Select 
                value={workout.sets} 
                onValueChange={(value) => onWorkoutChange(index, 'sets', value)}
              >
                <SelectTrigger className="h-9 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-sm text-primary">
                  <SelectValue placeholder="Sets" />
                </SelectTrigger>
                <SelectContent className="rounded-lg bg-card border-custom z-50">
                  {setsOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-primary hover:bg-hover-bg">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-secondary mb-1 block">Reps</label>
              <Select 
                value={workout.reps} 
                onValueChange={(value) => onWorkoutChange(index, 'reps', value)}
              >
                <SelectTrigger className="h-9 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-sm text-primary">
                  <SelectValue placeholder="Reps" />
                </SelectTrigger>
                <SelectContent className="rounded-lg bg-card border-custom z-50">
                  {repsOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-primary hover:bg-hover-bg">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-secondary mb-1 block">Weight</label>
              <Input
                value={workout.weight}
                onChange={(e) => onWorkoutChange(index, 'weight', e.target.value)}
                placeholder="lbs"
                className="h-9 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-sm text-primary"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '50px 90px 1fr 60px 30px' }}>
      <Select 
        value={workout.sets} 
        onValueChange={(value) => onWorkoutChange(index, 'sets', value)}
      >
        <SelectTrigger className="h-10 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-primary">
          <SelectValue placeholder="Sets" />
        </SelectTrigger>
        <SelectContent className="rounded-lg bg-card border-custom z-50">
          {setsOptions.map((option) => (
            <SelectItem key={option} value={option} className="text-primary hover:bg-hover-bg">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={workout.reps} 
        onValueChange={(value) => onWorkoutChange(index, 'reps', value)}
      >
        <SelectTrigger className="h-10 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-primary">
          <SelectValue placeholder="Reps" />
        </SelectTrigger>
        <SelectContent className="rounded-lg bg-card border-custom z-50">
          {repsOptions.map((option) => (
            <SelectItem key={option} value={option} className="text-primary hover:bg-hover-bg">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        value={workout.exercise}
        onChange={(e) => onWorkoutChange(index, 'exercise', e.target.value)}
        placeholder="Exercise name"
        className="h-10 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-primary"
      />

      <Input
        value={workout.weight}
        onChange={(e) => onWorkoutChange(index, 'weight', e.target.value)}
        placeholder="Weight"
        className="h-10 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-primary"
      />

      <div className="flex justify-center">
        {canDelete && (
          <Button
            onClick={() => onRemoveRow(index)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkoutExerciseRow;
