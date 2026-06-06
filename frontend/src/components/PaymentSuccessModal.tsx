import { CheckCircle2, BookOpen, ArrowRight, PartyPopper } from 'lucide-react'

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onGoToDashboard: () => void
  courseCount: number
}

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  onGoToDashboard,
  courseCount,
}: PaymentSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-brandDark/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] border border-grayBorder shadow-l3 w-full max-w-md p-10 flex flex-col items-center text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
      >
        {/* Glow Decor */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-32 h-32 bg-actionBlue/10 rounded-full blur-2xl pointer-events-none" />

        {/* Success Icon */}
        <div className="relative w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6">
          <CheckCircle2 size={44} className="text-green-500" strokeWidth={1.5} />
          <div className="absolute -top-1 -right-1">
            <PartyPopper size={20} className="text-yellow-500" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-poppins text-brandDark text-2xl font-extrabold tracking-tight mb-2">
          Thanh toán thành công! 🎉
        </h2>
        <p className="text-secondaryText text-sm leading-relaxed mb-2">
          Bạn đã mua thành công{' '}
          <span className="font-bold text-brandDark">
            {courseCount} khóa học
          </span>
          . Hệ thống đã kích hoạt quyền truy cập ngay lập tức.
        </p>
        <div className="flex items-center gap-2 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 rounded-[999px] px-4 py-2 mb-8">
          <BookOpen size={14} />
          Khóa học đã được thêm vào Dashboard của bạn
        </div>

        {/* Actions */}
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={onGoToDashboard}
            className="w-full py-3.5 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white font-bold text-sm rounded-[999px] flex items-center justify-center gap-2 shadow-l1 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Vào học ngay
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 border border-grayBorder text-secondaryText hover:text-brandDark hover:border-darkGrayBorder font-semibold text-sm rounded-[999px] transition-colors"
          >
            Tiếp tục khám phá
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0%   { transform: scale(0.7); opacity: 0; }
          60%  { transform: scale(1.05); opacity: 1; }
          80%  { transform: scale(0.97); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
