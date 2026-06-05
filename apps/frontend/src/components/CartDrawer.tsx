import { X, ShoppingCart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../stores/cartStore'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
  onLogin: () => void
  isLoggedIn: boolean
}

const backupImages = [
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=120&q=80',
]

export default function CartDrawer({ isOpen, onClose, onCheckout, onLogin, isLoggedIn }: CartDrawerProps) {
  const { items, removeItem, totalPrice } = useCart()

  if (!isOpen) return null

  const handleCheckout = () => {
    if (!isLoggedIn) {
      onClose()
      onLogin()
      return
    }
    onClose()
    onCheckout()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-brandDark/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-[420px] z-[310] bg-white shadow-l3 flex flex-col"
        style={{ animation: 'slideInRight 0.25s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-grayBorder shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingCart size={20} className="text-actionBlue" />
            <span className="font-poppins text-brandDark text-base font-bold tracking-tight">
              Giỏ hàng
            </span>
            {items.length > 0 && (
              <span className="ml-1 min-w-[22px] h-[22px] px-1.5 rounded-full bg-actionBlue text-white text-[11px] font-bold flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-secondaryText hover:bg-offWhite1 hover:text-brandDark transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-actionBlue/5 flex items-center justify-center">
                <ShoppingBag size={32} className="text-actionBlue/40" />
              </div>
              <div>
                <p className="font-poppins text-brandDark font-semibold text-sm mb-1">
                  Giỏ hàng đang trống
                </p>
                <p className="text-secondaryText text-xs leading-relaxed">
                  Thêm khóa học vào giỏ để tiến hành thanh toán
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-actionBlue text-white text-xs font-bold uppercase tracking-wider rounded-[999px] hover:bg-actionBlueHover transition-colors"
              >
                Khám phá khóa học
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const imgSrc =
                item.thumbnailUrl && !item.thumbnailUrl.includes('cdn.elearning.vn')
                  ? item.thumbnailUrl
                  : backupImages[idx % backupImages.length]

              return (
                <div
                  key={item.courseId}
                  className="flex gap-4 p-4 bg-offWhite1 rounded-[16px] border border-grayBorder group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-[10px] overflow-hidden bg-offWhite2 shrink-0 border border-grayBorder">
                    <img
                      src={imgSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins text-brandDark font-semibold text-sm leading-snug line-clamp-2 mb-1">
                      {item.title}
                    </p>
                    <p className="font-poppins text-actionBlue font-bold text-sm">
                      {item.basePrice === 0
                        ? 'Miễn phí'
                        : `${item.basePrice.toLocaleString('vi-VN')}đ`}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.courseId)}
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-secondaryText/50 hover:bg-red-50 hover:text-red-500 transition-colors self-start mt-0.5"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-grayBorder bg-white shrink-0 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondaryText font-medium">
                Tổng cộng ({items.length} khóa học)
              </span>
              <span className="font-poppins text-brandDark text-lg font-bold">
                {totalPrice === 0
                  ? 'Miễn phí'
                  : `${totalPrice.toLocaleString('vi-VN')}đ`}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white font-bold text-sm rounded-[999px] flex items-center justify-center gap-2 shadow-l1 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isLoggedIn ? 'Tiến hành thanh toán' : 'Đăng nhập để thanh toán'}
              <ArrowRight size={16} />
            </button>

            <p className="text-center text-[10px] text-secondaryText">
              🔒 Giao dịch được bảo mật SSL — hoàn tiền trong 7 ngày
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </>
  )
}
