import { useEffect, useState } from 'react';
import { Send, Users, Mail, Bell, Clock, Loader2, AlertCircle } from 'lucide-react';
import {
  sendNotification, getNotificationHistory, getAdminCourses,
  type NotificationRequestDTO, type NotificationResponseDTO, type CourseDTO,
} from '../../services/adminService';

const TYPE_OPTIONS = [
  { value: 0, label: 'In-app Notification', icon: Bell },
  { value: 1, label: 'Email Hàng loạt', icon: Mail },
  { value: 2, label: 'Cả hai', icon: Send },
];

const TYPE_LABEL: Record<number, string> = {
  0: 'In-app',
  1: 'Email',
  2: 'Cả hai',
};

export default function AdminNotificationsPage() {
  const [form, setForm] = useState<NotificationRequestDTO>({
    title: '', content: '', type: 0, targetAudience: 'ALL', courseId: undefined,
  });
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [history, setHistory] = useState<NotificationResponseDTO[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAdminCourses().then(setCourses).catch(console.error);
    getNotificationHistory().then(setHistory).catch(console.error);
  }, []);

  const handleSend = async () => {
    if (!form.title.trim()) { setError('Tiêu đề không được để trống.'); return; }
    if (!form.content.trim()) { setError('Nội dung không được để trống.'); return; }
    if (form.targetAudience === 'COURSE' && !form.courseId) {
      setError('Vui lòng chọn khóa học mục tiêu.'); return;
    }
    setSending(true); setError(''); setSuccess('');
    try {
      const result = await sendNotification(form);
      setHistory(prev => [result, ...prev]);
      setSuccess('Thông báo đã được gửi thành công!');
      setForm({ title: '', content: '', type: 0, targetAudience: 'ALL', courseId: undefined });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gửi thông báo thất bại.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-brandDark font-poppins">Gửi Thông báo</h1>
        <p className="text-sm text-secondaryText mt-1">Gửi thông báo in-app hoặc email hàng loạt đến học viên.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-3 bg-white rounded-[16px] border border-grayBorder shadow-sm p-6 space-y-5">
          <h3 className="text-base font-bold text-brandDark font-poppins">Soạn thông báo mới</h3>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brandDark">Phương thức gửi</label>
            <div className="flex gap-3 flex-wrap">
              {TYPE_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-colors text-sm font-medium ${
                    form.type === opt.value
                      ? 'border-actionBlue bg-[#FAFCFE] text-actionBlue'
                      : 'border-grayBorder hover:border-actionBlue text-secondaryText hover:text-actionBlue'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={opt.value}
                    checked={form.type === opt.value}
                    onChange={() => setForm(f => ({ ...f, type: opt.value }))}
                    className="sr-only"
                  />
                  <opt.icon size={16} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Target audience */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brandDark">Đối tượng nhận</label>
            <div className="relative">
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
              <select
                value={form.targetAudience}
                onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value, courseId: undefined }))}
                className="w-full pl-9 pr-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="ALL">Tất cả học viên</option>
                <option value="COURSE">Theo khóa học cụ thể</option>
              </select>
            </div>
          </div>

          {/* Course picker (conditional) */}
          {form.targetAudience === 'COURSE' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-brandDark">Chọn khóa học</label>
              <select
                value={form.courseId ?? ''}
                onChange={e => setForm(f => ({ ...f, courseId: e.target.value || undefined }))}
                className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">-- Chọn khóa học --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brandDark">Tiêu đề *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Nhập tiêu đề thông báo..."
              className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brandDark">Nội dung *</label>
            <textarea
              rows={5}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Nhập nội dung chi tiết..."
              className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#FFE5E5] border border-[#FFCCCC] rounded-xl text-sm text-[#FF6B6B]">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl text-sm text-[#2E7D32]">
              ✓ {success}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-grayBorder">
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-2 bg-actionBlue text-white px-6 py-3 rounded-full font-semibold hover:bg-[#004FD8] disabled:opacity-60 transition-colors"
            >
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {sending ? 'Đang gửi...' : 'Gửi thông báo'}
            </button>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-grayBorder shadow-sm p-6">
          <h3 className="text-base font-bold text-brandDark font-poppins mb-4">Lịch sử gửi</h3>
          {history.length === 0 ? (
            <div className="py-8 text-center text-secondaryText">
              <Bell size={32} className="mx-auto mb-3 text-grayBorder" />
              <p className="text-sm">Chưa có lịch sử thông báo.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {history.map(h => (
                <div key={h.id} className="p-4 border border-grayBorder rounded-xl">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-brandDark">{h.title}</h4>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FAFCFE] text-actionBlue border border-[#D1D5DB]">
                      {TYPE_LABEL[h.type] ?? 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-secondaryText line-clamp-2">{h.content}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-secondaryText">
                    <Clock size={12} />
                    {h.sentAt ? new Date(h.sentAt).toLocaleString('vi-VN') : ''}
                    <span className="mx-1">·</span>
                    <Users size={12} />
                    {h.targetAudience === 'ALL' ? 'Tất cả' : 'Theo khóa học'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
