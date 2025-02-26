
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle, Dumbbell, Apple } from "lucide-react";
import { format } from 'date-fns';

interface DailyLogDialogProps {
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DailyLogDialog = ({ date, open, onOpenChange }: DailyLogDialogProps) => {
  const handleAddExercise = () => {
    // TODO: Implement exercise addition
    console.log('Adding exercise for:', date);
  };

  const handleAddMeal = () => {
    // TODO: Implement meal addition
    console.log('Adding meal for:', date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            Daily Log - {format(date, 'MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-success" />
              Workout Log
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <div className="font-medium">Your Exercises</div>
                <div className="text-sm text-muted-foreground">No exercises added yet</div>
              </div>
              <Button variant="outline" className="w-full" size="sm" onClick={handleAddExercise}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Exercise
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Apple className="w-5 h-5 text-secondary" />
              Diet Log
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <div className="font-medium">Your Meals</div>
                <div className="text-sm text-muted-foreground">No meals added yet</div>
              </div>
              <Button variant="outline" className="w-full" size="sm" onClick={handleAddMeal}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyLogDialog;
