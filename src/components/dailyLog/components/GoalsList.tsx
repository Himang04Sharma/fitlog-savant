
import React from 'react';
import { Plus, X, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GoalsListProps {
  goals: string[];
  completedGoals: boolean[];
  onGoalChange: (index: number, value: string) => void;
  onToggleCompletion: (index: number) => void;
  onAddGoal: () => void;
  onRemoveGoal: (index: number) => void;
}

const GoalsList = ({
  goals,
  completedGoals,
  onGoalChange,
  onToggleCompletion,
  onAddGoal,
  onRemoveGoal
}: GoalsListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
        <label className="text-lg font-semibold text-gray-800 tracking-wide">Daily Goals</label>
      </div>
      
      {goals.map((goal, index) => (
        <div key={index} className="group/goal relative">
          <div className="flex gap-3 items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <button
              onClick={() => onToggleCompletion(index)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                completedGoals[index]
                  ? 'bg-emerald-500 border-emerald-500 scale-110'
                  : 'border-gray-300 hover:border-emerald-400 hover:scale-105'
              }`}
            >
              {completedGoals[index] && (
                <CheckCircle2 className="w-4 h-4 text-white animate-in zoom-in duration-200" />
              )}
            </button>
            
            <Input
              value={goal}
              onChange={(e) => onGoalChange(index, e.target.value)}
              placeholder={`Set your goal ${index + 1}`}
              className={`border-0 bg-transparent rounded-xl focus:ring-2 focus:ring-emerald-300 transition-all h-12 text-gray-800 placeholder:text-gray-500 ${
                completedGoals[index] ? 'line-through text-gray-500' : ''
              }`}
            />
            
            {goals.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveGoal(index)}
                className="flex-shrink-0 h-10 w-10 rounded-xl hover:bg-red-100 opacity-0 group-hover/goal:opacity-100 transition-all duration-200"
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="ghost"
        onClick={onAddGoal}
        className="w-full h-14 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-600 font-semibold transition-all duration-300 hover:scale-[1.02]"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Goal
      </Button>
    </div>
  );
};

export default GoalsList;
