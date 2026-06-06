import { useState } from 'react'
import { X, Award, ShieldCheck, Search, Calendar } from 'lucide-react'

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CertResult {
  studentName: string
  courseTitle: string
  verifyCode: string
  issuedAt: string
  status: 'valid' | 'invalid'
}

export default function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<CertResult | null>(null)
  const [searched, setSearched] = useState(false)

  if (!isOpen) return null

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    const cleanCode = code.trim().toUpperCase()

    // Giả lập kết quả truy vấn từ Database ELearningDB (Bảng Certificates)
    if (cleanCode === 'EL-9A28-BF81' || cleanCode === 'IELTS-PRO-2026') {
      setResult({
        studentName: 'NGUYỄN VĂN A',
        courseTitle: 'Luyện Thi IELTS Chuyên Sâu Cấp Tốc (Premium)',
        verifyCode: cleanCode,
        issuedAt: '30/05/2026',
        status: 'valid'
      })
    } else if (cleanCode === 'FREE-COMM-BASIC') {
      setResult({
        studentName: 'TRẦN THỊ B',
        courseTitle: 'Giao Tiếp Cơ Bản Cho Người Mới (Free)',
        verifyCode: cleanCode,
        issuedAt: '15/05/2026',
        status: 'valid'
      })
    } else {
      setResult({
        studentName: '',
        courseTitle: '',
        verifyCode: cleanCode,
        issuedAt: '',
        status: 'invalid'
      })
    }
    setSearched(true)
  }

  const handleReset = () => {
    setCode('')
    setResult(null)
    setSearched(false)
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-brandDark/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-l3 border border-grayBorder rounded-[28px] w-full max-w-xl mx-4 p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Decor */}
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-actionBlue/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-secondaryText hover:bg-offWhite1 hover:text-brandDark transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="font-poppins text-actionBlue text-sm font-semibold tracking-wider uppercase mb-1">
            Verification System
          </p>
          <h2 className="font-poppins text-brandDark text-2xl font-bold tracking-tight">
            XÁC MINH CHỨNG CHỈ
          </h2>
          <p className="text-secondaryText text-sm mt-1">
            Xác thực tính pháp lý và thông tin của chứng chỉ học viên (VerifyCode)
          </p>
        </div>

        {/* Search Input Form */}
        {!searched ? (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div className="bg-offWhite1 border border-grayBorder rounded-[20px] p-5">
              <p className="text-xs text-secondaryText font-medium mb-3 uppercase tracking-wider">
                Nhập mã xác thực chứng chỉ của học viên:
              </p>
              
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondaryText/60" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ví dụ: EL-9A28-BF81 hoặc IELTS-PRO-2026"
                  className="w-full bg-white border border-grayBorder rounded-lg py-3.5 pl-11 pr-4 text-brandDark font-mono text-sm placeholder:text-darkGrayBorder uppercase focus:outline-none focus:border-actionBlue focus:ring-4 focus:ring-actionBlue/10 transition-all"
                  autoFocus
                />
              </div>
              
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-secondaryText font-semibold">
                <span>Gợi ý mã mẫu:</span>
                <button type="button" onClick={() => setCode('EL-9A28-BF81')} className="text-actionBlue hover:underline">EL-9A28-BF81</button>
                <span>|</span>
                <button type="button" onClick={() => setCode('FREE-COMM-BASIC')} className="text-actionBlue hover:underline">FREE-COMM-BASIC</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!code.trim()}
              className={`w-full py-3.5 rounded-[999px] font-semibold text-sm uppercase tracking-wider transition-all ${
                code.trim() 
                  ? 'bg-actionBlue text-white hover:bg-actionBlueHover active:bg-actionBlueActive hover:scale-[1.01] active:scale-[0.99]' 
                  : 'bg-offWhite2 text-darkGrayBorder border border-grayBorder cursor-not-allowed'
              }`}
            >
              Kiểm tra tính hợp lệ
            </button>
          </form>
        ) : (
          /* Result Screen */
          <div className="flex flex-col gap-6">
            
            {result?.status === 'valid' ? (
              /* Success Case: Gorgeous Glassmorphism Digital Certificate Frame */
              <div className="relative border-4 border-double border-actionBlue/30 bg-offWhite1/80 rounded-[24px] p-6 text-center overflow-hidden">
                {/* Certificate Decorative watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none scale-150">
                  <Award size={200} className="text-actionBlue" />
                </div>

                <div className="flex justify-center mb-3">
                  <Award size={48} className="text-actionBlue" />
                </div>

                <p className="font-poppins text-actionBlue text-lg font-bold mb-1">CERTIFICATE OF COMPLETION</p>
                <h4 className="text-secondaryText text-[10px] uppercase tracking-widest font-bold mb-4">CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC</h4>

                <p className="text-secondaryText text-[10px] uppercase font-semibold">Học viên:</p>
                <p className="font-poppins text-brandDark text-xl font-bold tracking-wide uppercase mt-1 mb-4">{result.studentName}</p>

                <p className="text-secondaryText text-[10px] uppercase font-semibold">Đã hoàn thành khóa học:</p>
                <p className="font-poppins text-brandDark text-sm font-semibold uppercase mt-1 mb-5 leading-snug px-4 text-center">{result.courseTitle}</p>

                <div className="grid grid-cols-2 gap-4 border-t border-grayBorder pt-4 text-[10px] text-secondaryText">
                  <div className="text-left pl-2">
                    <p className="opacity-75 uppercase text-[9px] font-semibold">Ngày cấp:</p>
                    <p className="text-brandDark mt-0.5 flex items-center gap-1 font-bold">
                      <Calendar size={10} className="text-actionBlue" />
                      {result.issuedAt}
                    </p>
                  </div>
                  <div className="text-right pr-2">
                    <p className="opacity-75 uppercase text-[9px] font-semibold">Mã xác thực:</p>
                    <p className="text-actionBlue mt-0.5 font-bold uppercase tracking-wide">
                      {result.verifyCode}
                    </p>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-4 flex items-center justify-center gap-1 text-[9px] text-successGreenText bg-successGreenBg/40 px-3 py-1 rounded-[999px] w-fit mx-auto border border-successGreenText/10 uppercase font-semibold">
                  <ShieldCheck size={11} />
                  Dữ liệu được bảo mật trực tiếp trên hệ thống ELearning
                </div>
              </div>
            ) : (
              /* Invalid Case */
              <div className="border border-red-500/20 bg-[#FFE5E5] rounded-[24px] p-8 text-center">
                <div className="text-red-500 font-bold text-4xl mb-4">⚠️</div>
                <h3 className="font-poppins text-red-500 text-lg font-bold uppercase mb-2">Mã xác thực không tồn tại!</h3>
                <p className="text-secondaryText text-xs max-w-sm mx-auto leading-relaxed">
                  Không tìm thấy chứng chỉ tương ứng với mã <span className="text-brandDark font-bold">"{result?.verifyCode}"</span> trong cơ sở dữ liệu. Vui lòng kiểm tra lại.
                </p>
              </div>
            )}

            {/* Bottom buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 py-3 border border-darkGrayBorder rounded-[999px] font-semibold text-xs uppercase tracking-wider text-brandDark hover:bg-offWhite1 transition-colors"
              >
                Tra cứu mã khác
              </button>
              
              {result?.status === 'valid' && (
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white rounded-[999px] font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Tải chứng chỉ (PDF)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
