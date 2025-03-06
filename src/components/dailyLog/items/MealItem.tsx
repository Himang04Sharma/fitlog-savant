
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { Meal } from "../MealSection";

interface MealItemProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

const MealItem: React.FC<MealItemProps> = ({
  meal,
  onEdit,
  onDelete
}) => {
  return (
    <div className="p-3 bg-secondary/10 rounded-lg flex justify-between">
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
          onClick={() => onEdit(meal)}
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
  );
};

export default MealItem;
