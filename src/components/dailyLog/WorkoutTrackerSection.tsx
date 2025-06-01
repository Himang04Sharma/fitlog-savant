
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
  workouts = Array(12).fill({ muscleGroup: '', sets: '', reps: '', exercise: '', weight: '' }),
  onWorkoutsChange
}: WorkoutTrackerSectionProps) => {
  const muscleGroupOptions = [
    'Back', 'Bicep', 'Tricep', 'Chest', 'Legs', 'Shoulder', 'Forearms', 'Cardio', 'Core'
  ];

  const setsOptions = ['1', '2', '3', '4', '5'];
  const repsOptions = ['8-10', '10-12', '12-15'];

  // Group workouts by muscle groups (3 groups of 4 exercises each)
  const muscleGroup1 = workouts.slice(0, 4);
  const muscleGroup2 = workouts.slice(4, 8);
  const muscleGroup3 = workouts.slice(8, 12);

  const handleWorkoutChange = (index: number, field: string, value: string) => {
    const newWorkouts = [...workouts];
    newWorkouts[index] = { ...newWorkouts[index], [field]: value };
    onWorkoutsChange?.(newWorkouts);
  };

  const addWorkoutRow = () => {
    const newWorkouts = [...workouts, { muscleGroup: '', sets: '', reps: '', exercise: '', weight: '' }];
    onWorkoutsChange?.(newWorkouts);
  };

  const renderMuscleGroup = (groupWorkouts: any[], groupIndex: number, groupTitle: string) => {
    return (
      <div className="flex-1 space-y-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">{groupTitle}</h4>
          
          {/* Muscle Group Selector */}
          <Select 
            value={groupWorkouts[0]?.muscleGroup || ''} 
            onValueChange={(value) => {
              // Set the muscle group for all exercises in this group
              groupWorkouts.forEach((_, exerciseIndex) => {
                const globalIndex = groupIndex * 4 + exerciseIndex;
                handleWorkoutChange(globalIndex, 'muscleGroup', value);
              });
            }}
          >
            <SelectTrigger className="w-full h-9 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
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

        {/* Exercise Table */}
        <div className="space-y-2">
          {/* Column Headers */}
          <div className="grid grid-cols-4 gap-2 px-2 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded">
            <div>Sets</div>
            <div>Reps</div>
            <div>Exercise</div>
            <div>Weight</div>
          </div>

          {/* Exercise Rows */}
          <div className="space-y-2">
            {groupWorkouts.map((workout, exerciseIndex) => {
              const globalIndex = groupIndex * 4 + exerciseIndex;
              return (
                <div key={globalIndex} className="grid grid-cols-4 gap-2">
                  <Select 
                    value={workout.sets} 
                    onValueChange={(value) => handleWorkoutChange(globalIndex, 'sets', value)}
                  >
                    <SelectTrigger className="h-8 border-gray-200 rounded focus:ring-2 focus:ring-teal-300 bg-white text-xs">
                      <SelectValue placeholder="Sets" />
                    </SelectTrigger>
                    <SelectContent className="rounded bg-white z-50">
                      {setsOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={workout.reps} 
                    onValueChange={(value) => handleWorkoutChange(globalIndex, 'reps', value)}
                  >
                    <SelectTrigger className="h-8 border-gray-200 rounded focus:ring-2 focus:ring-teal-300 bg-white text-xs">
                      <SelectValue placeholder="Reps" />
                    </SelectTrigger>
                    <SelectContent className="rounded bg-white z-50">
                      {repsOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    value={workout.exercise}
                    onChange={(e) => handleWorkoutChange(globalIndex, 'exercise', e.target.value)}
                    placeholder="Exercise name"
                    className="h-8 border-gray-200 rounded focus:ring-2 focus:ring-teal-300 bg-white text-xs"
                  />

                  <Input
                    value={workout.weight}
                    onChange={(e) => handleWorkoutChange(globalIndex, 'weight', e.target.value)}
                    placeholder="Weight"
                    className="h-8 border-gray-200 rounded focus:ring-2 focus:ring-teal-300 bg-white text-xs"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
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
        {/* Three Muscle Groups in a Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderMuscleGroup(muscleGroup1, 0, "Muscle Group 1")}
          {renderMuscleGroup(muscleGroup2, 1, "Muscle Group 2")}
          {renderMuscleGroup(muscleGroup3, 2, "Muscle Group 3")}
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
