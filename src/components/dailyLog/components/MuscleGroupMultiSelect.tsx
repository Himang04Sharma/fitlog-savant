
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
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Dumbbell className="w-4 h-4 text-green-600" />
          Select Muscle Groups Trained Today
        </label>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between h-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-300"
            >
              {selectedMuscleGroups.length > 0 
                ? `${selectedMuscleGroups.length} selected`
                : "Select muscle groups"
              }
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0 bg-white rounded-lg shadow-lg z-50">
            <div className="p-2">
              {Object.entries(muscleGroupOptions).map(([category, groups]) => (
                <div key={category} className="mb-3">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {category}
                  </div>
                  {groups.map((group) => (
                    <div
                      key={group}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => toggleMuscleGroup(group)}
                    >
                      <div className="flex h-4 w-4 items-center justify-center border border-gray-300 rounded">
                        {selectedMuscleGroups.includes(group) && (
                          <Check className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                      <span className="text-sm">{group}</span>
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
              className="bg-green-100 text-green-800 hover:bg-green-200 pr-1"
            >
              {group}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-green-300 rounded-full"
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
