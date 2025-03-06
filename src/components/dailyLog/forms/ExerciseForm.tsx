
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Exercise } from "../ExerciseSection";

interface ExerciseFormProps {
  currentExercise: Exercise;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  currentExercise,
  isEditing,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="bg-card p-4 rounded-lg border space-y-3">
      <h4 className="font-medium">{isEditing ? 'Edit Exercise' : 'Add Exercise'}</h4>
      <div className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Exercise Name</label>
          <Input 
            id="name"
            name="name"
            value={currentExercise.name}
            onChange={onChange}
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
              onChange={onChange}
              placeholder="e.g., 3"
            />
          </div>
          <div>
            <label htmlFor="reps" className="block text-sm font-medium mb-1">Reps</label>
            <Input 
              id="reps"
              name="reps"
              onChange={onChange}
              value={currentExercise.reps}
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
            onChange={onChange}
            placeholder="Add any notes or observations"
            rows={3}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            onClick={onSubmit}
            className="flex-1"
          >
            {isEditing ? 'Update' : 'Add'} Exercise
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

export default ExerciseForm;
