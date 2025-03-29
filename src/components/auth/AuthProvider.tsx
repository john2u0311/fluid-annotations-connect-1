
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

// Create a context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Security constants
const SESSION_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds
const AUTH_STORAGE_KEY = 'fluid-docs-auth-state'; // Key for localStorage

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to refresh the session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.error('Failed to refresh session:', error);
      // If refresh fails, clear the session
      setSession(null);
      setUser(null);
    }
  }, []);

  // Setup session refresh timer when session changes
  useEffect(() => {
    if (session?.expires_at) {
      const expiresAt = session.expires_at * 1000; // Convert to milliseconds
      const timeUntilExpiry = expiresAt - Date.now() - SESSION_EXPIRY_BUFFER;
      
      if (timeUntilExpiry <= 0) {
        // Session is already expired or about to expire, refresh now
        refreshSession();
        return;
      }
      
      // Set timer to refresh before expiry
      const refreshTimer = setTimeout(refreshSession, timeUntilExpiry);
      return () => clearTimeout(refreshTimer);
    }
  }, [session, refreshSession]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Use setTimeout to avoid potential deadlocks when fetching additional data
      if (currentSession?.user && event === 'SIGNED_IN') {
        setTimeout(() => {
          // Check if we're not already on the workspaces page to prevent navigation loops
          if (location.pathname !== '/workspaces' && location.pathname !== '/') {
            navigate('/workspaces');
          }
        }, 0);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Retrieved session:', currentSession ? 'exists' : 'none');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Successfully signed in",
        description: "Welcome back!",
      });
      
      console.log('Sign in successful:', data.user?.email);
    } catch (error: any) {
      console.error('Sign in failed:', error.message);
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
      
      console.log('Sign up successful:', data.user?.email);
    } catch (error: any) {
      console.error('Sign up failed:', error.message);
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again with a different email",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any locally stored data
      localStorage.removeItem(AUTH_STORAGE_KEY);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      navigate('/auth');
    } catch (error: any) {
      console.error('Sign out failed:', error.message);
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const authValue = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshSession
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
