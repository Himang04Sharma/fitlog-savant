
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save, Trash2, Dumbbell } from "lucide-react";

export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

interface ExerciseSectionProps {
  exercises: Exercise[];
  onSave: () => void;
  onDelete: (id: string) => void;
  onAdd: (exercise: Exercise) => void;
  onUpdate: (exercise: Exercise) => void;
}

const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  exercises,
  onSave,
  onDelete,
  onAdd,
  onUpdate
}) => {
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: '',
    name: '',
    sets: '',
    reps: '',
    notes: ''
  });
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

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
      onUpdate({ ...currentExercise, id: editingExerciseId });
    } else {
      onAdd({
        ...currentExercise,
        id: Date.now().toString()
      });
    }

    setCurrentExercise({ id: '', name: '', sets: '', reps: '', notes: '' });
    setShowExerciseForm(false);
    setEditingExerciseId(null);
    
    onSave();
  };

  const handleEditExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setEditingExerciseId(exercise.id);
    setShowExerciseForm(true);
  };

  const handleCancelExerciseForm = () => {
    setShowExerciseForm(false);
    setEditingExerciseId(null);
    setCurrentExercise({ id: '', name: '', sets: '', reps: '', notes: '' });
  };

  const handleDeleteExercise = (id: string) => {
    console.log('Deleting exercise with ID:', id);
    onDelete(id);
  };

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <Dumbbell className="w-5 h-5 text-success" />
        Workout Log
      </h3>
      
      {!showExerciseForm ? (
        <div className="space-y-3">
          {exercises && exercises.length > 0 ? (
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
  );
};

export default ExerciseSection;
