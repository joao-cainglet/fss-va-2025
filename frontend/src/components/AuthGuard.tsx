import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import { useIsAuthenticated } from '@azure/msal-react';

const AuthGuard = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const path = sessionStorage.getItem('path') || '/app';
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? null : <LandingPage />;
};

export default AuthGuard;
