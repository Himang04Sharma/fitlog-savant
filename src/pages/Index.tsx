
import React from 'react';
import Calendar from '../components/Calendar';
import DailyLog from '../components/DailyLog';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-4xl font-bold text-primary">FitLog Savant</h1>
            <p className="text-muted-foreground">Track your fitness journey with AI-powered insights</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Calendar />
            <DailyLog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
