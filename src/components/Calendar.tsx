
import React from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

const Calendar = () => {
  const today = new Date();
  const days = new Array(31).fill(null).map((_, i) => i + 1);
  
  const hasWorkout = (day: number) => Math.random() > 0.7;
  const hasDiet = (day: number) => Math.random() > 0.7;

  return (
    <Card className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-semibold text-primary">February 2024</h2>
        <Button variant="outline" size="icon">
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isWorkout = hasWorkout(day);
          const isDiet = hasDiet(day);
          
          return (
            <Button
              key={day}
              variant="ghost"
              className={`h-12 ${
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
      <div className="flex gap-4 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success/60" />
          <span className="text-sm text-muted-foreground">Workout</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary/60" />
          <span className="text-sm text-muted-foreground">Diet</span>
        </div>
      </div>
    </Card>
  );
};

export default Calendar;
