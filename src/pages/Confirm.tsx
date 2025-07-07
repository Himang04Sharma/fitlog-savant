
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const Confirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('Starting email confirmation process...');
        console.log('Search params:', Object.fromEntries(searchParams.entries()));
        
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');

        console.log('Token hash:', token_hash);
        console.log('Type:', type);
        console.log('Access token present:', !!access_token);
        console.log('Refresh token present:', !!refresh_token);

        // Check if user is already authenticated
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          console.log('User already authenticated, showing success');
          setStatus('success');
          setMessage('Your email has been confirmed and you are now logged in!');
          return;
        }

        // If we have access and refresh tokens, set the session directly
        if (access_token && refresh_token) {
          console.log('Setting session with tokens...');
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          if (error) {
            console.error('Session error:', error);
            // Check if it's a token already used error
            if (error.message.includes('already been consumed') || error.message.includes('already used')) {
              setStatus('success');
              setMessage('Your email has already been confirmed! You can now log in to your account.');
            } else {
              setStatus('error');
              setMessage('Failed to confirm your email. The link may have expired. Please try signing up again.');
            }
          } else if (data.user) {
            console.log('Session set successfully:', data.user);
            setStatus('success');
            setMessage('Your email has been confirmed successfully! You are now logged in.');
          } else {
            setStatus('error');
            setMessage('Confirmation failed. Please try again.');
          }
          return;
        }

        // Fallback to token hash verification if available
        if (token_hash && type) {
          console.log('Using token hash verification...');
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error('OTP verification error:', error);
            // Check for specific error types
            if (error.message.includes('already been consumed') || error.message.includes('already used')) {
              setStatus('success');
              setMessage('Your email has already been confirmed! You can now log in to your account.');
            } else if (error.message.includes('expired')) {
              setStatus('error');
              setMessage('The confirmation link has expired. Please request a new confirmation email.');
            } else {
              setStatus('error');
              setMessage('The confirmation link is invalid or has already been used. Please try signing up again or request a new confirmation email.');
            }
          } else if (data.user) {
            console.log('OTP verification successful:', data.user);
            setStatus('success');
            setMessage('Your email has been confirmed successfully! You can now log in.');
          } else {
            setStatus('error');
            setMessage('Confirmation failed. Please try again.');
          }
          return;
        }

        // If no relevant parameters found
        console.log('No confirmation parameters found');
        setStatus('error');
        setMessage('Invalid confirmation link. Please check your email and try again, or request a new confirmation email.');

      } catch (error) {
        console.error('Unexpected error during confirmation:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again or contact support.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary p-4">
      <Card className="w-full max-w-md bg-card border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 text-accent animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            {status === 'loading' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Issue'}
          </CardTitle>
          <CardDescription className="text-secondary">
            {status === 'loading' && 'Please wait while we confirm your email address.'}
            {status === 'success' && 'Welcome! Your account is ready to use.'}
            {status === 'error' && 'There was an issue with your confirmation link.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={status === 'error' ? 'destructive' : 'default'}>
            <AlertDescription className={status === 'error' ? 'text-red-700' : 'text-primary'}>
              {message}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-2">
            {status === 'success' && (
              <Button onClick={handleGoHome} className="w-full bg-accent hover:bg-accent/90">
                Continue to App
              </Button>
            )}
            <Button 
              variant={status === 'success' ? 'outline' : 'default'} 
              onClick={handleGoToLogin} 
              className="w-full"
            >
              {status === 'success' ? 'Login with Different Account' : 'Go to Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Confirm;
