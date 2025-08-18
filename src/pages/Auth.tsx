import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserTypeSelector } from '@/components/ui/user-type-selector';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Check, X, User, Phone, Award, BookOpen } from 'lucide-react';

const Auth = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [certification, setCertification] = useState('');
  const [bio, setBio] = useState('');
  const [userType, setUserType] = useState<'normal_user' | 'trainer'>('normal_user');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Validation state
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

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

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setSpecialization('');
    setCertification('');
    setBio('');
    setUserType('normal_user');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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

    // Validate trainer-specific fields
    if (userType === 'trainer') {
      if (!firstName || !lastName) {
        toast({
          title: "Error",
          description: "First name and last name are required for trainers",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setLoading(true);
      
      const { error } = await signUp({
        email,
        password,
        userType,
        firstName,
        lastName,
        phone,
        specialization,
        certification,
        bio
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to confirm your account.",
      });
      
      resetForm();
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
      
      const { error } = await signIn(email, password);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      navigate('/');
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
    <div className="flex justify-center items-center min-h-screen bg-primary p-4 relative overflow-hidden animate-fadeIn">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-2xl relative z-10 shadow-2xl border bg-card backdrop-blur-sm animate-slideIn">
        <CardHeader className="space-y-4 text-center pb-6">
          <CardTitle className="text-3xl font-bold text-primary tracking-tight">
            Track your fitness journey with ease
          </CardTitle>
          <CardDescription className="text-base text-secondary font-medium">
            Welcome to your personal fitness companion
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-secondary/10 rounded-xl h-12">
              <TabsTrigger 
                value="login" 
                className="rounded-lg font-semibold transition-all duration-300 data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:shadow-lg text-secondary hover:text-primary hover:bg-secondary/20"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="rounded-lg font-semibold transition-all duration-300 data-[state=active]:bg-accent data-[state=active]:text-white data-[state=active]:shadow-lg text-secondary hover:text-primary hover:bg-secondary/20"
              >
                Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-12 pr-10 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card ${
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
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-12 pr-16 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card ${
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
                        className="text-secondary hover:text-primary transition-colors"
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
                      className="rounded border-secondary"
                    />
                    <Label htmlFor="remember" className="text-sm text-secondary cursor-pointer">
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
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
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
                {/* User Type Selection */}
                <UserTypeSelector
                  value={userType}
                  onChange={setUserType}
                  disabled={loading}
                />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-12 pr-10 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card ${
                          email && (emailValid ? 'border-green-400' : 'border-red-400')
                        }`}
                        disabled={loading}
                        required
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
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                      <Input
                        type="tel"
                        placeholder="Phone number (optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-12 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                      <Input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-12 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card"
                        disabled={loading}
                        required={userType === 'trainer'}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                      <Input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-12 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card"
                        disabled={loading}
                        required={userType === 'trainer'}
                      />
                    </div>
                  </div>
                </div>

                {/* Trainer-specific fields */}
                {userType === 'trainer' && (
                  <div className="space-y-4 p-4 bg-accent/5 rounded-xl border border-accent/20">
                    <h4 className="font-semibold text-primary flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Trainer Information
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="relative group">
                          <Award className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                          <Input
                            type="text"
                            placeholder="Specialization (e.g., Weight Loss, Strength Training)"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="pl-12 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative group">
                          <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                          <Input
                            type="text"
                            placeholder="Certification (e.g., NASM, ACE, ACSM)"
                            value={certification}
                            onChange={(e) => setCertification(e.target.value)}
                            className="pl-12 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-secondary">Professional Bio</Label>
                      <Textarea
                        placeholder="Tell potential clients about your experience and approach..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="min-h-[100px] border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card resize-none"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Password fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-12 pr-16 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card ${
                          password && (passwordValid ? 'border-green-400' : 'border-red-400')
                        }`}
                        disabled={loading}
                        required
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
                          className="text-secondary hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary group-focus-within:text-accent transition-colors duration-200" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-12 pr-16 h-12 border-2 rounded-xl transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-lg hover:border-secondary bg-card ${
                          confirmPassword && (confirmPasswordValid ? 'border-green-400' : 'border-red-400')
                        }`}
                        disabled={loading}
                        required
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
                          className="text-secondary hover:text-primary transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
                  disabled={loading}
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Creating account..." : "Create Account"} 
                    {!loading && <ArrowRight className="h-5 w-5" />}
                  </span>
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;