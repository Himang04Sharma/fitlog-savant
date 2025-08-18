import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User, Dumbbell } from 'lucide-react';

interface UserTypeSelectorProps {
  value: 'normal_user' | 'trainer';
  onChange: (value: 'normal_user' | 'trainer') => void;
  disabled?: boolean;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-primary">Account Type</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex items-center space-x-2">
          <Card className={`flex-1 p-4 cursor-pointer transition-all duration-200 hover:border-accent ${
            value === 'normal_user' ? 'border-accent bg-accent/5' : 'border-border'
          }`}>
            <Label 
              htmlFor="normal_user" 
              className="flex items-center space-x-3 cursor-pointer w-full"
            >
              <RadioGroupItem value="normal_user" id="normal_user" />
              <User className="h-5 w-5 text-secondary" />
              <div>
                <div className="font-medium text-primary">Personal User</div>
                <div className="text-sm text-secondary">Track your personal fitness journey</div>
              </div>
            </Label>
          </Card>
        </div>
        
        <div className="flex items-center space-x-2">
          <Card className={`flex-1 p-4 cursor-pointer transition-all duration-200 hover:border-accent ${
            value === 'trainer' ? 'border-accent bg-accent/5' : 'border-border'
          }`}>
            <Label 
              htmlFor="trainer" 
              className="flex items-center space-x-3 cursor-pointer w-full"
            >
              <RadioGroupItem value="trainer" id="trainer" />
              <Dumbbell className="h-5 w-5 text-secondary" />
              <div>
                <div className="font-medium text-primary">Personal Trainer</div>
                <div className="text-sm text-secondary">Manage clients and create workout plans</div>
              </div>
            </Label>
          </Card>
        </div>
      </RadioGroup>
    </div>
  );
};