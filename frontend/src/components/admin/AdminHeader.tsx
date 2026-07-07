import { UserProfile, logoutUser } from '../../services/authService';
import { LogOut, User } from 'lucide-react';

export default function AdminHeader({ user }: { user: UserProfile | null }) {
  const handleLogout = () => {
    logoutUser();
    window.location.href = '/';
  };

  return (
    <header className="h-16 bg-white border-b border-grayBorder flex items-center justify-between px-8 z-10 sticky top-0">
      <div className="text-brandDark font-semibold text-lg">
        {/* Breadcrumb or Page Title can go here */}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-sm font-medium text-brandDark">
          <div className="w-8 h-8 rounded-full bg-offWhite1 border border-grayBorder flex items-center justify-center text-actionBlue overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={16} />
            )}
          </div>
          <span>{user?.fullName || 'Admin'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-full flex items-center justify-center text-secondaryText hover:text-actionBlue hover:bg-offWhite1 transition-colors"
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
