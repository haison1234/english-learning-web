import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { getCurrentUser, UserProfile } from '../../services/authService';
import { useEffect, useState } from 'react';

export default function AdminLayout() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const sessionUser = getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-offWhite1 font-sans text-brandDark">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
