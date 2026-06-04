import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
