
import React, { useState } from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  workouts = Array(9).fill({ muscleGroup: '', sets: '', reps: '', exercise: '', weight: '' }),
  onWorkoutsChange
}: WorkoutTrackerSectionProps) => {
  const [activeTab, setActiveTab] = useState('group1');

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

  const removeWorkoutRow = (index: number) => {
    if (workouts.length > 9) {
      const newWorkouts = workouts.filter((_, i) => i !== index);
      onWorkoutsChange?.(newWorkouts);
    }
  };

  // Split workouts into groups of 3
  const getWorkoutGroup = (groupIndex: number) => {
    const startIndex = groupIndex * 3;
    return workouts.slice(startIndex, startIndex + 3);
  };

  const updateWorkoutInGroup = (groupIndex: number, localIndex: number, field: string, value: string) => {
    const globalIndex = groupIndex * 3 + localIndex;
    handleWorkoutChange(globalIndex, field, value);
  };

  const WorkoutTable = ({ groupWorkouts, groupIndex }: { groupWorkouts: any[], groupIndex: number }) => (
    <div className="space-y-3">
      {groupWorkouts.map((workout, localIndex) => (
        <div
          key={localIndex}
          className={`grid grid-cols-5 gap-3 p-3 rounded-lg border border-gray-100 transition-colors hover:bg-gray-50 ${
            localIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
          }`}
        >
          <div>
            <Select 
              value={workout.sets} 
              onValueChange={(value) => updateWorkoutInGroup(groupIndex, localIndex, 'sets', value)}
            >
              <SelectTrigger className="h-9 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
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
          </div>
          
          <div>
            <Select 
              value={workout.reps} 
              onValueChange={(value) => updateWorkoutInGroup(groupIndex, localIndex, 'reps', value)}
            >
              <SelectTrigger className="h-9 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white">
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
          </div>
          
          <div className="col-span-2">
            <Input
              value={workout.exercise}
              onChange={(e) => updateWorkoutInGroup(groupIndex, localIndex, 'exercise', e.target.value)}
              placeholder="Exercise name"
              className="h-9 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white"
            />
          </div>

          <div>
            <Input
              value={workout.weight}
              onChange={(e) => updateWorkoutInGroup(groupIndex, localIndex, 'weight', e.target.value)}
              placeholder="Weight"
              className="h-9 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300 bg-white"
            />
          </div>
        </div>
      ))}
      
      {/* Column Headers */}
      <div className="grid grid-cols-5 gap-3 px-3 py-2 text-xs font-medium text-gray-600 border-t border-gray-100">
        <div>Sets</div>
        <div>Reps</div>
        <div className="col-span-2">Exercise</div>
        <div>Weight (kg)</div>
      </div>
    </div>
  );

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="group1" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 transition-all"
            >
              Group 1
            </TabsTrigger>
            <TabsTrigger 
              value="group2"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 transition-all"
            >
              Group 2
            </TabsTrigger>
            <TabsTrigger 
              value="group3"
              className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:border-b-2 data-[state=active]:border-teal-500 transition-all"
            >
              Group 3
            </TabsTrigger>
          </TabsList>

          <TabsContent value="group1" className="space-y-4">
            <WorkoutTable groupWorkouts={getWorkoutGroup(0)} groupIndex={0} />
          </TabsContent>

          <TabsContent value="group2" className="space-y-4">
            <WorkoutTable groupWorkouts={getWorkoutGroup(1)} groupIndex={1} />
          </TabsContent>

          <TabsContent value="group3" className="space-y-4">
            <WorkoutTable groupWorkouts={getWorkoutGroup(2)} groupIndex={2} />
          </TabsContent>
        </Tabs>

        {/* Add Exercise Button - More subtle */}
        <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
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
