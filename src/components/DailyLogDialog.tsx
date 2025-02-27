
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle, Dumbbell, Apple, Save, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

interface DailyLogDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
}

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

interface Meal {
  id: string;
  name: string;
  calories: string;
  protein: string;
  notes: string;
}

interface DailyLog {
  exercises: Exercise[];
  meals: Meal[];
}

// Local storage helper functions
const saveDailyLog = (date: string, log: DailyLog) => {
  const allLogs = JSON.parse(localStorage.getItem('fitnessLogs') || '{}');
  allLogs[date] = log;
  localStorage.setItem('fitnessLogs', JSON.stringify(allLogs));
};

const getDailyLog = (date: string): DailyLog => {
  const allLogs = JSON.parse(localStorage.getItem('fitnessLogs') || '{}');
  return allLogs[date] || { exercises: [], meals: [] };
};

// Helper functions to safely convert Supabase JSON to our types
const safeJsonToExercises = (data: Json | null): Exercise[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        return {
          id: String(item.id || ''),
          name: String(item.name || ''),
          sets: String(item.sets || ''),
          reps: String(item.reps || ''),
          notes: String(item.notes || '')
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
  return [];
};

const safeJsonToMeals = (data: Json | null): Meal[] => {
  if (!data) return [];
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
  return [];
};

const DailyLogDialog = ({ date, open, onOpenChange, user }: DailyLogDialogProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showMealForm, setShowMealForm] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: '',
    name: '',
    sets: '',
    reps: '',
    notes: ''
  });
  const [currentMeal, setCurrentMeal] = useState<Meal>({
    id: '',
    name: '',
    calories: '',
    protein: '',
    notes: ''
  });
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data when dialog opens or date changes
  useEffect(() => {
    if (date && open) {
      const dateString = format(date, 'yyyy-MM-dd');
      
      // If user is authenticated, fetch data from Supabase
      if (user) {
        const fetchData = async () => {
          try {
            // Try to get workout logs for this date
            const { data: workoutData, error: workoutError } = await supabase
              .from('workout_logs')
              .select('exercises')
              .eq('user_id', user.id)
              .eq('date', dateString)
              .single();
              
            if (workoutError && workoutError.code !== 'PGRST116') { // PGRST116 is "not found" error
              throw workoutError;
            }
            
            // Try to get diet logs for this date
            const { data: dietData, error: dietError } = await supabase
              .from('diet_logs')
              .select('meals')
              .eq('user_id', user.id)
              .eq('date', dateString)
              .single();
              
            if (dietError && dietError.code !== 'PGRST116') { // PGRST116 is "not found" error
              throw dietError;
            }
            
            // Set exercises and meals from Supabase data if it exists
            if (workoutData) {
              setExercises(safeJsonToExercises(workoutData.exercises));
            } else {
              setExercises([]);
            }
            
            if (dietData) {
              setMeals(safeJsonToMeals(dietData.meals));
            } else {
              setMeals([]);
            }
          } catch (error: any) {
            console.error('Error fetching daily logs:', error);
            // Fallback to localStorage
            const savedLog = getDailyLog(dateString);
            setExercises(savedLog.exercises);
            setMeals(savedLog.meals);
            
            toast({
              title: 'Error',
              description: 'Failed to fetch your daily logs. Using local data instead.',
              variant: 'destructive',
            });
          }
        };
        
        fetchData();
      } else {
        // Not authenticated, use localStorage
        const savedLog = getDailyLog(dateString);
        setExercises(savedLog.exercises);
        setMeals(savedLog.meals);
      }
    }
  }, [date, open, user, toast]);

  // Reset forms when dialog closes
  useEffect(() => {
    if (!open) {
      setShowExerciseForm(false);
      setShowMealForm(false);
      setCurrentExercise({ id: '', name: '', sets: '', reps: '', notes: '' });
      setCurrentMeal({ id: '', name: '', calories: '', protein: '', notes: '' });
      setEditingExerciseId(null);
      setEditingMealId(null);
    }
  }, [open]);

  const handleSaveData = async () => {
    if (!date) return;
    
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Save to localStorage as fallback
    saveDailyLog(dateString, { exercises, meals });
    
    // If user is authenticated, save to Supabase
    if (user) {
      try {
        // Save workout data
        const { error: workoutError } = await supabase
          .from('workout_logs')
          .upsert({
            user_id: user.id,
            date: dateString,
            exercises: exercises as unknown as Json,
          }, {
            onConflict: 'user_id,date'
          });
          
        if (workoutError) throw workoutError;
        
        // Save diet data
        const { error: dietError } = await supabase
          .from('diet_logs')
          .upsert({
            user_id: user.id,
            date: dateString,
            meals: meals as unknown as Json,
          }, {
            onConflict: 'user_id,date'
          });
          
        if (dietError) throw dietError;
        
        toast({
          title: "Saved",
          description: "Your fitness data has been saved.",
        });
      } catch (error: any) {
        console.error('Error saving data to Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to save to the cloud, but your data is saved locally.",
          variant: "destructive",
        });
      }
    }
  };

  // Exercise handlers
  const handleAddExercise = () => {
    setShowExerciseForm(true);
    setEditingExerciseId(null);
    setCurrentExercise({ id: '', name: '', sets: '', reps: '', notes: '' });
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitExercise = () => {
    if (currentExercise.name.trim() === '') return;

    if (editingExerciseId) {
      // Update existing exercise
      setExercises(prev => 
        prev.map(ex => ex.id === editingExerciseId ? { ...currentExercise, id: editingExerciseId } : ex)
      );
    } else {
      // Add new exercise
      const newExercise = {
        ...currentExercise,
        id: Date.now().toString()
      };
      setExercises(prev => [...prev, newExercise]);
    }

    // Reset form
    setCurrentExercise({ id: '', name: '', sets: '', reps: '', notes: '' });
    setShowExerciseForm(false);
    setEditingExerciseId(null);

    // Save to local storage and/or Supabase
    handleSaveData();
  };

  const handleEditExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setEditingExerciseId(exercise.id);
    setShowExerciseForm(true);
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
    handleSaveData();
  };

  // Meal handlers
  const handleAddMeal = () => {
    setShowMealForm(true);
    setEditingMealId(null);
    setCurrentMeal({ id: '', name: '', calories: '', protein: '', notes: '' });
  };

  const handleMealChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentMeal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMeal = () => {
    if (currentMeal.name.trim() === '') return;

    if (editingMealId) {
      // Update existing meal
      setMeals(prev => 
        prev.map(meal => meal.id === editingMealId ? { ...currentMeal, id: editingMealId } : meal)
      );
    } else {
      // Add new meal
      const newMeal = {
        ...currentMeal,
        id: Date.now().toString()
      };
      setMeals(prev => [...prev, newMeal]);
    }

    // Reset form
    setCurrentMeal({ id: '', name: '', calories: '', protein: '', notes: '' });
    setShowMealForm(false);
    setEditingMealId(null);

    // Save to local storage and/or Supabase
    handleSaveData();
  };

  const handleEditMeal = (meal: Meal) => {
    setCurrentMeal(meal);
    setEditingMealId(meal.id);
    setShowMealForm(true);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
    handleSaveData();
  };

  // Cancel form handlers
  const handleCancelExerciseForm = () => {
    setShowExerciseForm(false);
    setEditingExerciseId(null);
    setCurrentExercise({ id: '', name: '', sets: '', reps: '', notes: '' });
  };

  const handleCancelMealForm = () => {
    setShowMealForm(false);
    setEditingMealId(null);
    setCurrentMeal({ id: '', name: '', calories: '', protein: '', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            Daily Log - {date ? format(date, 'MMMM d, yyyy') : ''}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Exercise Section */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-success" />
              Workout Log
            </h3>
            
            {!showExerciseForm ? (
              <div className="space-y-3">
                {exercises.length > 0 ? (
                  <div className="space-y-3">
                    {exercises.map((exercise) => (
                      <div key={exercise.id} className="p-3 bg-success/10 rounded-lg flex justify-between">
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {exercise.sets} sets × {exercise.reps} reps
                          </div>
                          {exercise.notes && (
                            <div className="text-sm mt-1">{exercise.notes}</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditExercise(exercise)}
                            className="h-8 w-8"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-success/10 rounded-lg">
                    <div className="font-medium">Your Exercises</div>
                    <div className="text-sm text-muted-foreground">No exercises added yet</div>
                  </div>
                )}
                <Button variant="outline" className="w-full" size="sm" onClick={handleAddExercise}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            ) : (
              <div className="bg-card p-4 rounded-lg border space-y-3">
                <h4 className="font-medium">{editingExerciseId ? 'Edit Exercise' : 'Add Exercise'}</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Exercise Name</label>
                    <Input 
                      id="name"
                      name="name"
                      value={currentExercise.name}
                      onChange={handleExerciseChange}
                      placeholder="e.g., Bench Press"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="sets" className="block text-sm font-medium mb-1">Sets</label>
                      <Input 
                        id="sets"
                        name="sets"
                        value={currentExercise.sets}
                        onChange={handleExerciseChange}
                        placeholder="e.g., 3"
                      />
                    </div>
                    <div>
                      <label htmlFor="reps" className="block text-sm font-medium mb-1">Reps</label>
                      <Input 
                        id="reps"
                        name="reps"
                        value={currentExercise.reps}
                        onChange={handleExerciseChange}
                        placeholder="e.g., 12"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes (optional)</label>
                    <Textarea 
                      id="notes"
                      name="notes"
                      value={currentExercise.notes}
                      onChange={handleExerciseChange}
                      placeholder="Add any notes or observations"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="default" 
                      onClick={handleSubmitExercise}
                      className="flex-1"
                    >
                      {editingExerciseId ? 'Update' : 'Add'} Exercise
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelExerciseForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Meal Section */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Apple className="w-5 h-5 text-secondary" />
              Diet Log
            </h3>
            
            {!showMealForm ? (
              <div className="space-y-3">
                {meals.length > 0 ? (
                  <div className="space-y-3">
                    {meals.map((meal) => (
                      <div key={meal.id} className="p-3 bg-secondary/10 rounded-lg flex justify-between">
                        <div>
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {meal.calories} calories • {meal.protein}g protein
                          </div>
                          {meal.notes && (
                            <div className="text-sm mt-1">{meal.notes}</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditMeal(meal)}
                            className="h-8 w-8"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <div className="font-medium">Your Meals</div>
                    <div className="text-sm text-muted-foreground">No meals added yet</div>
                  </div>
                )}
                <Button variant="outline" className="w-full" size="sm" onClick={handleAddMeal}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Meal
                </Button>
              </div>
            ) : (
              <div className="bg-card p-4 rounded-lg border space-y-3">
                <h4 className="font-medium">{editingMealId ? 'Edit Meal' : 'Add Meal'}</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="mealName" className="block text-sm font-medium mb-1">Meal Name</label>
                    <Input 
                      id="mealName"
                      name="name"
                      value={currentMeal.name}
                      onChange={handleMealChange}
                      placeholder="e.g., Chicken Salad"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="calories" className="block text-sm font-medium mb-1">Calories</label>
                      <Input 
                        id="calories"
                        name="calories"
                        value={currentMeal.calories}
                        onChange={handleMealChange}
                        placeholder="e.g., 350"
                      />
                    </div>
                    <div>
                      <label htmlFor="protein" className="block text-sm font-medium mb-1">Protein (g)</label>
                      <Input 
                        id="protein"
                        name="protein"
                        value={currentMeal.protein}
                        onChange={handleMealChange}
                        placeholder="e.g., 25"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="mealNotes" className="block text-sm font-medium mb-1">Notes (optional)</label>
                    <Textarea 
                      id="mealNotes"
                      name="notes"
                      value={currentMeal.notes}
                      onChange={handleMealChange}
                      placeholder="Add any notes or ingredients"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="default" 
                      onClick={handleSubmitMeal}
                      className="flex-1"
                    >
                      {editingMealId ? 'Update' : 'Add'} Meal
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelMealForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyLogDialog;
