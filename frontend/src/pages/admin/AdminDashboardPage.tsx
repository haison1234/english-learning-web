import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, DollarSign, Tag } from 'lucide-react';
import { getAdminCourses, getAdminUsers, getAdminCoupons, type CourseDTO } from '../../services/adminService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, courses: 0, coupons: 0 });
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminUsers(0, 1),
      getAdminCourses(),
      getAdminCoupons(),
    ]).then(([usersPage, coursesData, couponsData]) => {
      setStats({
        users: usersPage.totalElements,
        courses: coursesData.length,
        coupons: couponsData.filter(c => c.status === 'ACTIVE').length,
      });
      setCourses(coursesData);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Build chart data from courses: count by level
  const chartData = [
    { name: 'Beginner', courses: courses.filter(c => c.level === 0).length },
    { name: 'Intermediate', courses: courses.filter(c => c.level === 1).length },
    { name: 'Advanced', courses: courses.filter(c => c.level === 2).length },
  ];

  const publishedCourses = courses.filter(c => c.status === 'PUBLISHED');
  const totalRevenuePotential = publishedCourses.reduce((sum, c) => sum + (c.basePrice || 0), 0);

  const statCards = [
    { label: 'Tổng học viên', value: loading ? '...' : stats.users.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Khóa học', value: loading ? '...' : stats.courses.toString(), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Tổng giá trị (đ)', value: loading ? '...' : (totalRevenuePotential / 1000).toFixed(0) + 'K', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Mã đang hoạt động', value: loading ? '...' : stats.coupons.toString(), icon: Tag, color: 'text-orange-500', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-brandDark font-poppins">Dashboard Overview</h1>
        <p className="text-sm text-secondaryText mt-1">Tổng quan hoạt động của hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-grayBorder shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg} ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-secondaryText font-medium">{s.label}</p>
              <h3 className="text-2xl font-bold text-brandDark mt-1">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-grayBorder shadow-sm">
          <h3 className="text-lg font-bold text-brandDark font-poppins mb-6">Phân bổ Khóa học theo Cấp độ</h3>
          {loading ? (
            <div className="h-72 flex items-center justify-center text-secondaryText">Đang tải...</div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#566681', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#566681', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                  <Bar dataKey="courses" fill="#0060FD" radius={[4, 4, 0, 0]} barSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-grayBorder shadow-sm">
          <h3 className="text-lg font-bold text-brandDark font-poppins mb-4">Khóa học mới nhất</h3>
          {loading ? (
            <div className="text-secondaryText text-sm">Đang tải...</div>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-grayBorder last:border-0">
                  <div>
                    <p className="text-sm font-medium text-brandDark">{c.title}</p>
                    <p className="text-xs text-secondaryText mt-0.5">{c.basePrice?.toLocaleString()}đ</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    c.status === 'PUBLISHED'
                      ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                      : c.status === 'DRAFT'
                      ? 'bg-[#F9FAFB] text-secondaryText border-grayBorder'
                      : 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]'
                  }`}>{c.status}</span>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-secondaryText text-sm py-4 text-center">Chưa có khóa học nào.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
