import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

const mockChartData = [
  { name: 'T2', users: 400, revenue: 2400 },
  { name: 'T3', users: 300, revenue: 1398 },
  { name: 'T4', users: 200, revenue: 9800 },
  { name: 'T5', users: 278, revenue: 3908 },
  { name: 'T6', users: 189, revenue: 4800 },
  { name: 'T7', users: 239, revenue: 3800 },
  { name: 'CN', users: 349, revenue: 4300 },
];

const stats = [
  { label: 'Tổng Học sinh', value: '1,234', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
  { label: 'Khóa học', value: '12', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-100' },
  { label: 'Doanh thu (tháng)', value: '45.2M', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100' },
  { label: 'Tỷ lệ hoàn thành', value: '68%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-100' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-brandDark font-poppins">Dashboard Overview</h1>
        <p className="text-sm text-secondaryText mt-1">Xin chào, đây là tình hình hoạt động của hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-grayBorder shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-secondaryText font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-brandDark mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-grayBorder shadow-sm">
          <h3 className="text-lg font-bold text-brandDark font-poppins mb-6">Tăng trưởng người dùng</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#566681', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#566681', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <Bar dataKey="users" fill="#0060FD" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-grayBorder shadow-sm">
          <h3 className="text-lg font-bold text-brandDark font-poppins mb-6">Doanh thu</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#566681', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#566681', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <Bar dataKey="revenue" fill="#34A853" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
