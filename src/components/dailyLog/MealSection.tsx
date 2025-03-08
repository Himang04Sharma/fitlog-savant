
import React, { useState } from 'react';
import { Apple } from "lucide-react";
import MealList from "./lists/MealList";
import MealForm from "./forms/MealForm";

export interface Meal {
  id: string;
  name: string;
  calories: string;
  protein: string;
  notes: string;
}

interface MealSectionProps {
  meals: Meal[];
  onSave: () => void;
  onDelete: (id: string) => void;
  onAdd: (meal: Meal) => void;
  onUpdate: (meal: Meal) => void;
}

const MealSection: React.FC<MealSectionProps> = ({
  meals,
  onSave,
  onDelete,
  onAdd,
  onUpdate
}) => {
  const [showMealForm, setShowMealForm] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<Meal>({
    id: '',
    name: '',
    calories: '',
    protein: '',
    notes: ''
  });
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [localMeals, setLocalMeals] = useState<Meal[]>(meals);

  // Update local state when props change
  React.useEffect(() => {
    setLocalMeals(meals);
  }, [meals]);

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

    const newMealId = editingMealId || Date.now().toString();
    const updatedMeal = { ...currentMeal, id: newMealId };

    if (editingMealId) {
      onUpdate(updatedMeal);
      // Update local state immediately for responsive UI
      setLocalMeals(prev => prev.map(meal => meal.id === editingMealId ? updatedMeal : meal));
    } else {
      onAdd(updatedMeal);
      // Update local state immediately for responsive UI
      setLocalMeals(prev => [...prev, updatedMeal]);
    }

    setCurrentMeal({ id: '', name: '', calories: '', protein: '', notes: '' });
    setShowMealForm(false);
    setEditingMealId(null);
    
    // Call onSave to ensure data is saved immediately
    onSave();
  };

  const handleEditMeal = (meal: Meal) => {
    setCurrentMeal(meal);
    setEditingMealId(meal.id);
    setShowMealForm(true);
  };

  const handleCancelMealForm = () => {
    setShowMealForm(false);
    setEditingMealId(null);
    setCurrentMeal({ id: '', name: '', calories: '', protein: '', notes: '' });
  };

  const handleDeleteMeal = (id: string) => {
    console.log('Deleting meal with ID:', id);
    onDelete(id);
    // Update local state immediately
    setLocalMeals(prev => prev.filter(meal => meal.id !== id));
  };

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <Apple className="w-5 h-5 text-secondary" />
        Diet Log
      </h3>
      
      {!showMealForm ? (
        <MealList 
          meals={localMeals} // Use local state for immediate UI updates
          onEdit={handleEditMeal}
          onDelete={handleDeleteMeal}
          onAdd={handleAddMeal}
        />
      ) : (
        <MealForm
          currentMeal={currentMeal}
          isEditing={!!editingMealId}
          onChange={handleMealChange}
          onSubmit={handleSubmitMeal}
          onCancel={handleCancelMealForm}
        />
      )}
    </div>
  );
};

export default MealSection;
