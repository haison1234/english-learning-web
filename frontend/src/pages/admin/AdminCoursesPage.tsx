import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getAdminCourses, createCourse, updateCourseStatus,
  type CourseDTO, type CreateCourseRequestDTO, LEVEL_MAP,
} from '../../services/adminService';

const LEVEL_OPTIONS = [
  { value: 0, label: 'Beginner' },
  { value: 1, label: 'Intermediate' },
  { value: 2, label: 'Advanced' },
];

const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PUBLISHED: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    DRAFT: 'bg-[#F9FAFB] text-secondaryText border-grayBorder',
    ARCHIVED: 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${map[status] ?? map.DRAFT}`}>
      {status}
    </span>
  );
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CreateCourseRequestDTO>({
    title: '', level: 0, price: 0, description: '', thumbnailUrl: '', trailerUrl: '',
  });
  const [formError, setFormError] = useState('');

  const fetchCourses = () => {
    setLoading(true);
    getAdminCourses()
      .then(setCourses)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.title.trim()) { setFormError('Tiêu đề không được để trống.'); return; }
    setSaving(true); setFormError('');
    try {
      const created = await createCourse(form);
      setCourses(prev => [created, ...prev]);
      setShowModal(false);
      setForm({ title: '', level: 0, price: 0, description: '', thumbnailUrl: '', trailerUrl: '' });
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Tạo khóa học thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateCourseStatus(id, status);
      setCourses(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Cập nhật trạng thái thất bại.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brandDark font-poppins">Quản lý Khóa học</h1>
          <p className="text-sm text-secondaryText mt-1">Danh sách tất cả các khóa học trên hệ thống.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-actionBlue text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#004FD8] active:bg-[#003FA8] transition-colors"
        >
          <Plus size={16} /> Thêm Khóa học
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm overflow-hidden">
        <div className="p-4 border-b border-grayBorder flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-offWhite1 text-secondaryText text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Tên Khóa học</th>
                  <th className="p-4 font-semibold">Cấp độ</th>
                  <th className="p-4 font-semibold">Học phí</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grayBorder">
                {filtered.map(course => (
                  <tr key={course.id} className="hover:bg-offWhite3 transition-colors group">
                    <td className="p-4 text-sm font-medium text-brandDark">
                      <Link to={`/admin/courses/${course.id}`} className="hover:text-actionBlue transition-colors">
                        {course.title}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-secondaryText">{LEVEL_MAP[course.level] ?? course.level}</td>
                    <td className="p-4 text-sm text-secondaryText">
                      {course.basePrice > 0 ? `${course.basePrice.toLocaleString()}đ` : 'Miễn phí'}
                    </td>
                    <td className="p-4">
                      <select
                        value={course.status}
                        onChange={e => handleStatusChange(course.id, e.target.value)}
                        className="text-xs font-semibold border-0 bg-transparent cursor-pointer focus:ring-0 outline-none"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/courses/${course.id}`}
                          className="p-2 text-actionBlue hover:bg-[#FAFCFE] rounded-full transition-colors"
                          title="Quản lý nội dung"
                        >
                          <Edit2 size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-secondaryText text-sm">
                      Không có khóa học nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-lg p-8 shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-offWhite1 rounded-full transition-colors"
            >
              <X size={20} className="text-secondaryText" />
            </button>
            <h2 className="text-xl font-bold text-brandDark font-poppins mb-6">Tạo Khóa học mới</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-brandDark block mb-1">Tên khóa học *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Nhập tên khóa học..."
                  className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-brandDark block mb-1">Cấp độ</label>
                  <select
                    value={form.level}
                    onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none bg-white"
                  >
                    {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-brandDark block mb-1">Học phí (đ)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    placeholder="0 = Miễn phí"
                    className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-brandDark block mb-1">Mô tả</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Mô tả ngắn về khóa học..."
                  className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none resize-none"
                />
              </div>
              {formError && <p className="text-[#FF6B6B] text-sm">{formError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-sm font-semibold text-secondaryText hover:bg-offWhite1 rounded-full transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex items-center gap-2 bg-actionBlue text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#004FD8] disabled:opacity-60 transition-colors"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Đang tạo...' : 'Tạo khóa học'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
