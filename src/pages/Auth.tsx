import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    return password === confirmPassword && password.length > 0;
  };

  // Update validation states
  useEffect(() => {
    setEmailValid(validateEmail(email));
    setPasswordValid(validatePassword(password));
    setConfirmPasswordValid(validateConfirmPassword(password, confirmPassword));
  }, [email, password, confirmPassword]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      console.log('Attempting Google sign in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
      
      console.log('Google sign in initiated:', data);
      
      // The user will be redirected to Google, so we don't need to show success message here
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Use the current origin for email redirect
      const redirectTo = `${window.location.origin}/confirm`;
      console.log('Email redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to confirm your account.",
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log('Attempting sign in...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log('Sign in successful:', data);
      
      if (data.user) {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    try {
      const redirectTo = `${window.location.origin}/auth`;
      console.log('Password reset redirect URL:', redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password reset email sent! Check your inbox.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4 relative overflow-hidden animate-fadeIn">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border bg-card backdrop-blur-sm animate-slideIn">
        <CardHeader className="space-y-4 text-center pb-6">
          <CardTitle className="text-3xl font-bold text-foreground tracking-tight">
            Track your fitness journey with ease
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground font-medium">
            Welcome to your personal fitness companion
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/20 rounded-xl h-12">
              <TabsTrigger 
                value="login" 
                className="rounded-lg font-semibold transition-all duration-300 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground hover:bg-muted/20"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="rounded-lg font-semibold transition-all duration-300 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground hover:bg-muted/20"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Google Sign In Button - Available on both tabs */}
            <div className="space-y-4 mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="flex items-center justify-center gap-3">
                  {googleLoading ? (
                    "Connecting to Google..."
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </div>
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </div>
            
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-200" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-12 pr-10 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-muted-foreground bg-background ${
                        email && (emailValid ? 'border-green-400' : 'border-red-400')
                      }`}
                      disabled={loading}
                    />
                    {email && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {emailValid ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-200" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-12 pr-16 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-muted-foreground bg-background ${
                        password && (passwordValid ? 'border-green-400' : 'border-red-400')
                      }`}
                      disabled={loading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {password && (
                        passwordValid ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className="rounded border-muted"
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-accent hover:text-accent/80 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                  disabled={loading}
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Signing in..." : "Sign In"} 
                    {!loading && <ArrowRight className="h-5 w-5" />}
                  </span>
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-0">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-200" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-12 pr-10 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-muted-foreground bg-background ${
                        email && (emailValid ? 'border-green-400' : 'border-red-400')
                      }`}
                      disabled={loading}
                    />
                    {email && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {emailValid ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-200" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-12 pr-16 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-muted-foreground bg-background ${
                        password && (passwordValid ? 'border-green-400' : 'border-red-400')
                      }`}
                      disabled={loading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {password && (
                        passwordValid ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors duration-200" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-12 pr-16 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-muted-foreground bg-background ${
                        confirmPassword && (confirmPasswordValid ? 'border-green-400' : 'border-red-400')
                      }`}
                      disabled={loading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {confirmPassword && (
                        confirmPasswordValid ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                  disabled={loading}
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Creating account..." : "Create account"}
                    {!loading && <ArrowRight className="h-5 w-5" />}
                  </span>
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col pt-4 border-t border-border">
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
