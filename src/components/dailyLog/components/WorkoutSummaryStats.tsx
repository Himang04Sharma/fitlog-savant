
import React from 'react';

interface WorkoutSummaryStatsProps {
  workouts: {
    muscleGroup: string;
    sets: string;
    reps: string;
    exercise: string;
    weight: string;
  }[];
}

const WorkoutSummaryStats = ({ workouts }: WorkoutSummaryStatsProps) => {
  const exerciseCount = workouts.filter(w => w.exercise.trim() !== '').length;
  const totalSets = workouts.reduce((total, w) => total + (parseInt(w.sets) || 0), 0);
  const totalWeight = Math.round(workouts.reduce((total, w) => total + (parseFloat(w.weight) || 0), 0));

  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Today's Summary</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-teal-600">
            {exerciseCount}
          </div>
          <div className="text-xs text-gray-600">Exercises</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-teal-600">
            {totalSets}
          </div>
          <div className="text-xs text-gray-600">Total Sets</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-teal-600">
            {totalWeight}kg
          </div>
          <div className="text-xs text-gray-600">Total Weight</div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSummaryStats;
