
import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import AuthButton from './AuthButton';

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold">FitLog</span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
