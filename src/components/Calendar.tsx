
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import DailyLogDialog from './DailyLogDialog';

const Calendar = () => {
  const [currentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateHasData, setDateHasData] = useState<Record<string, { workout: boolean, diet: boolean }>>({});
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load all logs from localStorage to determine which dates have data
  useEffect(() => {
    const allLogs = JSON.parse(localStorage.getItem('fitnessLogs') || '{}');
    const newDateHasData: Record<string, { workout: boolean, diet: boolean }> = {};
    
    Object.keys(allLogs).forEach(dateStr => {
      const log = allLogs[dateStr];
      newDateHasData[dateStr] = {
        workout: log.exercises && log.exercises.length > 0,
        diet: log.meals && log.meals.length > 0
      };
    });
    
    setDateHasData(newDateHasData);
  }, [dialogOpen]); // Re-check when dialog closes

  const hasWorkout = (day: number, month: number) => {
    const dateString = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateHasData[dateString]?.workout || false;
  };
  
  const hasDiet = (day: number, month: number) => {
    const dateString = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateHasData[dateString]?.diet || false;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number, month: number) => {
    const clickedDate = new Date(currentYear, month, day);
    setSelectedDate(clickedDate);
    setDialogOpen(true);
  };

  const generateMonthCalendar = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(monthIndex, currentYear);
    const firstDay = getFirstDayOfMonth(monthIndex, currentYear);
    const days = new Array(daysInMonth).fill(null).map((_, i) => i + 1);
    const blanks = new Array(firstDay).fill(null);

    return (
      <Card className="p-4 animate-fadeIn" key={`${currentYear}-${monthIndex}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl font-semibold text-primary">{months[monthIndex]} {currentYear}</h3>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
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
            const isDiet = hasDiet(day, monthIndex);
            
            return (
              <Button
                key={day}
                variant="ghost"
                onClick={() => handleDateClick(day, monthIndex)}
                className={`h-8 p-0 text-sm ${
                  isWorkout && isDiet
                    ? 'bg-gradient-to-br from-success/20 to-secondary/20 hover:from-success/30 hover:to-secondary/30'
                    : isWorkout
                    ? 'bg-success/20 hover:bg-success/30'
                    : isDiet
                    ? 'bg-secondary/20 hover:bg-secondary/30'
                    : ''
                }`}
              >
                {day}
              </Button>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-3xl font-semibold text-primary">Calendar View</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((_, index) => generateMonthCalendar(index))}
      </div>

      <div className="flex gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-success/60" />
          <span className="text-sm text-muted-foreground">Workout</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-secondary/60" />
          <span className="text-sm text-muted-foreground">Diet</span>
        </div>
      </div>

      <DailyLogDialog
        date={selectedDate}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Calendar;
