
import React from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
  const [muscleGroups, setMuscleGroups] = React.useState(['', '', '']);

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
    onWorkoutsChange?.(newWorkouts);
  };

  const addWorkoutRow = () => {
    const newWorkouts = [...workouts, { muscleGroup: '', sets: '', reps: '', exercise: '', weight: '' }];
    onWorkoutsChange?.(newWorkouts);
  };

  const removeWorkoutRow = (index: number) => {
    if (workouts.length > 4) {
      const newWorkouts = workouts.filter((_, i) => i !== index);
      onWorkoutsChange?.(newWorkouts);
    }
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
                <SelectContent className="rounded-xl bg-white z-50">
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

        <div className="bg-white/50 rounded-xl p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-medium text-gray-700 w-20">Sets</TableHead>
                <TableHead className="text-center font-medium text-gray-700 w-28">Reps</TableHead>
                <TableHead className="text-center font-medium text-gray-700">Exercise</TableHead>
                <TableHead className="text-center font-medium text-gray-700 w-24">Weight</TableHead>
                {workouts.length > 4 && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {workouts.map((workout, index) => (
                <TableRow key={index}>
                  <TableCell className="p-2">
                    <Select 
                      value={workout.sets} 
                      onValueChange={(value) => handleWorkoutChange(index, 'sets', value)}
                    >
                      <SelectTrigger className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-blue-300 w-full">
                        <SelectValue placeholder="Sets" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-white z-50">
                        {setsOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <Select 
                      value={workout.reps} 
                      onValueChange={(value) => handleWorkoutChange(index, 'reps', value)}
                    >
                      <SelectTrigger className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-blue-300 w-full">
                        <SelectValue placeholder="Reps" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-white z-50">
                        {repsOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell className="p-2">
                    <Input
                      value={workout.exercise}
                      onChange={(e) => handleWorkoutChange(index, 'exercise', e.target.value)}
                      placeholder="Exercise name"
                      className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
                    />
                  </TableCell>

                  <TableCell className="p-2">
                    <Input
                      value={workout.weight}
                      onChange={(e) => handleWorkoutChange(index, 'weight', e.target.value)}
                      placeholder="Weight"
                      className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-blue-300 w-full"
                    />
                  </TableCell>

                  {workouts.length > 4 && (
                    <TableCell className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkoutRow(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        ×
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-center mt-4">
            <Button
              onClick={addWorkoutRow}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4" />
              Add Exercise
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutTrackerSection;
