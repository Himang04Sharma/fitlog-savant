
import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const WorkoutTrackerSection = () => {
  const [muscleGroups, setMuscleGroups] = useState(['', '', '']);
  const [workouts, setWorkouts] = useState(Array(5).fill({ sets: '', reps: '', exercise: '' }));

  const muscleGroupOptions = [
    'Back', 'Bicep', 'Tricep', 'Chest', 'Legs', 'Shoulder', 'Forearms', 'Cardio', 'Core'
  ];

  const setsOptions = ['1', '2', '3', '4', '5'];
  const repsOptions = ['8-10', '10-12', '12-15'];

  const handleMuscleGroupChange = (index: number, value: string) => {
    const newMuscleGroups = [...muscleGroups];
    newMuscleGroups[index] = value;
    setMuscleGroups(newMuscleGroups);
  };

  const handleWorkoutChange = (index: number, field: string, value: string) => {
    const newWorkouts = [...workouts];
    newWorkouts[index] = { ...newWorkouts[index], [field]: value };
    setWorkouts(newWorkouts);
  };

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Dumbbell className="w-6 h-6 text-blue-600" />
          Workout Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {muscleGroups.map((group, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Muscle Group {index + 1}
              </label>
              <Select value={group} onValueChange={(value) => handleMuscleGroupChange(index, value)}>
                <SelectTrigger className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-blue-300">
                  <SelectValue placeholder="Select muscle group" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {muscleGroupOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-2">Sets</div>
            <div className="col-span-2">Reps</div>
            <div className="col-span-8">Exercise</div>
          </div>
          
          {workouts.map((workout, index) => (
            <div key={index} className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <Select 
                  value={workout.sets} 
                  onValueChange={(value) => handleWorkoutChange(index, 'sets', value)}
                >
                  <SelectTrigger className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-blue-300">
                    <SelectValue placeholder="Sets" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {setsOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Select 
                  value={workout.reps} 
                  onValueChange={(value) => handleWorkoutChange(index, 'reps', value)}
                >
                  <SelectTrigger className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-blue-300">
                    <SelectValue placeholder="Reps" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {repsOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-8">
                <Input
                  value={workout.exercise}
                  onChange={(e) => handleWorkoutChange(index, 'exercise', e.target.value)}
                  placeholder="Exercise name"
                  className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutTrackerSection;
