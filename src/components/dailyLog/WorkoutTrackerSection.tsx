import React, { useState } from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorkoutMuscleGroupSelector from './components/WorkoutMuscleGroupSelector';
import WorkoutExerciseRow from './components/WorkoutExerciseRow';
import WorkoutSummaryStats from './components/WorkoutSummaryStats';

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
    if (workouts.length <= 4) return;
    
    const newWorkouts = workouts.filter((_, i) => i !== index);
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
        <WorkoutMuscleGroupSelector
          muscleGroup1={muscleGroup1}
          muscleGroup2={muscleGroup2}
          muscleGroup3={muscleGroup3}
          onMuscleGroup1Change={setMuscleGroup1}
          onMuscleGroup2Change={setMuscleGroup2}
          onMuscleGroup3Change={setMuscleGroup3}
        />

        <div className="space-y-4">
          <div className="grid gap-4 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg" style={{ gridTemplateColumns: '50px 90px 1fr 60px 30px' }}>
            <div>Sets</div>
            <div>Reps</div>
            <div>Exercise</div>
            <div>Weight</div>
            <div></div>
          </div>

          <div className="space-y-3">
            {workouts.map((workout, index) => (
              <WorkoutExerciseRow
                key={index}
                workout={workout}
                index={index}
                canDelete={workouts.length > 4 && index >= 4}
                onWorkoutChange={handleWorkoutChange}
                onRemoveRow={removeWorkoutRow}
              />
            ))}
          </div>
        </div>

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

        <WorkoutSummaryStats workouts={workouts} />
      </CardContent>
    </Card>
  );
};

export default WorkoutTrackerSection;
