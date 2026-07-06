import { useState } from 'react';
import { Search, Filter, Lock, Unlock, Eye } from 'lucide-react';

const mockUsers = [
  { id: 'u1', name: 'Nguyễn Văn A', email: 'nva@gmail.com', role: 'STUDENT', status: 'ACTIVE', joinedDate: '2023-10-15' },
  { id: 'u2', name: 'Trần Thị B', email: 'ttb@gmail.com', role: 'STUDENT', status: 'INACTIVE', joinedDate: '2023-11-20' },
  { id: 'u3', name: 'Lê Văn C', email: 'lvc@gmail.com', role: 'STUDENT', status: 'ACTIVE', joinedDate: '2024-01-05' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brandDark font-poppins">Quản lý Người dùng</h1>
          <p className="text-sm text-secondaryText mt-1">Quản lý tài khoản học viên và phân quyền.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-grayBorder flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, email..." 
              className="w-full pl-9 pr-4 py-2 border border-grayBorder rounded-lg text-sm focus:border-actionBlue focus:ring-1 focus:ring-actionBlue outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-grayBorder rounded-lg text-sm font-medium hover:bg-offWhite1 transition-colors">
            <Filter size={16} />
            <span>Lọc</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-offWhite1 text-secondaryText text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Người dùng</th>
                <th className="p-4 font-semibold">Vai trò</th>
                <th className="p-4 font-semibold">Ngày tham gia</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grayBorder">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-offWhite3 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-actionBlue text-white flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brandDark">{user.name}</p>
                        <p className="text-xs text-secondaryText">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-secondaryText">{user.role}</td>
                  <td className="p-4 text-sm text-secondaryText">{user.joinedDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'ACTIVE' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]' : 'bg-[#FFE5E5] text-[#FF6B6B] border border-[#FFCCCC]'
                    }`}>
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-actionBlue hover:bg-[#FAFCFE] rounded-full transition-colors" title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => toggleStatus(user.id)}
                        className={`p-2 rounded-full transition-colors ${
                          user.status === 'ACTIVE' ? 'text-[#FF6B6B] hover:bg-[#FFE5E5]' : 'text-[#2E7D32] hover:bg-[#E8F5E9]'
                        }`} 
                        title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {user.status === 'ACTIVE' ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
