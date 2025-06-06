
import React from 'react';
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import WorkoutTooltip from '../dailyLog/components/WorkoutTooltip';
import { getDaysInMonth, getFirstDayOfMonth, getMonthlyStats, getTodayString } from '../../utils/calendarUtils';

interface DateData {
  workout: boolean;
  diet: boolean;
  muscleGroups: string[];
  exerciseCount: number;
}

interface MonthlyCalendarCardProps {
  monthIndex: number;
  year: number;
  monthName: string;
  dateHasData: Record<string, DateData>;
  onDateClick: (day: number, month: number) => void;
}

const MonthlyCalendarCard = ({ 
  monthIndex, 
  year, 
  monthName, 
  dateHasData, 
  onDateClick 
}: MonthlyCalendarCardProps) => {
  const daysInMonth = getDaysInMonth(monthIndex, year);
  const firstDay = getFirstDayOfMonth(monthIndex, year);
  const days = new Array(daysInMonth).fill(null).map((_, i) => i + 1);
  const blanks = new Array(firstDay).fill(null);
  const stats = getMonthlyStats(monthIndex, year, dateHasData);
  const todayString = getTodayString();

  const hasWorkout = (day: number, month: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateHasData[dateString]?.workout || false;
  };
  
  const hasDiet = (day: number, month: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateHasData[dateString]?.diet || false;
  };

  const getWorkoutData = (day: number, month: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateHasData[dateString] || { workout: false, diet: false, muscleGroups: [], exerciseCount: 0 };
  };

  const isToday = (day: number, month: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateString === todayString;
  };

  return (
    <Card 
      className="p-4 animate-fadeIn transition-all duration-300 border-custom hover:shadow-lg" 
      style={{ 
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-heading text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {monthName} {year}
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {stats.workoutDays} workouts • {stats.restDays} rest days
          </p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="h-8" />
        ))}
        {days.map((day) => {
          const isWorkout = hasWorkout(day, monthIndex);
          const isMeal = hasDiet(day, monthIndex);
          const isTodayDate = isToday(day, monthIndex);
          const workoutData = getWorkoutData(day, monthIndex);
          
          const dateButton = (
            <Button
              key={day}
              variant="ghost"
              onClick={() => onDateClick(day, monthIndex)}
              className={`h-8 p-0 text-sm relative transition-all duration-200 ${
                isWorkout && isMeal
                  ? 'text-white'
                  : isWorkout
                  ? 'text-white'
                  : isMeal
                  ? 'text-white'
                  : ''
              } ${
                isTodayDate ? 'border-2 border-solid rounded-md' : ''
              }`}
              style={{
                backgroundColor: isWorkout && isMeal
                  ? 'var(--accent-green)'
                  : isWorkout
                  ? 'var(--accent-green)'
                  : isMeal
                  ? 'var(--accent-green)'
                  : 'transparent',
                borderColor: isTodayDate ? 'var(--today-highlight)' : 'transparent',
                color: (isWorkout || isMeal) ? '#FFFFFF' : 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                if (!isWorkout && !isMeal) {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isWorkout && !isMeal) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {day}
            </Button>
          );

          // Wrap workout dates with tooltip
          if (isWorkout && workoutData.muscleGroups.length > 0) {
            return (
              <WorkoutTooltip
                key={day}
                muscleGroups={workoutData.muscleGroups}
                exerciseCount={workoutData.exerciseCount}
              >
                {dateButton}
              </WorkoutTooltip>
            );
          }

          return dateButton;
        })}
      </div>
    </Card>
  );
};

export default MonthlyCalendarCard;
