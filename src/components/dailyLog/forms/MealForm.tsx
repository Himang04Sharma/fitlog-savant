
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Meal } from "../MealSection";

interface MealFormProps {
  currentMeal: Meal;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const MealForm: React.FC<MealFormProps> = ({
  currentMeal,
  isEditing,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="bg-card p-4 rounded-lg border space-y-3">
      <h4 className="font-medium">{isEditing ? 'Edit Meal' : 'Add Meal'}</h4>
      <div className="space-y-3">
        <div>
          <label htmlFor="mealName" className="block text-sm font-medium mb-1">Meal Name</label>
          <Input 
            id="mealName"
            name="name"
            value={currentMeal.name}
            onChange={onChange}
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
              onChange={onChange}
              placeholder="e.g., 350"
            />
          </div>
          <div>
            <label htmlFor="protein" className="block text-sm font-medium mb-1">Protein (g)</label>
            <Input 
              id="protein"
              name="protein"
              value={currentMeal.protein}
              onChange={onChange}
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
            onChange={onChange}
            placeholder="Add any notes or ingredients"
            rows={3}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            onClick={onSubmit}
            className="flex-1"
          >
            {isEditing ? 'Update' : 'Add'} Meal
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealForm;
