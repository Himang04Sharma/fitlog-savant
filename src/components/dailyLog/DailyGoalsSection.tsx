
import React, { useState, useEffect } from 'react';
import { Target, Plus, X, Droplet, TrendingUp, TrendingDown, Footprints, Scale, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyGoalsSectionProps {
  goals?: string[];
  waterIntake?: string;
  steps?: string;
  weight?: string;
  onGoalsChange?: (goals: string[]) => void;
  onWaterIntakeChange?: (value: string) => void;
  onStepsChange?: (value: string) => void;
  onWeightChange?: (value: string) => void;
}

const DailyGoalsSection = ({
  goals = [''],
  waterIntake = '',
  steps = '',
  weight = '',
  onGoalsChange,
  onWaterIntakeChange,
  onStepsChange,
  onWeightChange
}: DailyGoalsSectionProps) => {
  const [completedGoals, setCompletedGoals] = useState<boolean[]>(goals.map(() => false));
  const [animatingWater, setAnimatingWater] = useState<number | null>(null);

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    onGoalsChange?.(newGoals);
  };

  const toggleGoalCompletion = (index: number) => {
    const newCompleted = [...completedGoals];
    newCompleted[index] = !newCompleted[index];
    setCompletedGoals(newCompleted);
  };

  const addGoal = () => {
    onGoalsChange?.([...goals, '']);
    setCompletedGoals([...completedGoals, false]);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      const newGoals = goals.filter((_, i) => i !== index);
      const newCompleted = completedGoals.filter((_, i) => i !== index);
      onGoalsChange?.(newGoals);
      setCompletedGoals(newCompleted);
    }
  };

  const handleDropletClick = (index: number) => {
    const currentWater = parseInt(waterIntake) || 0;
    const newWater = currentWater === index + 1 ? index : index + 1;
    onWaterIntakeChange?.(newWater.toString());
    setAnimatingWater(index);
    setTimeout(() => setAnimatingWater(null), 300);
  };

  const currentWaterCount = parseInt(waterIntake) || 0;
  const waterPercentage = (currentWaterCount / 8) * 100;
  const stepsCount = parseInt(steps) || 0;
  const weightValue = parseFloat(weight) || 0;

  // Calculate completion percentage
  const completionRate = goals.length > 0 ? (completedGoals.filter(Boolean).length / goals.length) * 100 : 0;

  return (
    <Card className="rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-3xl group">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
      
      <CardHeader className="pb-6 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Today's Goals
              </span>
              <div className="text-sm font-normal text-gray-600 mt-1">
                {completedGoals.filter(Boolean).length} of {goals.length} completed
              </div>
            </div>
          </CardTitle>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionRate / 100)}`}
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">{Math.round(completionRate)}%</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 relative z-10 p-8">
        {/* Goals Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
            <label className="text-lg font-semibold text-gray-800 tracking-wide">Daily Goals</label>
          </div>
          
          {goals.map((goal, index) => (
            <div key={index} className="group/goal relative">
              <div className="flex gap-3 items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <button
                  onClick={() => toggleGoalCompletion(index)}
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
                  onChange={(e) => handleGoalChange(index, e.target.value)}
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
                    onClick={() => removeGoal(index)}
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
            onClick={addGoal}
            className="w-full h-14 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-600 font-semibold transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Goal
          </Button>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-emerald-200/50">
          
          {/* Water Intake with Wave Animation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Water Intake</label>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{currentWaterCount}/8</div>
                <div className="text-sm text-gray-600">glasses</div>
              </div>
            </div>
            
            {/* Water Progress Container */}
            <div className="relative bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 overflow-hidden">
              {/* Animated Wave Background */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-1000 ease-out rounded-2xl animate-pulse"
                style={{ height: `${waterPercentage}%` }}
              />
              
              {/* Droplet Icons */}
              <div className="relative z-10 flex gap-3 justify-center">
                {Array.from({ length: 8 }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDropletClick(index)}
                    className={`transition-all duration-300 hover:scale-125 ${
                      animatingWater === index ? 'animate-bounce' : ''
                    }`}
                  >
                    <Droplet 
                      className={`w-7 h-7 transition-colors duration-300 ${
                        index < currentWaterCount 
                          ? 'text-blue-500 fill-blue-500 drop-shadow-lg' 
                          : 'text-white fill-white hover:text-blue-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">
                <span className={`${waterPercentage >= 100 ? 'text-green-600 font-bold' : 'text-blue-600'}`}>
                  {Math.round(waterPercentage)}% of daily target
                </span>
              </div>
            </div>
          </div>

          {/* Steps with Progress Arc */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Footprints className="w-5 h-5 text-white" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Steps Today</label>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{stepsCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">steps</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
              <Input
                type="number"
                value={steps}
                onChange={(e) => onStepsChange?.(e.target.value)}
                placeholder="Enter today's step count"
                className="border-0 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-300 transition-all h-12 text-center text-lg font-semibold"
              />
              <div className="mt-3 text-center">
                <div className="text-sm text-gray-600">
                  Goal: 10,000 steps • 
                  <span className={`ml-1 font-semibold ${
                    stepsCount >= 10000 ? 'text-green-600' : 'text-purple-600'
                  }`}>
                    {stepsCount >= 10000 ? 'Goal Achieved! 🎉' : `${10000 - stepsCount} more to go`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Weight with Trend Indicator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <label className="text-lg font-semibold text-gray-800">Weight Today</label>
              </div>
              <div className="text-right flex items-center gap-2">
                <div className="text-2xl font-bold text-amber-600">{weightValue || '--'}</div>
                <div className="text-sm text-gray-600">kg</div>
                {weightValue > 0 && (
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-4">
              <Input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => onWeightChange?.(e.target.value)}
                placeholder="Enter your weight in kg"
                className="border-0 bg-white/70 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-amber-300 transition-all h-12 text-center text-lg font-semibold"
              />
              <div className="mt-3 text-center text-sm text-gray-600">
                Track your progress over time
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalsSection;
