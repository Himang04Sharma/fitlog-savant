
import React from 'react';
import { Button } from "../ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

interface CalendarHeaderProps {
  workoutStreak: number;
  onRefresh: () => void;
}

const CalendarHeader = ({ workoutStreak, onRefresh }: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      {workoutStreak > 0 ? (
        <div className="flex items-center gap-2 text-lg font-medium">
          <span>🔥</span>
          <span style={{ color: 'var(--text-primary)' }}>
            Current Streak: <span style={{ color: 'var(--accent-green)' }}>{workoutStreak}</span> days
          </span>
        </div>
      ) : (
        <div></div>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        className="border-custom transition-all duration-200"
        style={{ 
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-card)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-card)';
        }}
      >
        <CalendarIcon className="h-4 w-4 mr-2" />
        Refresh Calendar
      </Button>
    </div>
  );
};

export default CalendarHeader;
