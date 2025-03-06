
import React, { useState } from 'react';
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
        <ExerciseList 
          exercises={exercises}
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
