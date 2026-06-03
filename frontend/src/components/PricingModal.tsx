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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-brandDark/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-l3 border border-grayBorder rounded-[28px] w-full max-w-2xl mx-4 p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Decor */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-actionBlue/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-secondaryText hover:bg-offWhite1 hover:text-brandDark transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="font-poppins text-actionBlue text-sm font-semibold tracking-wider uppercase mb-1">
            Membership Plan
          </p>
          <h2 className="font-poppins text-brandDark text-2xl font-bold tracking-tight">
            LỘ TRÌNH HỌC PHẦN HỘI VIÊN
          </h2>
          <p className="text-secondaryText text-sm mt-1">
            So sánh quyền lợi các cấp độ tài khoản để bắt đầu học tập hiệu quả
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Free Tier */}
          <div className="bg-offWhite1 border border-grayBorder rounded-[20px] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-poppins text-xs font-semibold uppercase tracking-wider text-secondaryText">MEMBER</span>
                <span className="text-xs text-secondaryText font-medium">0đ / Vĩnh viễn</span>
              </div>
              <h3 className="font-poppins text-xl font-bold text-brandDark mb-4">Tài khoản miễn phí</h3>
              
              <ul className="flex flex-col gap-3 text-xs text-secondaryText">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-actionBlue shrink-0" />
                  Học thử bài học đầu tiên (IsPreview)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-actionBlue shrink-0" />
                  Làm thử bài thi trắc nghiệm demo
                </li>
                <li className="flex items-center gap-2 opacity-45 line-through">
                  <X size={14} className="text-red-500 shrink-0" />
                  Học toàn bộ giáo trình nâng cao
                </li>
                <li className="flex items-center gap-2 opacity-45 line-through">
                  <X size={14} className="text-red-500 shrink-0" />
                  Lưu tiến độ & làm bài thi tự động
                </li>
                <li className="flex items-center gap-2 opacity-45 line-through">
                  <X size={14} className="text-red-500 shrink-0" />
                  Cấp chứng chỉ hoàn thành (VerifyCode)
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onClose();
                onAuth();
              }}
              className="mt-6 w-full py-2.5 rounded-[999px] border border-darkGrayBorder text-brandDark hover:bg-offWhite2 font-semibold text-xs uppercase transition-colors"
            >
              Đăng ký miễn phí
            </button>
          </div>

          {/* Premium Tier */}
          <div 
            className="bg-white border-2 border-actionBlue rounded-[20px] p-6 flex flex-col justify-between relative overflow-hidden shadow-l1"
          >
            {/* Spotlight Accent */}
            <div className="absolute top-0 right-0 bg-actionBlue text-white font-poppins text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-poppins text-xs font-semibold uppercase tracking-wider text-actionBlue">PRO LEARNER</span>
                <span className="text-xs text-actionBlue font-bold">chỉ từ 399K</span>
              </div>
              <h3 className="font-poppins text-xl font-bold text-brandDark mb-4 flex items-center gap-1.5">
                Thành viên Premium
              </h3>
              
              <ul className="flex flex-col gap-3 text-xs text-brandDark">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-actionBlue shrink-0" />
                  Mở khóa 100% video & tài liệu học tập
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-actionBlue shrink-0" />
                  Làm Assignments & Quiz không giới hạn
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-actionBlue shrink-0" />
                  Tự động lưu trữ tiến độ (Progress)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-actionBlue shrink-0" />
                  Nhận Certificate chính thức (VerifyCode)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-actionBlue shrink-0" />
                  Áp dụng mã giảm giá ưu đãi Coupon
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onClose();
                onAuth();
              }}
              className="mt-6 w-full py-3 rounded-[999px] bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white text-xs uppercase font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Nâng cấp Premium ngay
            </button>
          </div>

        </div>

        {/* Security / Payment guarantee info */}
        <div className="flex items-center justify-center gap-2 text-secondaryText text-[10px] uppercase font-semibold">
          <ShieldCheck size={14} className="text-actionBlue" />
          Hệ thống bảo mật giao dịch, tích hợp trực tiếp cơ sở dữ liệu học tập.
        </div>
      </div>
    </div>
  )
}
