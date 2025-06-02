
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkoutMuscleGroupSelectorProps {
  muscleGroup1: string;
  muscleGroup2: string;
  muscleGroup3: string;
  onMuscleGroup1Change: (value: string) => void;
  onMuscleGroup2Change: (value: string) => void;
  onMuscleGroup3Change: (value: string) => void;
}

const WorkoutMuscleGroupSelector = ({
  muscleGroup1,
  muscleGroup2,
  muscleGroup3,
  onMuscleGroup1Change,
  onMuscleGroup2Change,
  onMuscleGroup3Change
}: WorkoutMuscleGroupSelectorProps) => {
  const muscleGroupOptions = [
    'Back', 'Bicep', 'Tricep', 'Chest', 'Legs', 'Shoulder', 'Forearms', 'Cardio', 'Core'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Muscle Group 1</label>
        <Select value={muscleGroup1} onValueChange={onMuscleGroup1Change}>
          <SelectTrigger className="w-full h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
            <SelectValue placeholder="Select muscle group" />
          </SelectTrigger>
          <SelectContent className="rounded-lg bg-white z-50">
            {muscleGroupOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Muscle Group 2</label>
        <Select value={muscleGroup2} onValueChange={onMuscleGroup2Change}>
          <SelectTrigger className="w-full h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
            <SelectValue placeholder="Select muscle group" />
          </SelectTrigger>
          <SelectContent className="rounded-lg bg-white z-50">
            {muscleGroupOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Muscle Group 3</label>
        <Select value={muscleGroup3} onValueChange={onMuscleGroup3Change}>
          <SelectTrigger className="w-full h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
            <SelectValue placeholder="Select muscle group" />
          </SelectTrigger>
          <SelectContent className="rounded-lg bg-white z-50">
            {muscleGroupOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default WorkoutMuscleGroupSelector;
