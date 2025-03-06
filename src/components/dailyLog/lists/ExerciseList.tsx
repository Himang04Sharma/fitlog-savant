
import React from 'react';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Exercise } from "../ExerciseSection";
import ExerciseItem from "../items/ExerciseItem";

interface ExerciseListProps {
  exercises: Exercise[];
  onEdit: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  onEdit,
  onDelete,
  onAdd
}) => {
  return (
    <div className="space-y-3">
      {exercises && exercises.length > 0 ? (
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <ExerciseItem 
              key={exercise.id}
              exercise={exercise}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="p-3 bg-success/10 rounded-lg">
          <div className="font-medium">Your Exercises</div>
          <div className="text-sm text-muted-foreground">No exercises added yet</div>
        </div>
      )}
      <Button variant="outline" className="w-full" size="sm" onClick={onAdd}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Exercise
      </Button>
    </div>
  );
};

export default ExerciseList;
