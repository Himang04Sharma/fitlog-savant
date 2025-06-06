
import React, { useState, useEffect } from 'react';
import DailyLogDialog from './DailyLogDialog';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarLegend from './calendar/CalendarLegend';
import MonthlyCalendarCard from './calendar/MonthlyCalendarCard';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { calculateWorkoutStreak } from '../utils/calendarUtils';

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

  const handleDateClick = (day: number, month: number) => {
    const clickedDate = new Date(currentYear, month, day);
    setSelectedDate(clickedDate);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
  };

  return (
    <div className="w-full space-y-6">
      <CalendarHeader workoutStreak={workoutStreak} onRefresh={fetchData} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>
            Loading your fitness data...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((monthName, index) => (
            <MonthlyCalendarCard
              key={`${currentYear}-${index}`}
              monthIndex={index}
              year={currentYear}
              monthName={monthName}
              dateHasData={dateHasData}
              onDateClick={handleDateClick}
            />
          ))}
        </div>
      )}

      <CalendarLegend />

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
