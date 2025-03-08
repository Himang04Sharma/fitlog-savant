
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

  const saveData = async (updatedExercises?: Exercise[], updatedMeals?: Meal[]) => {
    if (!date) return;
    
    const dateString = format(date, 'yyyy-MM-dd');
    const exercisesToSave = updatedExercises || exercises;
    const mealsToSave = updatedMeals || meals;
    
    console.log('Saving data for date:', dateString);
    console.log('Exercises to save:', exercisesToSave);
    console.log('Meals to save:', mealsToSave);
    
    saveDailyLogLocally(dateString, { exercises: exercisesToSave, meals: mealsToSave });
    
    if (user) {
      try {
        console.log('Saving to Supabase with user ID:', user.id);
        
        const { success, error } = await saveDailyLogToSupabase(
          user.id, 
          dateString, 
          exercisesToSave, 
          mealsToSave
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
    // Create a new array with the added exercise and save it directly
    const updatedExercises = [...exercises, exercise];
    setExercises(updatedExercises);
    // Save data with the updated array instead of relying on state update
    saveData(updatedExercises, meals);
  };

  const handleUpdateExercise = (exercise: Exercise) => {
    console.log('Updating exercise:', exercise);
    // Create a new array with the updated exercise and save it directly
    const updatedExercises = exercises.map(ex => ex.id === exercise.id ? exercise : ex);
    setExercises(updatedExercises);
    // Save data with the updated array
    saveData(updatedExercises, meals);
  };

  const handleDeleteExercise = (id: string) => {
    console.log('Deleting exercise with ID:', id);
    const updatedExercises = exercises.filter(ex => ex.id !== id);
    setExercises(updatedExercises);
    saveData(updatedExercises, meals);
  };

  const handleAddMeal = (meal: Meal) => {
    console.log('Adding meal:', meal);
    // Create a new array with the added meal and save it directly
    const updatedMeals = [...meals, meal];
    setMeals(updatedMeals);
    // Save data with the updated array instead of relying on state update
    saveData(exercises, updatedMeals);
  };

  const handleUpdateMeal = (meal: Meal) => {
    console.log('Updating meal:', meal);
    // Create a new array with the updated meal and save it directly
    const updatedMeals = meals.map(m => m.id === meal.id ? meal : m);
    setMeals(updatedMeals);
    // Save data with the updated array
    saveData(exercises, updatedMeals);
  };

  const handleDeleteMeal = (id: string) => {
    console.log('Deleting meal with ID:', id);
    const updatedMeals = meals.filter(meal => meal.id !== id);
    setMeals(updatedMeals);
    saveData(exercises, updatedMeals);
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
