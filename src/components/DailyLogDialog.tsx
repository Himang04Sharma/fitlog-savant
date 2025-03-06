
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { format } from 'date-fns';
import { useDailyLog } from "@/hooks/useDailyLog";
import DailyLogContent from './dailyLog/DailyLogContent';

interface DailyLogDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onDataSaved?: () => void;
}

const DailyLogDialog = ({ date, open, onOpenChange, user, onDataSaved }: DailyLogDialogProps) => {
  const {
    exercises,
    meals,
    loading,
    resetState,
    fetchData,
    saveData,
    handleAddExercise,
    handleUpdateExercise,
    handleDeleteExercise,
    handleAddMeal,
    handleUpdateMeal,
    handleDeleteMeal
  } = useDailyLog({
    date,
    user,
    onDataSaved
  });

  useEffect(() => {
    if (date && open) {
      fetchData();
    }
  }, [date, open, user]);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            Daily Log - {date ? format(date, 'MMMM d, yyyy') : ''}
          </DialogTitle>
          <DialogDescription>
            Track your workouts and meals for this day
          </DialogDescription>
        </DialogHeader>
        
        <DailyLogContent
          loading={loading}
          exercises={exercises}
          meals={meals}
          onSaveData={saveData}
          onDeleteExercise={handleDeleteExercise}
          onAddExercise={handleAddExercise}
          onUpdateExercise={handleUpdateExercise}
          onDeleteMeal={handleDeleteMeal}
          onAddMeal={handleAddMeal}
          onUpdateMeal={handleUpdateMeal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DailyLogDialog;
