import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockCourses = [
  { id: '1', title: 'English for Absolute Beginners', level: 'Beginner', price: 199000, status: 'Published', students: 120 },
  { id: '2', title: 'Everyday English Communication', level: 'Beginner', price: 299000, status: 'Published', students: 85 },
  { id: '3', title: 'English Grammar Foundation', level: 'Intermediate', price: 399000, status: 'Draft', students: 0 },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(mockCourses);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brandDark font-poppins">Quản lý Khóa học</h1>
          <p className="text-sm text-secondaryText mt-1">Danh sách tất cả các khóa học trên hệ thống.</p>
        </div>
        <button className="flex items-center gap-2 bg-actionBlue text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-actionBlueHover active:bg-[#003FA8] transition-colors">
          <Plus size={16} />
          <span>Thêm Khóa học</span>
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-grayBorder flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học..." 
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
                <th className="p-4 font-semibold">Tên Khóa học</th>
                <th className="p-4 font-semibold">Cấp độ</th>
                <th className="p-4 font-semibold">Học phí</th>
                <th className="p-4 font-semibold">Học viên</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grayBorder">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-offWhite3 transition-colors group">
                  <td className="p-4 text-sm font-medium text-brandDark">
                    <Link to={`/admin/courses/${course.id}`} className="hover:text-actionBlue transition-colors">
                      {course.title}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-secondaryText">{course.level}</td>
                  <td className="p-4 text-sm text-secondaryText">{course.price.toLocaleString()}đ</td>
                  <td className="p-4 text-sm text-secondaryText">{course.students}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.status === 'Published' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]' : 'bg-[#F9FAFB] text-secondaryText border border-grayBorder'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-actionBlue hover:bg-[#FAFCFE] rounded-full transition-colors" title="Chỉnh sửa">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-[#FF6B6B] hover:bg-[#FFE5E5] rounded-full transition-colors" title="Xóa">
                        <Trash2 size={16} />
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
