
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DailyLogData {
  goals: string[];
  waterIntake: string;
  steps: string;
  weight: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  macros: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  workouts: {
    muscleGroup: string;
    sets: string;
    reps: string;
    exercise: string;
    weight: string;
  }[];
  muscleGroups: {
    muscleGroup1: string;
    muscleGroup2: string;
    muscleGroup3: string;
  };
}

interface UseDailyLogNewProps {
  date: Date | null;
  user?: any;
  onDataSaved?: () => void;
}

export function useDailyLogNew({ date, user, onDataSaved }: UseDailyLogNewProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [dailyLogData, setDailyLogData] = useState<DailyLogData>({
    goals: [''],
    waterIntake: '',
    steps: '',
    weight: '',
    meals: {
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: ''
    },
    macros: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    },
    workouts: Array(4).fill({
      muscleGroup: '',
      sets: '',
      reps: '',
      exercise: '',
      weight: ''
    }),
    muscleGroups: {
      muscleGroup1: '',
      muscleGroup2: '',
      muscleGroup3: ''
    }
  });

  const resetState = () => {
    setDailyLogData({
      goals: [''],
      waterIntake: '',
      steps: '',
      weight: '',
      meals: {
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: ''
      },
      macros: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      },
      workouts: Array(4).fill({
        muscleGroup: '',
        sets: '',
        reps: '',
        exercise: '',
        weight: ''
      }),
      muscleGroups: {
        muscleGroup1: '',
        muscleGroup2: '',
        muscleGroup3: ''
      }
    });
  };

  const fetchData = async () => {
    if (!date || !user) return;
    
    setLoading(true);
    const dateString = format(date, 'yyyy-MM-dd');
    
    try {
      console.log('Fetching daily log data for date:', dateString);
      
      const { data: dailyLog, error: dailyLogError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', dateString)
        .maybeSingle();
        
      if (dailyLogError) throw dailyLogError;
      
      if (dailyLog) {
        // Fetch workouts for this daily log
        const { data: workouts, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .eq('daily_log_id', dailyLog.id);
          
        if (workoutsError) throw workoutsError;
        
        // Convert workouts to the format expected by the UI - ensure minimum 4 rows
        const workoutData = Array(Math.max(4, workouts?.length || 4)).fill(null).map((_, index) => {
          const workout = workouts?.[index];
          return workout ? {
            muscleGroup: workout.muscle_group || '',
            sets: workout.sets?.toString() || '',
            reps: workout.reps || '',
            exercise: workout.exercise_name || '',
            weight: workout.weight?.toString() || ''
          } : {
            muscleGroup: '',
            sets: '',
            reps: '',
            exercise: '',
            weight: ''
          };
        });

        // Extract muscle groups from workouts data - get unique muscle groups
        const uniqueMuscleGroups = [...new Set(workouts?.map(w => w.muscle_group).filter(Boolean) || [])];
        const muscleGroups = {
          muscleGroup1: uniqueMuscleGroups[0] || '',
          muscleGroup2: uniqueMuscleGroups[1] || '',
          muscleGroup3: uniqueMuscleGroups[2] || ''
        };
        
        setDailyLogData({
          goals: dailyLog.goals || [''],
          waterIntake: dailyLog.water_intake?.toString() || '',
          steps: dailyLog.steps?.toString() || '',
          weight: dailyLog.weight?.toString() || '',
          meals: {
            breakfast: dailyLog.breakfast || '',
            lunch: dailyLog.lunch || '',
            dinner: dailyLog.dinner || '',
            snacks: dailyLog.snacks || ''
          },
          macros: {
            calories: dailyLog.macros_calories?.toString() || '',
            protein: dailyLog.macros_protein?.toString() || '',
            carbs: dailyLog.macros_carbs?.toString() || '',
            fat: dailyLog.macros_fat?.toString() || ''
          },
          workouts: workoutData,
          muscleGroups: muscleGroups
        });
        
        console.log('Fetched daily log data:', dailyLog);
        console.log('Fetched workouts:', workouts);
      }
    } catch (error: any) {
      console.error('Error fetching daily logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your daily log data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    if (!date || !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save your daily log data.',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    const dateString = format(date, 'yyyy-MM-dd');
    
    try {
      console.log('Saving daily log data for date:', dateString);
      console.log('Current workouts data:', dailyLogData.workouts);
      console.log('Current muscle groups:', dailyLogData.muscleGroups);
      
      // Prepare daily log data - only include fields that exist in the database
      const dailyLogPayload = {
        user_id: user.id,
        log_date: dateString,
        goals: dailyLogData.goals.filter(goal => goal.trim() !== ''),
        water_intake: dailyLogData.waterIntake ? parseInt(dailyLogData.waterIntake) : null,
        steps: dailyLogData.steps ? parseInt(dailyLogData.steps) : null,
        weight: dailyLogData.weight ? parseFloat(dailyLogData.weight) : null,
        breakfast: dailyLogData.meals.breakfast || null,
        lunch: dailyLogData.meals.lunch || null,
        dinner: dailyLogData.meals.dinner || null,
        snacks: dailyLogData.meals.snacks || null,
        macros_calories: dailyLogData.macros.calories ? parseInt(dailyLogData.macros.calories) : null,
        macros_protein: dailyLogData.macros.protein ? parseInt(dailyLogData.macros.protein) : null,
        macros_carbs: dailyLogData.macros.carbs ? parseInt(dailyLogData.macros.carbs) : null,
        macros_fat: dailyLogData.macros.fat ? parseInt(dailyLogData.macros.fat) : null
      };
      
      // Use upsert with proper conflict resolution
      const { data: dailyLog, error: dailyLogError } = await supabase
        .from('daily_logs')
        .upsert(dailyLogPayload, {
          onConflict: 'user_id,log_date',
          ignoreDuplicates: false
        })
        .select()
        .single();
        
      if (dailyLogError) throw dailyLogError;
      
      console.log('Saved daily log:', dailyLog);
      
      // Delete existing workouts for this daily log
      await supabase
        .from('workouts')
        .delete()
        .eq('daily_log_id', dailyLog.id);
      
      // Save workouts that have data
      const workoutsToSave = dailyLogData.workouts
        .filter(workout => 
          workout.exercise.trim() !== '' || 
          workout.muscleGroup.trim() !== '' ||
          workout.sets.trim() !== '' ||
          workout.reps.trim() !== '' ||
          workout.weight.trim() !== ''
        )
        .map(workout => ({
          daily_log_id: dailyLog.id,
          muscle_group: workout.muscleGroup || null,
          sets: workout.sets ? parseInt(workout.sets) : null,
          reps: workout.reps || null,
          exercise_name: workout.exercise || null,
          weight: workout.weight ? parseFloat(workout.weight) : null
        }));
      
      if (workoutsToSave.length > 0) {
        const { error: workoutsError } = await supabase
          .from('workouts')
          .insert(workoutsToSave);
          
        if (workoutsError) throw workoutsError;
        
        console.log('Saved workouts:', workoutsToSave);
      }
      
      if (onDataSaved) {
        onDataSaved();
      }
      
      toast({
        title: "Saved",
        description: "Your daily log has been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error saving daily log:', error);
      toast({
        title: "Error",
        description: "Failed to save your daily log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    dailyLogData,
    setDailyLogData,
    loading,
    saving,
    resetState,
    fetchData,
    saveData
  };
}
