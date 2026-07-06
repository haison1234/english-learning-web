import { Send, Users, Mail, Bell } from 'lucide-react';

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-brandDark font-poppins">Gửi Thông báo</h1>
        <p className="text-sm text-secondaryText mt-1">Gửi thông báo in-app hoặc email hàng loạt đến học viên.</p>
      </div>

      <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brandDark">Phương thức gửi</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 p-4 border border-actionBlue bg-[#FAFCFE] rounded-xl cursor-pointer">
              <input type="radio" name="method" defaultChecked className="text-actionBlue focus:ring-actionBlue" />
              <Bell size={18} className="text-actionBlue" />
              <span className="font-medium text-brandDark text-sm">In-app Notification</span>
            </label>
            <label className="flex items-center gap-2 p-4 border border-grayBorder hover:border-actionBlue hover:bg-[#FAFCFE] rounded-xl cursor-pointer transition-colors group">
              <input type="radio" name="method" className="text-actionBlue focus:ring-actionBlue" />
              <Mail size={18} className="text-secondaryText group-hover:text-actionBlue transition-colors" />
              <span className="font-medium text-secondaryText group-hover:text-actionBlue transition-colors text-sm">Email Hàng loạt</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-brandDark">Đối tượng nhận</label>
          <div className="relative">
            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
            <select className="w-full pl-9 pr-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue focus:ring-1 focus:ring-actionBlue outline-none appearance-none bg-white cursor-pointer">
              <option>Tất cả học viên</option>
              <option>Học viên Khóa cơ bản</option>
              <option>Học viên Khóa giao tiếp</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-brandDark">Tiêu đề</label>
          <input 
            type="text" 
            placeholder="Nhập tiêu đề thông báo..." 
            className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue focus:ring-1 focus:ring-actionBlue outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-brandDark">Nội dung</label>
          <textarea 
            rows={5}
            placeholder="Nhập nội dung chi tiết..." 
            className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue focus:ring-1 focus:ring-actionBlue outline-none resize-none"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-grayBorder flex justify-end">
          <button className="flex items-center gap-2 bg-actionBlue text-white px-6 py-3 rounded-full font-semibold hover:bg-actionBlueHover active:bg-[#003FA8] transition-colors">
            <Send size={18} />
            <span>Gửi thông báo ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
