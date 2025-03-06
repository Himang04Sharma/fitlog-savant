
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { 
  saveDailyLogLocally, 
  getDailyLogLocally, 
  saveDailyLogToSupabase, 
  fetchDailyLogFromSupabase 
} from "@/utils/dailyLogStorage";
import { Exercise } from "@/components/dailyLog/ExerciseSection";
import { Meal } from "@/components/dailyLog/MealSection";

interface UseDailyLogProps {
  date: Date | null;
  user?: any;
  onDataSaved?: () => void;
}

export function useDailyLog({ date, user, onDataSaved }: UseDailyLogProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetState = () => {
    setExercises([]);
    setMeals([]);
  };

  const fetchData = async () => {
    if (!date) return;
    
    setLoading(true);
    const dateString = format(date, 'yyyy-MM-dd');
    
    try {
      console.log('Fetching daily log data for date:', dateString);
      
      if (user) {
        const { exercises: fetchedExercises, meals: fetchedMeals, error } = 
          await fetchDailyLogFromSupabase(user.id, dateString);
          
        if (error) throw error;
        
        setExercises(fetchedExercises);
        setMeals(fetchedMeals);
        console.log('Fetched exercises:', fetchedExercises);
        console.log('Fetched meals:', fetchedMeals);
      } else {
        const savedLog = getDailyLogLocally(dateString);
        setExercises(savedLog.exercises);
        setMeals(savedLog.meals);
      }
    } catch (error: any) {
      console.error('Error fetching daily logs:', error);
      const savedLog = getDailyLogLocally(dateString);
      setExercises(savedLog.exercises);
      setMeals(savedLog.meals);
      
      toast({
        title: 'Error',
        description: 'Failed to fetch your daily logs. Using local data instead.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    if (!date) return;
    
    const dateString = format(date, 'yyyy-MM-dd');
    console.log('Saving data for date:', dateString);
    console.log('Current exercises:', exercises);
    console.log('Current meals:', meals);
    
    saveDailyLogLocally(dateString, { exercises, meals });
    
    if (user) {
      try {
        console.log('Saving to Supabase with user ID:', user.id);
        
        const { success, error } = await saveDailyLogToSupabase(
          user.id, 
          dateString, 
          exercises, 
          meals
        );
        
        if (!success) throw error;
        
        if (onDataSaved) {
          onDataSaved();
        }
        
        toast({
          title: "Saved",
          description: "Your fitness data has been saved to the database.",
        });
      } catch (error: any) {
        console.error('Error saving data to Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to save to the database, but your data is saved locally.",
          variant: "destructive",
        });
      }
    } else {
      if (onDataSaved) {
        onDataSaved();
      }
      
      toast({
        title: "Saved Locally",
        description: "Sign in to save your data to the cloud.",
      });
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    console.log('Adding exercise:', exercise);
    setExercises(prev => [...prev, exercise]);
  };

  const handleUpdateExercise = (exercise: Exercise) => {
    console.log('Updating exercise:', exercise);
    setExercises(prev => 
      prev.map(ex => ex.id === exercise.id ? exercise : ex)
    );
  };

  const handleDeleteExercise = (id: string) => {
    console.log('Deleting exercise with ID:', id);
    setExercises(prev => prev.filter(ex => ex.id !== id));
    saveData();
  };

  const handleAddMeal = (meal: Meal) => {
    console.log('Adding meal:', meal);
    setMeals(prev => [...prev, meal]);
  };

  const handleUpdateMeal = (meal: Meal) => {
    console.log('Updating meal:', meal);
    setMeals(prev => 
      prev.map(m => m.id === meal.id ? meal : m)
    );
  };

  const handleDeleteMeal = (id: string) => {
    console.log('Deleting meal with ID:', id);
    setMeals(prev => prev.filter(meal => meal.id !== id));
    saveData();
  };

  return {
    exercises,
    meals,
    loading,
    resetState,
    fetchData,
    saveData,
    handleAddExercise,
    handleUpdateExercise,
    handleDeleteExercise,
    handleAddMeal,
    handleUpdateMeal,
    handleDeleteMeal
  };
}
