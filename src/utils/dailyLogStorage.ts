
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Exercise } from "@/components/dailyLog/ExerciseSection";
import { Meal } from "@/components/dailyLog/MealSection";

// Local storage functions
export const saveDailyLogLocally = (date: string, log: { exercises: Exercise[], meals: Meal[] }) => {
  const allLogs = JSON.parse(localStorage.getItem('fitnessLogs') || '{}');
  allLogs[date] = log;
  localStorage.setItem('fitnessLogs', JSON.stringify(allLogs));
};

export const getDailyLogLocally = (date: string): { exercises: Exercise[], meals: Meal[] } => {
  const allLogs = JSON.parse(localStorage.getItem('fitnessLogs') || '{}');
  return allLogs[date] || { exercises: [], meals: [] };
};

// Supabase functions
export const saveDailyLogToSupabase = async (
  userId: string,
  date: string,
  exercises: Exercise[],
  meals: Meal[]
): Promise<{ success: boolean, error?: any }> => {
  try {
    console.log('Saving to Supabase with userId:', userId);
    console.log('Date:', date);
    console.log('Exercises to save:', JSON.stringify(exercises));
    console.log('Meals to save:', JSON.stringify(meals));
    
    // Convert to JSON format compatible with Supabase
    const exercisesJson = JSON.parse(JSON.stringify(exercises)) as unknown as Json;
    const mealsJson = JSON.parse(JSON.stringify(meals)) as unknown as Json;
    
    if (exercises.length > 0) {
      const { error: workoutError } = await supabase
        .from('workout_logs')
        .upsert({
          user_id: userId,
          date: date,
          exercises: exercisesJson,
        }, {
          onConflict: 'user_id,date'
        });
        
      if (workoutError) {
        console.error('Error saving exercises:', workoutError);
        throw workoutError;
      }
    }
    
    if (meals.length > 0) {
      const { error: dietError } = await supabase
        .from('diet_logs')
        .upsert({
          user_id: userId,
          date: date,
          meals: mealsJson,
        }, {
          onConflict: 'user_id,date'
        });
        
      if (dietError) {
        console.error('Error saving meals:', dietError);
        throw dietError;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving data to Supabase:', error);
    return { success: false, error };
  }
};

export const fetchDailyLogFromSupabase = async (
  userId: string,
  date: string
): Promise<{ exercises: Exercise[], meals: Meal[], error?: any }> => {
  try {
    const { data: workoutData, error: workoutError } = await supabase
      .from('workout_logs')
      .select('exercises')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();
      
    if (workoutError) throw workoutError;
    
    const { data: dietData, error: dietError } = await supabase
      .from('diet_logs')
      .select('meals')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();
      
    if (dietError) throw dietError;
    
    const exercises = safeJsonToExercises(workoutData?.exercises || null);
    const meals = safeJsonToMeals(dietData?.meals || null);
    
    return { exercises, meals };
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    return { exercises: [], meals: [], error };
  }
};

export const safeJsonToExercises = (data: Json | null): Exercise[] => {
  if (!data) return [];
  
  try {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, any>;
          return {
            id: String(itemObj.id || ''),
            name: String(itemObj.name || ''),
            sets: String(itemObj.sets || ''),
            reps: String(itemObj.reps || ''),
            notes: String(itemObj.notes || '')
          };
        }
        return {
          id: '',
          name: '',
          sets: '',
          reps: '',
          notes: ''
        };
      });
    }
  } catch (error) {
    console.error('Error converting JSON to exercises:', error);
  }
  
  return [];
};

export const safeJsonToMeals = (data: Json | null): Meal[] => {
  if (!data) return [];
  
  try {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, any>;
          return {
            id: String(itemObj.id || ''),
            name: String(itemObj.name || ''),
            calories: String(itemObj.calories || ''),
            protein: String(itemObj.protein || ''),
            notes: String(itemObj.notes || '')
          };
        }
        return {
          id: '',
          name: '',
          calories: '',
          protein: '',
          notes: ''
        };
      });
    }
  } catch (error) {
    console.error('Error converting JSON to meals:', error);
  }
  
  return [];
};
