
import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import DailyLogDialog from './DailyLogDialog';

const Calendar = () => {
  const today = new Date();
  const days = new Array(31).fill(null).map((_, i) => i + 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const hasWorkout = (day: number) => Math.random() > 0.7;
  const hasDiet = (day: number) => Math.random() > 0.7;

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(2024, 1, day); // February 2024
    setSelectedDate(clickedDate);
    setDialogOpen(true);
  };

  return (
    <div className="w-full">
      <Card className="p-8 animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-3xl font-semibold text-primary">February 2024</h2>
          <Button variant="outline" size="icon">
            <CalendarIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-4 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => {
            const isWorkout = hasWorkout(day);
            const isDiet = hasDiet(day);
            
            return (
              <Button
                key={day}
                variant="ghost"
                onClick={() => handleDateClick(day)}
                className={`h-16 ${
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
        <div className="flex gap-6 mt-8 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-success/60" />
            <span className="text-sm text-muted-foreground">Workout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-secondary/60" />
            <span className="text-sm text-muted-foreground">Diet</span>
          </div>
        </div>
      </Card>

      <DailyLogDialog
        date={selectedDate}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Calendar;
