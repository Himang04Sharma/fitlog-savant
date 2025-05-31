import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import DailyLogDialog from './DailyLogDialog';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Calendar = () => {
  const [currentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateHasData, setDateHasData] = useState<Record<string, { workout: boolean, diet: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkUser();
  }, []);

  // Load workout and diet logs from Supabase
  const fetchData = async () => {
    console.log('Fetching calendar data...');
    setLoading(true);
    
    try {
      // If not authenticated, use localStorage fallback
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

      // Get daily logs from the new schema
      const { data: dailyLogs, error: dailyError } = await supabase
        .from('daily_logs')
        .select(`
          log_date,
          breakfast,
          lunch,
          dinner,
          snacks,
          workouts!workouts_daily_log_id_fkey(
            id,
            exercise_name
          )
        `)
        .eq('user_id', user.id);
        
      if (dailyError) throw dailyError;
      
      console.log('Fetched daily logs:', dailyLogs);
      
      // Process data
      const newDateHasData: Record<string, { workout: boolean, diet: boolean }> = {};
      
      // Process daily logs
      dailyLogs?.forEach(log => {
        const dateStr = log.log_date;
        if (!newDateHasData[dateStr]) {
          newDateHasData[dateStr] = { workout: false, diet: false };
        }
        
        // Check if meals data exists (any of the meal fields have content)
        const hasMeals = !!(log.breakfast || log.lunch || log.dinner || log.snacks);
        newDateHasData[dateStr].diet = hasMeals;
        
        // Check if workouts exist and have exercise names
        const hasWorkouts = log.workouts && 
          Array.isArray(log.workouts) && 
          log.workouts.length > 0 && 
          log.workouts.some((workout: any) => workout.exercise_name?.trim());
        newDateHasData[dateStr].workout = hasWorkouts;
      });
      
      console.log('Processed date data:', newDateHasData);
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

  // Load data initially and when user changes
  useEffect(() => {
    fetchData();
  }, [user]);
  
  // Refresh data when dialog closes
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
            const isMeal = hasDiet(day, monthIndex);
            
            return (
              <Button
                key={day}
                variant="ghost"
                onClick={() => handleDateClick(day, monthIndex)}
                className={`h-8 p-0 text-sm ${
                  isWorkout && isMeal
                    ? 'bg-gradient-to-br from-green-200 to-blue-200 hover:from-green-300 hover:to-blue-300'
                    : isWorkout
                    ? 'bg-green-200 hover:bg-green-300'
                    : isMeal
                    ? 'bg-blue-200 hover:bg-blue-300'
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
          <div className="w-4 h-4 rounded-full bg-green-200" />
          <span className="text-sm text-muted-foreground">Workout</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-200" />
          <span className="text-sm text-muted-foreground">Meals</span>
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
