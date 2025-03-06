
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { Exercise } from "../ExerciseSection";

interface ExerciseItemProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onEdit,
  onDelete
}) => {
  return (
    <div className="p-3 bg-success/10 rounded-lg flex justify-between">
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
          onClick={() => onEdit(exercise)}
          className="h-8 w-8"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(exercise.id)}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ExerciseItem;
