
import React, { useState } from 'react';
import { Apple } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MealsTableSection = () => {
  const [meals, setMeals] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: ''
  });

  const handleMealChange = (mealType: keyof typeof meals, value: string) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: value
    }));
  };

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snacks', label: 'Snacks', icon: '🍎' }
  ];

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-orange-50 to-amber-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Apple className="w-6 h-6 text-orange-600" />
          Meals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mealTypes.map(({ key, label, icon }) => (
          <div key={key} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="text-lg">{icon}</span>
              {label}
            </label>
            <Input
              value={meals[key as keyof typeof meals]}
              onChange={(e) => handleMealChange(key as keyof typeof meals, e.target.value)}
              placeholder={`What did you have for ${label.toLowerCase()}?`}
              className="border-0 bg-white/70 rounded-xl focus:ring-2 focus:ring-orange-300 transition-all h-12"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MealsTableSection;
