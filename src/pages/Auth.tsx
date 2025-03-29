
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loading } from '@/components/ui/loading';

const Auth = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Set initial tab based on URL search params
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'login';
  });
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Update URL when tab changes
  useEffect(() => {
    const newUrl = `${location.pathname}?tab=${activeTab}`;
    window.history.replaceState(null, '', newUrl);
  }, [activeTab, location.pathname]);

  // Handle authenticated state
  useEffect(() => {
    if (user && !isLoading) {
      const from = location.state?.from?.pathname || '/workspaces';
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loading text="Checking authentication..." size="lg" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">FluidDocs</CardTitle>
          <CardDescription>
            {activeTab === 'login' 
              ? 'Welcome back! Sign in to continue.'
              : 'Create an account to get started.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-0">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
