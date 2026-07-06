import { useState } from 'react';
import { Plus, Search, Tag, Trash2, Copy } from 'lucide-react';

const mockCoupons = [
  { id: 'c1', code: 'WELCOME10', discount: '10%', maxUsage: 100, used: 45, expiry: '2025-12-31', status: 'Active' },
  { id: 'c2', code: 'TET2025', discount: '20%', maxUsage: 50, used: 50, expiry: '2025-02-15', status: 'Expired' },
  { id: 'c3', code: 'VIP500K', discount: '500,000đ', maxUsage: 10, used: 2, expiry: '2025-06-30', status: 'Active' },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(mockCoupons);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brandDark font-poppins">Mã giảm giá</h1>
          <p className="text-sm text-secondaryText mt-1">Tạo và quản lý các mã giảm giá cho học viên.</p>
        </div>
        <button className="flex items-center gap-2 bg-actionBlue text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-actionBlueHover active:bg-[#003FA8] transition-colors">
          <Plus size={16} />
          <span>Tạo mã mới</span>
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-grayBorder shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-grayBorder flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondaryText" />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã code..." 
              className="w-full pl-9 pr-4 py-2 border border-grayBorder rounded-lg text-sm focus:border-actionBlue focus:ring-1 focus:ring-actionBlue outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-offWhite1 text-secondaryText text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Mã (Code)</th>
                <th className="p-4 font-semibold">Mức giảm</th>
                <th className="p-4 font-semibold">Đã dùng / Tối đa</th>
                <th className="p-4 font-semibold">Hạn sử dụng</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grayBorder">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-offWhite3 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-mono text-sm font-bold text-actionBlue bg-[#FAFCFE] px-3 py-1 rounded-md border border-[#E5E7EB] w-fit">
                      <Tag size={14} className="text-secondaryText" />
                      {coupon.code}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-brandDark">{coupon.discount}</td>
                  <td className="p-4 text-sm text-secondaryText">
                    <span className="font-medium text-brandDark">{coupon.used}</span> / {coupon.maxUsage}
                  </td>
                  <td className="p-4 text-sm text-secondaryText">{coupon.expiry}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      coupon.status === 'Active' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]' : 'bg-[#F9FAFB] text-secondaryText border border-grayBorder'
                    }`}>
                      {coupon.status === 'Active' ? 'Đang kích hoạt' : 'Đã hết hạn'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-actionBlue hover:bg-[#FAFCFE] rounded-full transition-colors" title="Copy mã">
                        <Copy size={16} />
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
