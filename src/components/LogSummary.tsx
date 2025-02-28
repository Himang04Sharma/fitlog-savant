
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Apple, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

const LogSummary = () => {
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([]);
  const [dietLogs, setDietLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch logs from Supabase
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      
      try {
        if (!user) {
          // Use localStorage fallback if not authenticated
          const allLogs = JSON.parse(localStorage.getItem('fitnessLogs') || '{}');
          
          const workoutLogsArray: any[] = [];
          const dietLogsArray: any[] = [];
          
          Object.entries(allLogs).forEach(([date, log]: [string, any]) => {
            if (log.exercises && log.exercises.length > 0) {
              workoutLogsArray.push({
                date,
                exercises: log.exercises,
              });
            }
            
            if (log.meals && log.meals.length > 0) {
              dietLogsArray.push({
                date,
                meals: log.meals,
              });
            }
          });
          
          setWorkoutLogs(workoutLogsArray);
          setDietLogs(dietLogsArray);
          setLoading(false);
          return;
        }

        // Get workout logs
        const { data: workoutData, error: workoutError } = await supabase
          .from('workout_logs')
          .select('date, exercises')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10); // Limit to most recent 10 entries
          
        if (workoutError) throw workoutError;
        
        // Get diet logs
        const { data: dietData, error: dietError } = await supabase
          .from('diet_logs')
          .select('date, meals')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10); // Limit to most recent 10 entries
          
        if (dietError) throw dietError;
        
        console.log('Fetched workout logs for summary:', workoutData);
        console.log('Fetched diet logs for summary:', dietData);
        
        setWorkoutLogs(workoutData || []);
        setDietLogs(dietData || []);
      } catch (error: any) {
        console.error('Error fetching logs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch your fitness data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [user, toast]);

  // Helper function to safely extract the name from JSON data
  const getExerciseNames = (exercises: any[]): string => {
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return "No exercises";
    }
    
    return exercises
      .map((ex) => ex.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ") + (exercises.length > 3 ? ` +${exercises.length - 3} more` : "");
  };
  
  const getMealNames = (meals: any[]): string => {
    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return "No meals";
    }
    
    return meals
      .map((meal) => meal.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ") + (meals.length > 3 ? ` +${meals.length - 3} more` : "");
  };

  // Format date for display
  const formatDate = (dateStr: string): string => {
    try {
      // Handle different date formats
      const date = dateStr.includes('T') 
        ? parseISO(dateStr) 
        : new Date(dateStr);
      
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', dateStr, error);
      return dateStr; // Fallback to original string
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>Loading your fitness data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Logs</CardTitle>
        <CardDescription>Your most recent workout and diet entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Workout Logs */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-success" />
              Workout Logs
            </h3>
            
            {workoutLogs.length > 0 ? (
              <div className="space-y-3">
                {workoutLogs.map((log, index) => (
                  <div key={`workout-${index}`} className="p-3 bg-success/10 rounded-lg">
                    <div className="font-medium">{formatDate(log.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {getExerciseNames(log.exercises)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-success/10 rounded-lg">
                <div className="font-medium">No workout logs yet</div>
                <div className="text-sm text-muted-foreground">
                  Start logging your workouts to see them here
                </div>
              </div>
            )}
          </div>
          
          {/* Diet Logs */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <Apple className="w-5 h-5 text-secondary" />
              Diet Logs
            </h3>
            
            {dietLogs.length > 0 ? (
              <div className="space-y-3">
                {dietLogs.map((log, index) => (
                  <div key={`diet-${index}`} className="p-3 bg-secondary/10 rounded-lg">
                    <div className="font-medium">{formatDate(log.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {getMealNames(log.meals)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-secondary/10 rounded-lg">
                <div className="font-medium">No diet logs yet</div>
                <div className="text-sm text-muted-foreground">
                  Start logging your meals to see them here
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogSummary;
