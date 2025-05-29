
import React, { useState } from 'react';
import { Target, Droplet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DailyGoalsSection = () => {
  const [goals, setGoals] = useState(['', '', '']);
  const [waterIntake, setWaterIntake] = useState(0);
  const [steps, setSteps] = useState('');
  const [weight, setWeight] = useState('');

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleWaterClick = (index: number) => {
    setWaterIntake(index + 1);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Target className="w-6 h-6 text-emerald-600" />
            Today's Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <Input
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                placeholder={`Goal ${index + 1}`}
                className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-emerald-300 transition-all"
              />
            </div>
          ))}
          
          <div className="pt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Water Intake (8 glasses = 4L)</p>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 8 }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleWaterClick(index)}
                    className={`p-2 rounded-lg transition-all hover:scale-110 ${
                      index < waterIntake
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-400 hover:bg-blue-100'
                    }`}
                  >
                    <Droplet className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Steps Today</label>
                <Input
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="10,000"
                  className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Weight Today</label>
                <Input
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70 kg"
                  className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyGoalsSection;
