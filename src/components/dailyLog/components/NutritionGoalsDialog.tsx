
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface NutritionGoalsDialogProps {
  macroTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  onTargetsChange: (targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}

const NutritionGoalsDialog = ({ macroTargets, onTargetsChange }: NutritionGoalsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempTargets, setTempTargets] = useState(macroTargets);

  const handleTargetChange = (macroType: 'calories' | 'protein' | 'carbs' | 'fat', value: string) => {
    setTempTargets({ ...tempTargets, [macroType]: parseInt(value) || 0 });
  };

  const saveGoals = () => {
    onTargetsChange(tempTargets);
    setIsOpen(false);
  };

  const resetGoals = () => {
    setTempTargets(macroTargets);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Daily Nutrition Goals</DialogTitle>
          <DialogDescription>
            Customize your daily nutrition targets to match your fitness goals.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="calories-goal" className="text-right text-sm font-medium">
              Calories
            </label>
            <Input
              id="calories-goal"
              type="number"
              value={tempTargets.calories}
              onChange={(e) => handleTargetChange('calories', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="protein-goal" className="text-right text-sm font-medium">
              Protein (g)
            </label>
            <Input
              id="protein-goal"
              type="number"
              value={tempTargets.protein}
              onChange={(e) => handleTargetChange('protein', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="carbs-goal" className="text-right text-sm font-medium">
              Carbs (g)
            </label>
            <Input
              id="carbs-goal"
              type="number"
              value={tempTargets.carbs}
              onChange={(e) => handleTargetChange('carbs', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="fat-goal" className="text-right text-sm font-medium">
              Fat (g)
            </label>
            <Input
              id="fat-goal"
              type="number"
              value={tempTargets.fat}
              onChange={(e) => handleTargetChange('fat', e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetGoals}>
            Cancel
          </Button>
          <Button onClick={saveGoals}>
            Save Goals
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NutritionGoalsDialog;
