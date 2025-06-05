
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500"
      style={{
        backgroundColor: theme === 'dark' ? 'var(--accent-green)' : '#E5E5E5'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      <Sun
        className={`absolute left-1 h-3 w-3 transition-opacity duration-300 ${
          theme === 'light' ? 'opacity-100 text-yellow-500' : 'opacity-0'
        }`}
      />
      <Moon
        className={`absolute right-1 h-3 w-3 transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-100 text-white' : 'opacity-0'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
