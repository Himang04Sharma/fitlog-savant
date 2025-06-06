
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

interface CardioExercise {
  exercise: string;
  duration: string;
}

interface CardioExerciseRowProps {
  exercise: CardioExercise;
  onExerciseChange: (exercise: CardioExercise) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const durationOptions = ['15min', '30min', '45min', '60min', '90min'];

const CardioExerciseRow = ({ exercise, onExerciseChange, onRemove, canRemove }: CardioExerciseRowProps) => {
  const isMobile = useIsMobile();

  const handleExerciseNameChange = (value: string) => {
    onExerciseChange({ ...exercise, exercise: value });
  };

  const handleDurationChange = (value: string) => {
    onExerciseChange({ ...exercise, duration: value });
  };

  if (isMobile) {
    return (
      <div className="border border-gray-200 rounded-lg p-3 space-y-3 bg-white">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Cardio Exercise</span>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          <Input
            placeholder="e.g., Running, Cycling, Swimming"
            value={exercise.exercise}
            onChange={(e) => handleExerciseNameChange(e.target.value)}
            className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 bg-white"
          />
          
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Duration</label>
            <Select value={exercise.duration} onValueChange={handleDurationChange}>
              <SelectTrigger className="h-9 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300 bg-white text-sm">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg shadow-lg z-50">
                {durationOptions.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      <div className="col-span-6">
        <Input
          placeholder="e.g., Running, Cycling, Swimming"
          value={exercise.exercise}
          onChange={(e) => handleExerciseNameChange(e.target.value)}
          className="border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300"
        />
      </div>
      
      <div className="col-span-4">
        <Select value={exercise.duration} onValueChange={handleDurationChange}>
          <SelectTrigger className="border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-lg shadow-lg z-50">
            {durationOptions.map((duration) => (
              <SelectItem key={duration} value={duration}>
                {duration}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2 flex justify-end">
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardioExerciseRow;
