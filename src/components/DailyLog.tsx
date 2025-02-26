
import React from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle, Dumbbell, Apple } from "lucide-react";

const DailyLog = () => {
  return (
    <Card className="p-6 animate-slideIn">
      <div className="space-y-6">
        <div>
          <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-success" />
            Workout Log
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-success/10 rounded-lg">
              <div className="font-medium">Bench Press</div>
              <div className="text-sm text-muted-foreground">3 sets × 10 reps</div>
            </div>
            <Button variant="outline" className="w-full" size="sm">
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
              <div className="font-medium">Chicken Breast with Rice</div>
              <div className="text-sm text-muted-foreground">30g protein • 40g carbs • 5g fat</div>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Meal
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DailyLog;
