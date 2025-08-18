
import React from 'react';
import Calendar from '../components/Calendar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Build strength, eat smart, stay consistent.
              </h1>
            </div>
            
            <Calendar />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
