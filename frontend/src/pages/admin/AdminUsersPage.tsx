import { useEffect, useState } from 'react';
import { Search, Lock, Unlock, Eye, Loader2, X, BookOpen, Calendar } from 'lucide-react';
import {
  getAdminUsers, toggleUserStatus, unlockUser, getUserHistory,
  type UserAdminDTO, type UserHistoryDTO, type PageResponse,
} from '../../services/adminService';

// Hàm kiểm tra trạng thái siêu chuẩn (Chấp hết Backend trả về 'ACTIVE', 'active', số 1 hay '1')
const isUserActive = (status: unknown) => {
  return status === 'ACTIVE' || status === 'active' || status === 1 || status === '1' || status === true;
};

function RoleBadge({ role }: { role: number }) {
  return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
          role === 0
              ? 'bg-[#FAFCFE] text-actionBlue border-[#D1D5DB]'
              : 'bg-[#F9FAFB] text-secondaryText border-grayBorder'
      }`}>
      {role === 0 ? 'Admin' : 'Student'}
    </span>
  );
}

function StatusBadge({ status }: { status: unknown }) {
  const active = isUserActive(status);
  return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          active
              ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
              : 'bg-[#FFE5E5] text-[#FF6B6B] border-[#FFCCCC]'
      }`}>
      {active ? 'Hoạt động' : 'Bị khóa'}
    </span>
  );
}

export default function AdminUsersPage() {
  const [data, setData] = useState<PageResponse<UserAdminDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<UserHistoryDTO | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyUser, setHistoryUser] = useState<string>('');

  const fetchUsers = (p: number) => {
    setLoading(true);
    getAdminUsers(p, 10)
        .then(setData)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(page); }, [page]);

  // Logic xử lý nút bấm chuẩn xác, gọi đúng API dựa trên trạng thái thực tế
  const handleToggleStatus = async (user: UserAdminDTO) => {
    try {
      const active = isUserActive(user.status);
      if (!active) {
        // Nếu đang bị khóa -> Gọi API Mở khóa chuyên dụng
        await unlockUser(user.id);
      } else {
        // Nếu đang hoạt động -> Gọi API Toggle để khóa lại
        await toggleUserStatus(user.id);
      }

      // Tải lại toàn bộ danh sách mới nhất từ Database
      fetchUsers(page);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Thao tác thất bại.');
    }
  };

  const handleViewHistory = async (user: UserAdminDTO) => {
    setHistoryUser(user.fullName);
    setHistoryLoading(true);
    try {
      const h = await getUserHistory(user.id);
      setHistory(h);
    } catch {
      setHistory(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const users = data?.content ?? [];
  const filtered = users.filter(u =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-2xl font-bold text-brandDark font-poppins">Quản lý Người dùng</h1>
          <p className="text-sm text-secondaryText mt-1">
            Quản lý tài khoản học viên
            {data && ` · Tổng: ${data.totalElements} người dùng`}
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm overflow-hidden">
          <div className="p-4 border-b border-grayBorder flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
              <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên, email..."
                  className="w-full pl-9 pr-4 py-2 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
              />
            </div>
          </div>

          {loading ? (
              <div className="flex items-center justify-center py-20 text-secondaryText gap-3">
                <Loader2 size={20} className="animate-spin" /> Đang tải...
              </div>
          ) : error ? (
              <div className="py-10 text-center text-[#FF6B6B] text-sm">{error}</div>
          ) : (
              <>
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
                    {filtered.map(user => {
                      const active = isUserActive(user.status);
                      return (
                          <tr key={user.id} className="hover:bg-offWhite3 transition-colors group">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-actionBlue text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {user.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-brandDark">{user.fullName}</p>
                                  <p className="text-xs text-secondaryText">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4"><RoleBadge role={user.role} /></td>
                            <td className="p-4 text-sm text-secondaryText">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                            </td>
                            <td className="p-4"><StatusBadge status={user.status} /></td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleViewHistory(user)}
                                    className="p-2 text-actionBlue hover:bg-[#FAFCFE] rounded-full transition-colors"
                                    title="Xem lịch sử"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(user)}
                                    className={`p-2 rounded-full transition-colors ${
                                        active
                                            ? 'text-[#FF6B6B] hover:bg-[#FFE5E5]'
                                            : 'text-[#2E7D32] hover:bg-[#E8F5E9]'
                                    }`}
                                    title={active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                >
                                  {active ? <Lock size={16} /> : <Unlock size={16} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-secondaryText text-sm">
                            Không tìm thấy người dùng.
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>

                {data && data.totalPages > 1 && (
                    <div className="p-4 border-t border-grayBorder flex items-center justify-between">
                <span className="text-sm text-secondaryText">
                  Trang {data.number + 1} / {data.totalPages}
                </span>
                      <div className="flex gap-2">
                        <button
                            disabled={data.number === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-sm font-medium border border-grayBorder rounded-full hover:bg-offWhite1 disabled:opacity-40 transition-colors"
                        >
                          Trước
                        </button>
                        <button
                            disabled={data.number >= data.totalPages - 1}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 text-sm font-medium border border-grayBorder rounded-full hover:bg-offWhite1 disabled:opacity-40 transition-colors"
                        >
                          Tiếp
                        </button>
                      </div>
                    </div>
                )}
              </>
          )}
        </div>

        {(history !== null || historyLoading) && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end p-4">
              <div className="bg-white rounded-[24px] w-full max-w-md h-full max-h-[90vh] overflow-y-auto p-6 shadow-xl relative flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-brandDark font-poppins">
                    Lịch sử của {historyUser}
                  </h3>
                  <button
                      onClick={() => { setHistory(null); setHistoryUser(''); }}
                      className="p-2 hover:bg-offWhite1 rounded-full transition-colors"
                  >
                    <X size={20} className="text-secondaryText" />
                  </button>
                </div>
                {historyLoading ? (
                    <div className="flex-1 flex items-center justify-center gap-3 text-secondaryText">
                      <Loader2 size={20} className="animate-spin" /> Đang tải lịch sử...
                    </div>
                ) : history?.enrolledCourses?.length ? (
                    <div className="space-y-3">
                      {history.enrolledCourses.map((c, i) => (
                          <div key={i} className="p-4 border border-grayBorder rounded-xl">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
                                <BookOpen size={14} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-brandDark">{c.courseTitle}</p>
                                <p className="text-xs text-secondaryText flex items-center gap-1 mt-1">
                                  <Calendar size={12} />
                                  {new Date(c.enrolledAt).toLocaleDateString('vi-VN')}
                                </p>
                                <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                    c.paymentStatus === 1
                                        ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                                        : 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]'
                                }`}>
                          {c.paymentStatus === 1 ? 'Đã thanh toán' : 'Miễn phí / Chờ'}
                        </span>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-secondaryText">
                      <BookOpen size={36} className="mb-3 text-grayBorder" />
                      <p className="text-sm">Chưa đăng ký khóa học nào.</p>
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
}