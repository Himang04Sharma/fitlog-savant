
import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import AuthButton from './AuthButton';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-accent" />
          <span className="font-heading text-lg font-bold text-primary">FitLog</span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
