
import React from 'react';

const CalendarLegend = () => {
  return (
    <div className="flex gap-6 justify-center">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--accent-green)' }} />
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Workout</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--accent-green)' }} />
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Meals</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
