
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WorkoutTooltipProps {
  children: React.ReactNode;
  muscleGroups: string[];
  exerciseCount: number;
}

const WorkoutTooltip = ({ children, muscleGroups, exerciseCount }: WorkoutTooltipProps) => {
  const muscleGroupsText = muscleGroups.length > 0 
    ? muscleGroups.join(', ') 
    : 'No muscle groups';

  const exerciseText = exerciseCount === 1 ? 'exercise' : 'exercises';

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm max-w-xs"
        >
          <div className="font-medium">{muscleGroupsText}</div>
          <div className="text-gray-300">{exerciseCount} {exerciseText}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WorkoutTooltip;
