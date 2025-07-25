// src/components/RequireAuth.tsx
import { useIsAuthenticated } from '@azure/msal-react';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout'; // Import your main Layout

function RequireAuth() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    // state={{ from: location }} is optional, but good for redirecting back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the Layout which contains the <Outlet />
  // for child routes to render into.
  return <Layout />;
}

export default RequireAuth;
