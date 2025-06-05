
import React from 'react';
import Calendar from '../components/Calendar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Track your fitness journey with AI-powered insights</p>
          </div>
          
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default Index;
