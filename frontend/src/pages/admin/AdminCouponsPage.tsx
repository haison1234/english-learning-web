import { useEffect, useState } from 'react';
import { Plus, Search, Tag, Loader2, X, AlertCircle } from 'lucide-react';
import {
  getAdminCoupons, createCoupon,
  type CouponResponseDTO, type CouponRequestDTO,
} from '../../services/adminService';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    EXPIRED: 'bg-[#F9FAFB] text-secondaryText border-grayBorder',
    EXHAUSTED: 'bg-[#FFE5E5] text-[#FF6B6B] border-[#FFCCCC]',
  };
  const label: Record<string, string> = {
    ACTIVE: 'Đang kích hoạt', EXPIRED: 'Đã hết hạn', EXHAUSTED: 'Đã dùng hết',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${map[status] ?? map.EXPIRED}`}>
      {label[status] ?? status}
    </span>
  );
}

const DEFAULT_FORM: CouponRequestDTO = {
  code: '',
  discountValue: 10,
  isPercent: true,
  maxUses: 100,
  expiresAt: '',
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CouponRequestDTO>(DEFAULT_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => {
    setLoading(true);
    getAdminCoupons()
      .then(setCoupons)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const filtered = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (form.discountValue <= 0) { setFormError('Giá trị giảm giá phải lớn hơn 0.'); return; }
    if (!form.expiresAt) { setFormError('Vui lòng chọn ngày hết hạn.'); return; }
    if (new Date(form.expiresAt) <= new Date()) { setFormError('Ngày hết hạn phải ở tương lai.'); return; }
    setSaving(true); setFormError('');
    try {
      const payload: CouponRequestDTO = {
        ...form,
        code: form.code?.trim() || undefined,
        // Convert local datetime to ISO string
        expiresAt: new Date(form.expiresAt).toISOString(),
      };
      const created = await createCoupon(payload);
      setCoupons(prev => [created, ...prev]);
      setShowModal(false);
      setForm(DEFAULT_FORM);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Tạo mã thất bại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brandDark font-poppins">Mã giảm giá</h1>
          <p className="text-sm text-secondaryText mt-1">Tạo và quản lý các mã giảm giá cho học viên.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-actionBlue text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#004FD8] active:bg-[#003FA8] transition-colors"
        >
          <Plus size={16} /> Tạo mã mới
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
              placeholder="Tìm kiếm mã code..."
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
                  <th className="p-4 font-semibold">Mã (Code)</th>
                  <th className="p-4 font-semibold">Mức giảm</th>
                  <th className="p-4 font-semibold">Loại</th>
                  <th className="p-4 font-semibold">Đã dùng / Tối đa</th>
                  <th className="p-4 font-semibold">Hạn sử dụng</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grayBorder">
                {filtered.map(coupon => (
                  <tr key={coupon.code} className="hover:bg-offWhite3 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-actionBlue bg-[#FAFCFE] px-3 py-1 rounded-md border border-[#E5E7EB] w-fit">
                        <Tag size={14} className="text-secondaryText" />
                        {coupon.code}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-brandDark">
                      {coupon.isPercent ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString()}đ`}
                    </td>
                    <td className="p-4 text-sm text-secondaryText">
                      {coupon.isPercent ? 'Phần trăm' : 'Tiền mặt'}
                    </td>
                    <td className="p-4 text-sm text-secondaryText">
                      <span className="font-medium text-brandDark">{coupon.usedCount}</span> / {coupon.maxUses}
                    </td>
                    <td className="p-4 text-sm text-secondaryText">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={coupon.status} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondaryText text-sm">
                      Không có mã giảm giá nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md p-8 shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-offWhite1 rounded-full transition-colors"
            >
              <X size={20} className="text-secondaryText" />
            </button>
            <h2 className="text-xl font-bold text-brandDark font-poppins mb-6">Tạo Mã giảm giá</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-brandDark block mb-1">
                  Mã Code <span className="text-secondaryText font-normal">(để trống để hệ thống tự tạo)</span>
                </label>
                <input
                  type="text"
                  value={form.code ?? ''}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="VD: WELCOME10"
                  className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none font-mono tracking-wider uppercase"
                />
              </div>

              {/* Discount type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brandDark block">Loại giảm giá</label>
                <div className="flex gap-3">
                  {[{ label: 'Phần trăm (%)', value: true }, { label: 'Tiền mặt (đ)', value: false }].map(opt => (
                    <label key={String(opt.value)} className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors text-sm font-medium ${
                      form.isPercent === opt.value
                        ? 'border-actionBlue bg-[#FAFCFE] text-actionBlue'
                        : 'border-grayBorder text-secondaryText hover:border-actionBlue'
                    }`}>
                      <input
                        type="radio"
                        checked={form.isPercent === opt.value}
                        onChange={() => setForm(f => ({ ...f, isPercent: opt.value }))}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-brandDark block mb-1">
                    Giá trị {form.isPercent ? '(%)' : '(đ)'}
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    min={1}
                    max={form.isPercent ? 100 : undefined}
                    onChange={e => setForm(f => ({ ...f, discountValue: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-brandDark block mb-1">Số lần dùng tối đa</label>
                  <input
                    type="number"
                    value={form.maxUses}
                    min={1}
                    onChange={e => setForm(f => ({ ...f, maxUses: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-brandDark block mb-1">Ngày hết hạn *</label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                  className="w-full px-4 py-3 border border-grayBorder rounded-lg text-sm focus:border-actionBlue outline-none"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 bg-[#FFE5E5] border border-[#FFCCCC] rounded-xl text-sm text-[#FF6B6B]">
                  <AlertCircle size={16} /> {formError}
                </div>
              )}

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
                  {saving ? 'Đang tạo...' : 'Tạo mã'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
