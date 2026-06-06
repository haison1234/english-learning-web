import { useState, useEffect } from 'react'
import { ArrowLeft, Tag, X, CreditCard, Landmark, Smartphone, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { useCart } from '../stores/cartStore'
import { initiatePayment, confirmPayment, validateCoupon } from '../services/paymentService'

interface CheckoutPageProps {
  onBack: () => void
  onSuccess: () => void
}

type PaymentMethodOption = {
  id: number
  label: string
  desc: string
  icon: React.ReactNode
  color: string
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 0,
    label: 'VNPay',
    desc: 'Thanh toán qua cổng VNPay',
    icon: <CreditCard size={22} />,
    color: 'border-blue-500 bg-blue-50 text-blue-700',
  },
  {
    id: 1,
    label: 'MoMo',
    desc: 'Ví điện tử MoMo',
    icon: <Smartphone size={22} />,
    color: 'border-pink-500 bg-pink-50 text-pink-700',
  },
  {
    id: 2,
    label: 'ATM / Visa',
    desc: 'Thẻ ngân hàng nội địa / quốc tế',
    icon: <Landmark size={22} />,
    color: 'border-green-500 bg-green-50 text-green-700',
  },
]

const backupImages = [
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=200&q=80',
]

export default function CheckoutPage({ onBack, onSuccess }: CheckoutPageProps) {
  const { items, clearCart, totalPrice } = useCart()

  const [selectedMethod, setSelectedMethod] = useState<number>(0)
  const [couponCode, setCouponCode] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponApplied, setCouponApplied] = useState(false)

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const finalTotal = Math.max(0, totalPrice - discount)

  // Nếu giỏ trống thì quay về
  useEffect(() => {
    if (items.length === 0) {
      onBack()
    }
  }, [items.length, onBack])

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponError('')
    setCouponLoading(true)
    try {
      // Áp dụng coupon cho item đầu tiên (trong trường hợp nhiều items, lấy mức giảm chung)
      const firstCourseId = items[0]?.courseId
      if (!firstCourseId) return
      const res = await validateCoupon(couponInput.trim(), firstCourseId)
      if (!res.valid) {
        setCouponError(res.message || 'Mã giảm giá không hợp lệ.')
        return
      }
      // Tính discount
      let discountAmount = 0
      if (res.discountType === 0) {
        // Percentage
        discountAmount = Math.round(totalPrice * res.discountValue / 100)
      } else {
        // Fixed
        discountAmount = res.discountValue
      }
      setDiscount(discountAmount)
      setCouponCode(couponInput.trim())
      setCouponApplied(true)
    } catch (e: any) {
      setCouponError(e.message || 'Mã giảm giá không hợp lệ.')
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setCouponInput('')
    setDiscount(0)
    setCouponApplied(false)
    setCouponError('')
  }

  const handlePay = async () => {
    setError('')
    setIsProcessing(true)
    try {
      // Thanh toán tuần tự từng khóa học trong giỏ
      for (const item of items) {
        const initRes = await initiatePayment({
          courseId: item.courseId,
          method: item.basePrice === 0 ? 3 : selectedMethod,
          couponCode: couponCode || undefined,
        })
        
        // Nếu có paymentUrl (ví dụ từ VNPAY), redirect trình duyệt tới đó
        if (initRes.paymentUrl) {
          window.location.href = initRes.paymentUrl
          return // Dừng execution để chờ redirect
        }

        // Nếu khóa học miễn phí (không có paymentUrl), xác nhận trực tiếp
        await confirmPayment({
          paymentId: initRes.paymentId,
          transactionRef: `MOCK-${Date.now()}-${item.courseId.slice(0, 8)}`,
        })
      }
      clearCart()
      onSuccess()
    } catch (e: any) {
      setError(e.message || 'Thanh toán thất bại. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-offWhite1 py-20">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12">

        {/* Back */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-secondaryText hover:text-actionBlue transition-colors font-semibold text-xs uppercase tracking-wider mb-10"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Quay lại giỏ hàng
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Order Summary + Payment Method */}
          <div className="lg:col-span-7 space-y-6">

            {/* Order Summary */}
            <div className="bg-white rounded-[24px] border border-grayBorder p-6 shadow-l1">
              <h2 className="font-poppins text-brandDark text-lg font-bold mb-5">
                Đơn hàng của bạn
              </h2>
              <div className="space-y-4">
                {items.map((item, idx) => {
                  const imgSrc =
                    item.thumbnailUrl && !item.thumbnailUrl.includes('cdn.elearning.vn')
                      ? item.thumbnailUrl
                      : backupImages[idx % backupImages.length]
                  return (
                    <div key={item.courseId} className="flex gap-4 items-center p-3 rounded-[12px] bg-offWhite1 border border-grayBorder">
                      <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-16 h-12 rounded-[8px] object-cover border border-grayBorder shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins text-brandDark font-semibold text-sm leading-snug line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-secondaryText mt-0.5">
                          {item.courseType === 0 ? 'Khóa học miễn phí' : 'Khóa học cao cấp'}
                        </p>
                      </div>
                      <span className="font-poppins font-bold text-sm text-actionBlue shrink-0">
                        {item.basePrice === 0
                          ? 'Miễn phí'
                          : `${item.basePrice.toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Method */}
            {finalTotal > 0 && (
              <div className="bg-white rounded-[24px] border border-grayBorder p-6 shadow-l1">
                <h2 className="font-poppins text-brandDark text-lg font-bold mb-5">
                  Phương thức thanh toán
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-[16px] border-2 transition-all duration-200 ${
                        selectedMethod === method.id
                          ? method.color + ' scale-[1.02]'
                          : 'border-grayBorder bg-offWhite1 text-secondaryText hover:border-darkGrayBorder'
                      }`}
                    >
                      {method.icon}
                      <span className="font-poppins font-bold text-sm">{method.label}</span>
                      <span className="text-[10px] font-medium text-center leading-tight opacity-70">
                        {method.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Coupon + Price Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">

            {/* Coupon */}
            <div className="bg-white rounded-[24px] border border-grayBorder p-6 shadow-l1">
              <h3 className="font-poppins text-brandDark text-base font-bold mb-4 flex items-center gap-2">
                <Tag size={16} className="text-actionBlue" />
                Mã giảm giá
              </h3>

              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-[12px] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    <div>
                      <p className="font-poppins text-green-700 font-bold text-sm">{couponCode}</p>
                      <p className="text-green-600 text-xs">
                        Giảm {discount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-green-500 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="Nhập mã coupon..."
                    className="flex-1 border border-grayBorder rounded-[10px] px-4 py-2.5 text-sm font-mono text-brandDark bg-offWhite1 focus:outline-none focus:border-actionBlue transition-colors placeholder:text-secondaryText/50 uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2.5 bg-actionBlue text-white text-xs font-bold uppercase tracking-wider rounded-[10px] hover:bg-actionBlueHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Áp dụng'}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="mt-2 text-xs text-red-500 font-medium">{couponError}</p>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-[24px] border border-grayBorder p-6 shadow-l1">
              <h3 className="font-poppins text-brandDark text-base font-bold mb-5">
                Tóm tắt thanh toán
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-secondaryText">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-brandDark">
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá (coupon)</span>
                    <span className="font-semibold">-{discount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-secondaryText">
                  <span>Thuế VAT</span>
                  <span className="font-semibold">Đã bao gồm</span>
                </div>
                <div className="pt-3 border-t border-grayBorder flex justify-between items-center">
                  <span className="font-poppins text-brandDark font-bold">Tổng thanh toán</span>
                  <span className="font-poppins text-actionBlue text-xl font-extrabold">
                    {finalTotal === 0
                      ? 'Miễn phí'
                      : `${finalTotal.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-[10px] text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="mt-5 w-full py-4 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white font-bold text-sm rounded-[999px] flex items-center justify-center gap-2.5 shadow-l1 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {finalTotal === 0 ? 'Đăng ký miễn phí' : 'Thanh toán ngay'}
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-secondaryText mt-3">
                🔒 Bảo mật SSL · Hoàn tiền trong 7 ngày nếu không hài lòng
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
