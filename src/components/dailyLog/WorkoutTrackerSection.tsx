
import React, { useState } from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkoutTrackerSectionProps {
  workouts?: {
    muscleGroup: string;
    sets: string;
    reps: string;
    exercise: string;
    weight: string;
  }[];
  onWorkoutsChange?: (workouts: any[]) => void;
}

const WorkoutTrackerSection = ({
  workouts = Array(4).fill({ muscleGroup: '', sets: '', reps: '', exercise: '', weight: '' }),
  onWorkoutsChange
}: WorkoutTrackerSectionProps) => {
  const [muscleGroup1, setMuscleGroup1] = useState('');
  const [muscleGroup2, setMuscleGroup2] = useState('');
  const [muscleGroup3, setMuscleGroup3] = useState('');

  const muscleGroupOptions = [
    'Back', 'Bicep', 'Tricep', 'Chest', 'Legs', 'Shoulder', 'Forearms', 'Cardio', 'Core'
  ];

  const setsOptions = ['1', '2', '3', '4', '5'];
  const repsOptions = ['8-10', '10-12', '12-15'];

  const handleWorkoutChange = (index: number, field: string, value: string) => {
    const newWorkouts = [...workouts];
    newWorkouts[index] = { ...newWorkouts[index], [field]: value };
    onWorkoutsChange?.(newWorkouts);
  };

  const addWorkoutRow = () => {
    const newWorkouts = [...workouts, { muscleGroup: '', sets: '', reps: '', exercise: '', weight: '' }];
    onWorkoutsChange?.(newWorkouts);
  };

  return (
    <Card className="rounded-lg shadow-sm border border-gray-100 bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Dumbbell className="w-5 h-5 text-teal-600" />
          </div>
          Workout Tracker
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Three Muscle Group Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Muscle Group 1</label>
            <Select value={muscleGroup1} onValueChange={setMuscleGroup1}>
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
            <Select value={muscleGroup2} onValueChange={setMuscleGroup2}>
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
            <Select value={muscleGroup3} onValueChange={setMuscleGroup3}>
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

        {/* Unified Workout Table */}
        <div className="space-y-4">
          {/* Column Headers */}
          <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg">
            <div>Sets</div>
            <div>Reps</div>
            <div>Exercise</div>
            <div>Weight</div>
          </div>

          {/* Exercise Rows */}
          <div className="space-y-3">
            {workouts.slice(0, 4).map((workout, index) => (
              <div key={index} className="grid grid-cols-4 gap-4">
                <Select 
                  value={workout.sets} 
                  onValueChange={(value) => handleWorkoutChange(index, 'sets', value)}
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
                  onValueChange={(value) => handleWorkoutChange(index, 'reps', value)}
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
                  onChange={(e) => handleWorkoutChange(index, 'exercise', e.target.value)}
                  placeholder="Exercise name"
                  className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white"
                />

                <Input
                  value={workout.weight}
                  onChange={(e) => handleWorkoutChange(index, 'weight', e.target.value)}
                  placeholder="Weight"
                  className="h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Add Exercise Button */}
        <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
          <Button
            onClick={addWorkoutRow}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Exercise
          </Button>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Today's Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-teal-600">
                {workouts.filter(w => w.exercise.trim() !== '').length}
              </div>
              <div className="text-xs text-gray-600">Exercises</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-teal-600">
                {workouts.reduce((total, w) => total + (parseInt(w.sets) || 0), 0)}
              </div>
              <div className="text-xs text-gray-600">Total Sets</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-teal-600">
                {Math.round(workouts.reduce((total, w) => total + (parseFloat(w.weight) || 0), 0))}kg
              </div>
              <div className="text-xs text-gray-600">Total Weight</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutTrackerSection;
