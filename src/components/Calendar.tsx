
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import DailyLogDialog from './DailyLogDialog';
import WorkoutTooltip from './dailyLog/components/WorkoutTooltip';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DateData {
  workout: boolean;
  diet: boolean;
  muscleGroups: string[];
  exerciseCount: number;
}

const Calendar = () => {
  const [currentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dateHasData, setDateHasData] = useState<Record<string, DateData>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const { toast } = useToast();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get today's date for highlighting
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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

  // Calculate workout streak
  const calculateWorkoutStreak = (workoutDates: string[]): number => {
    if (workoutDates.length === 0) return 0;

    // Sort dates in descending order (most recent first)
    const sortedDates = workoutDates.sort().reverse();
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Check if today or yesterday has a workout (to handle today not being complete yet)
    const todayStr = currentDate.toISOString().split('T')[0];
    const yesterdayStr = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let startFromToday = sortedDates.includes(todayStr);
    if (!startFromToday && sortedDates.includes(yesterdayStr)) {
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      startFromToday = true;
    }

    if (!startFromToday) return 0;

    // Count consecutive days
    for (const dateStr of sortedDates) {
      const workoutDate = currentDate.toISOString().split('T')[0];
      if (dateStr === workoutDate) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }

    return streak;
  };

  // Calculate monthly statistics
  const getMonthlyStats = (monthIndex: number) => {
    const year = currentYear;
    const daysInMonth = getDaysInMonth(monthIndex, year);
    let workoutDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dateHasData[dateString]?.workout) {
        workoutDays++;
      }
    }

    const restDays = daysInMonth - workoutDays;
    return { workoutDays, restDays };
  };

  // Load workout and diet logs from Supabase
  const fetchData = async () => {
    console.log('Fetching calendar data...');
    setLoading(true);
    
    try {
      // If not authenticated, use localStorage fallback
      if (!user) {
        const allLogs = JSON.parse(localStorage.getItem('fitnessLogs') || '{}');
        const newDateHasData: Record<string, DateData> = {};
        
        Object.keys(allLogs).forEach(dateStr => {
          const log = allLogs[dateStr];
          newDateHasData[dateStr] = {
            workout: log.exercises && Array.isArray(log.exercises) && log.exercises.length > 0,
            diet: log.meals && Array.isArray(log.meals) && log.meals.length > 0,
            muscleGroups: [],
            exerciseCount: 0
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
          muscle_groups_trained,
          workouts!workouts_daily_log_id_fkey(
            id,
            exercise_name,
            muscle_group
          )
        `)
        .eq('user_id', user.id);
        
      if (dailyError) throw dailyError;
      
      console.log('Fetched daily logs:', dailyLogs);
      
      // Process data
      const newDateHasData: Record<string, DateData> = {};
      const workoutDates: string[] = [];
      
      // Process daily logs
      dailyLogs?.forEach(log => {
        const dateStr = log.log_date;
        if (!newDateHasData[dateStr]) {
          newDateHasData[dateStr] = { workout: false, diet: false, muscleGroups: [], exerciseCount: 0 };
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
        
        if (hasWorkouts) {
          workoutDates.push(dateStr);
          
          // Get muscle groups and exercise count
          const muscleGroups = log.muscle_groups_trained || 
            [...new Set(log.workouts?.map((w: any) => w.muscle_group).filter(Boolean) || [])];
          
          newDateHasData[dateStr].muscleGroups = muscleGroups;
          newDateHasData[dateStr].exerciseCount = log.workouts?.filter((w: any) => w.exercise_name?.trim()).length || 0;
        }
      });
      
      // Calculate workout streak
      setWorkoutStreak(calculateWorkoutStreak(workoutDates));
      
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

  const getWorkoutData = (day: number, month: number) => {
    const dateString = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateHasData[dateString] || { workout: false, diet: false, muscleGroups: [], exerciseCount: 0 };
  };

  const isToday = (day: number, month: number) => {
    const dateString = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateString === todayString;
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
    const stats = getMonthlyStats(monthIndex);

    return (
      <Card className="p-4 animate-fadeIn" key={`${currentYear}-${monthIndex}`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-heading text-xl font-semibold text-primary">{months[monthIndex]} {currentYear}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {stats.workoutDays} workouts • {stats.restDays} rest days
            </p>
          </div>
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
            const isTodayDate = isToday(day, monthIndex);
            const workoutData = getWorkoutData(day, monthIndex);
            
            const dateButton = (
              <Button
                key={day}
                variant="ghost"
                onClick={() => handleDateClick(day, monthIndex)}
                className={`h-8 p-0 text-sm relative ${
                  isWorkout && isMeal
                    ? 'bg-gradient-to-br from-green-200 to-blue-200 hover:from-green-300 hover:to-blue-300'
                    : isWorkout
                    ? 'bg-green-200 hover:bg-green-300'
                    : isMeal
                    ? 'bg-blue-200 hover:bg-blue-300'
                    : ''
                } ${
                  isTodayDate ? 'border-2 border-green-500 border-solid rounded-md' : ''
                }`}
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

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-3xl font-semibold text-primary">FitLog Savant</h2>
        <div className="flex items-center gap-4">
          {workoutStreak > 0 && (
            <div className="flex items-center gap-2 text-lg font-medium">
              <span>🔥</span>
              <span>Current Streak: <span className="text-green-600">{workoutStreak}</span> days</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={fetchData}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Refresh Calendar
          </Button>
        </div>
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
