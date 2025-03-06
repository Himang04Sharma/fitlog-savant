
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import ExerciseSection, { Exercise } from "./dailyLog/ExerciseSection";
import MealSection, { Meal } from "./dailyLog/MealSection";
import { 
  saveDailyLogLocally, 
  getDailyLogLocally, 
  saveDailyLogToSupabase, 
  fetchDailyLogFromSupabase 
} from "@/utils/dailyLogStorage";

interface DailyLogDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onDataSaved?: () => void;
}

const DailyLogDialog = ({ date, open, onOpenChange, user, onDataSaved }: DailyLogDialogProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (date && open) {
      fetchData();
    }
  }, [date, open, user]);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

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

  const handleSaveData = async () => {
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
    setExercises(prev => [...prev, exercise]);
  };

  const handleUpdateExercise = (exercise: Exercise) => {
    setExercises(prev => 
      prev.map(ex => ex.id === exercise.id ? exercise : ex)
    );
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
    handleSaveData();
  };

  const handleAddMeal = (meal: Meal) => {
    setMeals(prev => [...prev, meal]);
  };

  const handleUpdateMeal = (meal: Meal) => {
    setMeals(prev => 
      prev.map(m => m.id === meal.id ? meal : m)
    );
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
    handleSaveData();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            Daily Log - {date ? format(date, 'MMMM d, yyyy') : ''}
          </DialogTitle>
          <DialogDescription>
            Track your workouts and meals for this day
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading your fitness data...</div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <ExerciseSection
              exercises={exercises}
              onSave={handleSaveData}
              onDelete={handleDeleteExercise}
              onAdd={handleAddExercise}
              onUpdate={handleUpdateExercise}
            />
            
            <MealSection
              meals={meals}
              onSave={handleSaveData}
              onDelete={handleDeleteMeal}
              onAdd={handleAddMeal}
              onUpdate={handleUpdateMeal}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DailyLogDialog;
