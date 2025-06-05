
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
          className="px-3 py-2 rounded-lg shadow-lg text-sm max-w-xs transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {muscleGroupsText}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {exerciseCount} {exerciseText}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WorkoutTooltip;
