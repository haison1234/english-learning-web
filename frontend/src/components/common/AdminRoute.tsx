import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

export default function AdminRoute() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== 0 && user.role !== 'ADMIN') {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
}
