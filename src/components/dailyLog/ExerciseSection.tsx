
import React, { useState, useEffect } from 'react';
import { Dumbbell } from "lucide-react";
import ExerciseList from "./lists/ExerciseList";
import ExerciseForm from "./forms/ExerciseForm";

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
  const [localExercises, setLocalExercises] = useState<Exercise[]>(exercises);

  // Update local state when props change
  useEffect(() => {
    setLocalExercises(exercises);
  }, [exercises]);

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

    const newExerciseId = editingExerciseId || Date.now().toString();
    const updatedExercise = { ...currentExercise, id: newExerciseId };

    if (editingExerciseId) {
      onUpdate(updatedExercise);
      // Update local state immediately for responsive UI
      setLocalExercises(prev => prev.map(ex => ex.id === editingExerciseId ? updatedExercise : ex));
    } else {
      onAdd(updatedExercise);
      // Update local state immediately for responsive UI
      setLocalExercises(prev => [...prev, updatedExercise]);
    }

    setCurrentExercise({ id: '', name: '', sets: '', reps: '', notes: '' });
    setShowExerciseForm(false);
    setEditingExerciseId(null);
    
    // Call onSave to ensure data is saved immediately
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
    // Update local state immediately
    setLocalExercises(prev => prev.filter(ex => ex.id !== id));
  };

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
        <Dumbbell className="w-5 h-5 text-success" />
        Workout Log
      </h3>
      
      {!showExerciseForm ? (
        <ExerciseList 
          exercises={localExercises} // Use local state for immediate UI updates
          onEdit={handleEditExercise}
          onDelete={handleDeleteExercise}
          onAdd={handleAddExercise}
        />
      ) : (
        <ExerciseForm
          currentExercise={currentExercise}
          isEditing={!!editingExerciseId}
          onChange={handleExerciseChange}
          onSubmit={handleSubmitExercise}
          onCancel={handleCancelExerciseForm}
        />
      )}
    </div>
  );
};

export default ExerciseSection;
