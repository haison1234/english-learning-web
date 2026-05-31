import { X, Check, ShieldCheck } from 'lucide-react'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  onAuth: () => void
}

export default function PricingModal({ isOpen, onClose, onAuth }: PricingModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(1,8,40,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="liquid-glass rounded-[28px] w-full max-w-2xl mx-4 p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Decor */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#6FFF00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X size={18} className="text-[#EFF4FF]" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="font-condiment text-[#6FFF00] text-2xl mb-1">
            Membership Plan
          </p>
          <h2 className="font-grotesk text-[#EFF4FF] text-3xl uppercase">
            HỘI VIÊN VŨ TRỤ
          </h2>
          <p className="font-mono text-[#EFF4FF]/50 text-xs mt-1 uppercase">
            So sánh quyền lợi các cấp độ tài khoản
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Free Tier */}
          <div className="liquid-glass border border-white/5 bg-[#010828]/40 rounded-[20px] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-grotesk text-xs uppercase tracking-widest text-[#EFF4FF]/60">FREE ACCOUNT</span>
                <span className="font-mono text-xs text-[#EFF4FF]/40 uppercase">0đ / Vĩnh viễn</span>
              </div>
              <h3 className="font-grotesk text-2xl text-[#EFF4FF] uppercase mb-4">MEMBER</h3>
              
              <ul className="flex flex-col gap-3 font-mono text-xs text-[#EFF4FF]/70">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6FFF00] shrink-0" />
                  Học thử bài học đầu tiên (IsPreview)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6FFF00] shrink-0" />
                  Làm thử bài thi trắc nghiệm demo
                </li>
                <li className="flex items-center gap-2 opacity-30">
                  <X size={14} className="text-rose-500 shrink-0" />
                  Học toàn bộ giáo trình nâng cao
                </li>
                <li className="flex items-center gap-2 opacity-30">
                  <X size={14} className="text-rose-500 shrink-0" />
                  Lưu tiến độ & làm bài thi tự động
                </li>
                <li className="flex items-center gap-2 opacity-30">
                  <X size={14} className="text-rose-500 shrink-0" />
                  Cấp chứng chỉ hoàn thành (VerifyCode)
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onClose();
                onAuth();
              }}
              className="mt-6 w-full py-3 rounded-[12px] border border-white/10 hover:bg-white/5 font-grotesk text-xs text-[#EFF4FF] uppercase transition-colors"
            >
              Đăng ký miễn phí
            </button>
          </div>

          {/* Premium Tier */}
          <div 
            className="liquid-glass rounded-[20px] p-6 flex flex-col justify-between relative overflow-hidden"
            style={{ border: '1px solid rgba(111, 255, 0, 0.3)' }}
          >
            {/* Spotlight Accent */}
            <div className="absolute top-0 right-0 bg-[#6FFF00] text-[#010828] font-grotesk text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-grotesk text-xs uppercase tracking-widest text-[#6FFF00]">PREMIUM PLAN</span>
                <span className="font-mono text-xs text-[#6FFF00] uppercase font-bold">chỉ từ 399K</span>
              </div>
              <h3 className="font-grotesk text-2xl text-[#EFF4FF] uppercase mb-4 flex items-center gap-1.5">
                PRO LEARNER
              </h3>
              
              <ul className="flex flex-col gap-3 font-mono text-xs text-[#EFF4FF]/90">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6FFF00] shrink-0" />
                  Mở khóa 100% video & tài liệu
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6FFF00] shrink-0" />
                  Kho bài tập Assignments & Quiz không giới hạn
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6FFF00] shrink-0" />
                  Tự động ghi nhớ tiến độ bài học (Progress)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6FFF00] shrink-0" />
                  Nhận Certificate xác thực mã VerifyCode
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#6FFF00] shrink-0" />
                  Được dùng mã Coupon ưu đãi lên đến 50%
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onClose();
                onAuth();
              }}
              className="mt-6 w-full py-3.5 rounded-[12px] font-grotesk text-xs text-[#010828] uppercase font-bold tracking-wider hover:brightness-110 active:scale-95 transition-all duration-200"
              style={{ background: '#6FFF00' }}
            >
              Nâng cấp Premium ngay
            </button>
          </div>

        </div>

        {/* Security / Payment guarantee info */}
        <div className="flex items-center justify-center gap-2 text-[#EFF4FF]/40 text-[10px] font-mono uppercase">
          <ShieldCheck size={14} className="text-[#6FFF00]" />
          Cổng thanh toán bảo mật VNPAY & MOMO kết nối trực tiếp cơ sở dữ liệu.
        </div>
      </div>
    </div>
  )
}
