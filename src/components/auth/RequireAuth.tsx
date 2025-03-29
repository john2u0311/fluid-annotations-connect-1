
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, isLoading, session, refreshSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = useState(false);

  // Check for session validity
  useEffect(() => {
    if (!isLoading && session) {
      const expiresAt = session.expires_at * 1000; // Convert to milliseconds
      const isExpired = Date.now() >= expiresAt;
      
      // If the session is expired, try to refresh it
      if (isExpired) {
        refreshSession().then(() => {
          setSessionChecked(true);
        });
      } else {
        setSessionChecked(true);
      }
    } else if (!isLoading) {
      setSessionChecked(true);
    }
  }, [isLoading, session, refreshSession]);

  // Redirect to login if user tries to directly access a protected page via URL
  useEffect(() => {
    const preventDirectAccess = async () => {
      if (!isLoading && !user && sessionChecked) {
        navigate('/auth', { state: { from: location }, replace: true });
      }
    };
    
    preventDirectAccess();
  }, [user, isLoading, navigate, location, sessionChecked]);

  if (isLoading || !sessionChecked) {
    // Show loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loading text="Loading your session..." size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
