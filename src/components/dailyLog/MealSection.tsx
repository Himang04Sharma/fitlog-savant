import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save, Trash2, Apple } from "lucide-react";

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
      onUpdate({ ...currentMeal, id: editingMealId });
    } else {
      onAdd({
        ...currentMeal,
        id: Date.now().toString()
      });
    }

    setCurrentMeal({ id: '', name: '', calories: '', protein: '', notes: '' });
    setShowMealForm(false);
    setEditingMealId(null);
    
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

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <Apple className="w-5 h-5 text-secondary" />
        Diet Log
      </h3>
      
      {!showMealForm ? (
        <div className="space-y-3">
          {meals && meals.length > 0 ? (
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
                      onClick={() => onDelete(meal.id)}
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
  );
};

export default MealSection;
