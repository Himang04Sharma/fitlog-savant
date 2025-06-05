
import React from 'react';
import Calendar from '../components/Calendar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  FitLog Savant
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Build strength, eat smart, stay consistent.
                </p>
              </div>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
            
            <Calendar />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
