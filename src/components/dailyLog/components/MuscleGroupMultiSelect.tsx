
import React, { useState } from 'react';
import { Check, ChevronDown, Dumbbell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface MuscleGroupMultiSelectProps {
  selectedMuscleGroups: string[];
  onMuscleGroupsChange: (groups: string[]) => void;
}

const muscleGroupOptions = {
  "Upper Body": ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms'],
  "Lower Body": ['Legs', 'Glutes', 'Calves'],
  "Core & Others": ['Core', 'Traps', 'Cardio']
};

const MuscleGroupMultiSelect = ({ selectedMuscleGroups, onMuscleGroupsChange }: MuscleGroupMultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const toggleMuscleGroup = (group: string) => {
    if (selectedMuscleGroups.includes(group)) {
      onMuscleGroupsChange(selectedMuscleGroups.filter(g => g !== group));
    } else {
      onMuscleGroupsChange([...selectedMuscleGroups, group]);
    }
  };

  const removeMuscleGroup = (group: string) => {
    onMuscleGroupsChange(selectedMuscleGroups.filter(g => g !== group));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-primary">
          <Dumbbell className="w-4 h-4 accent-green" />
          Select Muscle Groups Trained Today
        </label>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between h-10 border-custom rounded-lg focus:ring-2 focus:ring-teal-300 bg-card text-primary hover:bg-hover-bg"
            >
              {selectedMuscleGroups.length > 0 
                ? `${selectedMuscleGroups.length} selected`
                : "Select muscle groups"
              }
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0 bg-card rounded-lg shadow-lg z-50 border-custom">
            <div className="p-2">
              {Object.entries(muscleGroupOptions).map(([category, groups]) => (
                <div key={category} className="mb-3">
                  <div className="px-2 py-1 text-xs font-semibold text-secondary uppercase tracking-wide">
                    {category}
                  </div>
                  {groups.map((group) => (
                    <div
                      key={group}
                      className="flex items-center space-x-2 p-2 hover:bg-hover-bg rounded cursor-pointer"
                      onClick={() => toggleMuscleGroup(group)}
                    >
                      <div className="flex h-4 w-4 items-center justify-center border border-custom rounded">
                        {selectedMuscleGroups.includes(group) && (
                          <Check className="h-3 w-3 accent-green" />
                        )}
                      </div>
                      <span className="text-sm text-primary">{group}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {selectedMuscleGroups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMuscleGroups.map((group) => (
            <Badge
              key={group}
              variant="secondary"
              className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50 pr-1"
            >
              {group}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-teal-300 dark:hover:bg-teal-700 rounded-full"
                onClick={() => removeMuscleGroup(group)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MuscleGroupMultiSelect;
