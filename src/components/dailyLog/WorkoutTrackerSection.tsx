
import React, { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MuscleGroupMultiSelect from './components/MuscleGroupMultiSelect';
import MuscleGroupWorkoutSection from './components/MuscleGroupWorkoutSection';

interface Exercise {
  sets: string;
  reps: string;
  exercise: string;
  weight: string;
}

interface WorkoutData {
  [muscleGroup: string]: Exercise[];
}

interface WorkoutTrackerSectionProps {
  workouts?: {
    muscleGroup: string;
    sets: string;
    reps: string;
    exercise: string;
    weight: string;
  }[];
  muscleGroupsTrained?: string[];
  onWorkoutsChange?: (workouts: any[]) => void;
  onMuscleGroupsTrainedChange?: (groups: string[]) => void;
}

const WorkoutTrackerSection = ({
  workouts = [],
  muscleGroupsTrained = [],
  onWorkoutsChange,
  onMuscleGroupsTrainedChange
}: WorkoutTrackerSectionProps) => {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(muscleGroupsTrained);
  const [workoutData, setWorkoutData] = useState<WorkoutData>({});

  // Initialize workout data from props
  useEffect(() => {
    const groupedWorkouts: WorkoutData = {};
    
    // Group existing workouts by muscle group
    workouts.forEach(workout => {
      if (workout.muscleGroup) {
        if (!groupedWorkouts[workout.muscleGroup]) {
          groupedWorkouts[workout.muscleGroup] = [];
        }
        groupedWorkouts[workout.muscleGroup].push({
          sets: workout.sets,
          reps: workout.reps,
          exercise: workout.exercise,
          weight: workout.weight
        });
      }
    });

    // Ensure each selected muscle group has at least one empty exercise
    selectedMuscleGroups.forEach(group => {
      if (!groupedWorkouts[group] || groupedWorkouts[group].length === 0) {
        groupedWorkouts[group] = [{ sets: '', reps: '', exercise: '', weight: '' }];
      }
    });

    setWorkoutData(groupedWorkouts);
  }, [workouts, selectedMuscleGroups]);

  // Update selected muscle groups from props
  useEffect(() => {
    setSelectedMuscleGroups(muscleGroupsTrained);
  }, [muscleGroupsTrained]);

  const handleMuscleGroupsChange = (groups: string[]) => {
    setSelectedMuscleGroups(groups);
    onMuscleGroupsTrainedChange?.(groups);

    // Initialize empty exercises for new muscle groups
    const newWorkoutData = { ...workoutData };
    groups.forEach(group => {
      if (!newWorkoutData[group]) {
        newWorkoutData[group] = [{ sets: '', reps: '', exercise: '', weight: '' }];
      }
    });

    // Remove data for unselected muscle groups
    Object.keys(newWorkoutData).forEach(group => {
      if (!groups.includes(group)) {
        delete newWorkoutData[group];
      }
    });

    setWorkoutData(newWorkoutData);
    updateWorkoutsFromData(newWorkoutData);
  };

  const handleExercisesChange = (muscleGroup: string, exercises: Exercise[]) => {
    const updatedData = {
      ...workoutData,
      [muscleGroup]: exercises
    };
    setWorkoutData(updatedData);
    updateWorkoutsFromData(updatedData);
  };

  const updateWorkoutsFromData = (data: WorkoutData) => {
    const flatWorkouts: any[] = [];
    
    Object.entries(data).forEach(([muscleGroup, exercises]) => {
      exercises.forEach(exercise => {
        flatWorkouts.push({
          muscleGroup,
          sets: exercise.sets,
          reps: exercise.reps,
          exercise: exercise.exercise,
          weight: exercise.weight
        });
      });
    });

    onWorkoutsChange?.(flatWorkouts);
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
      
      <CardContent className="p-6 space-y-6">
        <MuscleGroupMultiSelect
          selectedMuscleGroups={selectedMuscleGroups}
          onMuscleGroupsChange={handleMuscleGroupsChange}
        />

        {selectedMuscleGroups.length > 0 && (
          <div className="space-y-4">
            {selectedMuscleGroups.map((muscleGroup) => (
              <MuscleGroupWorkoutSection
                key={muscleGroup}
                muscleGroup={muscleGroup}
                exercises={workoutData[muscleGroup] || []}
                onExercisesChange={(exercises) => handleExercisesChange(muscleGroup, exercises)}
              />
            ))}
          </div>
        )}

        {selectedMuscleGroups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Dumbbell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Select muscle groups to start logging your workout</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutTrackerSection;
