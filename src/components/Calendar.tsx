import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import DailyLogDialog from './DailyLogDialog';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Json } from "@/integrations/supabase/types";

const Calendar = () => {
  const [currentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateHasData, setDateHasData] = useState<Record<string, { workout: boolean, diet: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchData = async () => {
    console.log('Fetching calendar data for user:', user?.id);
    setLoading(true);
    
    try {
      if (!user) {
        const allLogs = JSON.parse(localStorage.getItem('fitnessLogs') || '{}');
        const newDateHasData: Record<string, { workout: boolean, diet: boolean }> = {};
        
        Object.keys(allLogs).forEach(dateStr => {
          const log = allLogs[dateStr];
          newDateHasData[dateStr] = {
            workout: log.exercises && Array.isArray(log.exercises) && log.exercises.length > 0,
            diet: log.meals && Array.isArray(log.meals) && log.meals.length > 0
          };
        });
        
        setDateHasData(newDateHasData);
        setLoading(false);
        return;
      }

      const { data: workoutLogs, error: workoutError } = await supabase
        .from('workout_logs')
        .select('date, exercises')
        .eq('user_id', user.id);
        
      if (workoutError) {
        console.error('Workout fetch error:', workoutError);
        throw workoutError;
      }
      
      const { data: dietLogs, error: dietError } = await supabase
        .from('diet_logs')
        .select('date, meals')
        .eq('user_id', user.id);
        
      if (dietError) {
        console.error('Diet fetch error:', dietError);
        throw dietError;
      }
      
      console.log('Fetched workout logs:', workoutLogs?.length);
      console.log('Fetched diet logs:', dietLogs?.length);
      
      const newDateHasData: Record<string, { workout: boolean, diet: boolean }> = {};
      
      workoutLogs?.forEach(log => {
        const dateStr = log.date;
        if (!newDateHasData[dateStr]) {
          newDateHasData[dateStr] = { workout: false, diet: false };
        }
        
        const exercises = log.exercises;
        
        if (!exercises) {
          newDateHasData[dateStr].workout = false;
          return;
        }
        
        let hasExercises = false;
        
        if (Array.isArray(exercises)) {
          hasExercises = exercises.length > 0;
        } else if (typeof exercises === 'object') {
          hasExercises = Object.keys(exercises).length > 0;
        }
        
        newDateHasData[dateStr].workout = hasExercises;
      });
      
      dietLogs?.forEach(log => {
        const dateStr = log.date;
        if (!newDateHasData[dateStr]) {
          newDateHasData[dateStr] = { workout: false, diet: false };
        }
        
        const meals = log.meals;
        
        if (!meals) {
          newDateHasData[dateStr].diet = false;
          return;
        }
        
        let hasMeals = false;
        
        if (Array.isArray(meals)) {
          hasMeals = meals.length > 0;
        } else if (typeof meals === 'object') {
          hasMeals = Object.keys(meals).length > 0;
        }
        
        newDateHasData[dateStr].diet = hasMeals;
      });
      
      console.log('Processed date data:', Object.keys(newDateHasData).length);
      setDateHasData(newDateHasData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your fitness data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);
  
  useEffect(() => {
    if (!dialogOpen) {
      fetchData();
    }
  }, [dialogOpen]);

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

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      fetchData();
    }
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
        <Button variant="outline" size="sm" onClick={fetchData}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Refresh Calendar
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading your fitness data...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((_, index) => generateMonthCalendar(index))}
        </div>
      )}

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
        onOpenChange={handleDialogClose}
        user={user}
        onDataSaved={fetchData}
      />
    </div>
  );
};

export default Calendar;
