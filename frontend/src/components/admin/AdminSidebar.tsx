import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Bell, Tag } from 'lucide-react';

export default function AdminSidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Khóa học', path: '/admin/courses', icon: BookOpen },
    { name: 'Người dùng', path: '/admin/users', icon: Users },
    { name: 'Thông báo', path: '/admin/notifications', icon: Bell },
    { name: 'Mã giảm giá', path: '/admin/coupons', icon: Tag },
  ];

  return (
    <aside className="w-64 bg-brandDark text-white flex flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-grayBorder/20">
        <span className="font-poppins text-lg font-bold tracking-tight">
          <span className="text-actionBlue">Admin</span>.Panel
        </span>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? 'bg-actionBlue text-white'
                  : 'text-secondaryText hover:bg-grayBorder/10 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
