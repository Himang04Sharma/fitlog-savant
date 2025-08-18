
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    if (profile?.user_type === 'trainer') {
      return '/trainer-dashboard';
    }
    return '/';
  };

  const getDashboardLabel = () => {
    if (profile?.user_type === 'trainer') {
      return 'Trainer Dashboard';
    }
    return 'Dashboard';
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link to={getDashboardLink()} className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-accent" />
          <span className="font-heading text-lg font-bold text-primary">FitLog</span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="scale-75">
            <ThemeToggle />
          </div>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-secondary rounded-full"></div>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {profile?.first_name?.[0]?.toUpperCase() || 
                       profile?.username?.[0]?.toUpperCase() || 
                       user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.username || user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.user_type === 'trainer' ? 'Personal Trainer' : 'Personal User'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{getDashboardLabel()}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default">
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
