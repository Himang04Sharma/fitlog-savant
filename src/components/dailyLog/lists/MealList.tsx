
import React from 'react';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Meal } from "../MealSection";
import MealItem from "../items/MealItem";

interface MealListProps {
  meals: Meal[];
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const MealList: React.FC<MealListProps> = ({
  meals,
  onEdit,
  onDelete,
  onAdd
}) => {
  return (
    <div className="space-y-3">
      {meals && meals.length > 0 ? (
        <div className="space-y-3">
          {meals.map((meal) => (
            <MealItem 
              key={meal.id}
              meal={meal}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="p-3 bg-secondary/10 rounded-lg">
          <div className="font-medium">Your Meals</div>
          <div className="text-sm text-muted-foreground">No meals added yet</div>
        </div>
      )}
      <Button variant="outline" className="w-full" size="sm" onClick={onAdd}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Meal
      </Button>
    </div>
  );
};

export default MealList;
