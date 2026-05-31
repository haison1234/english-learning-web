import { useState } from 'react'
import { X, Award, ShieldCheck, Search, Calendar, CheckCircle } from 'lucide-react'

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
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(1,8,40,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="liquid-glass rounded-[28px] w-full max-w-xl mx-4 p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Decor */}
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#6FFF00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X size={18} className="text-[#EFF4FF]" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="font-condiment text-[#6FFF00] text-2xl mb-1">
            Verification System
          </p>
          <h2 className="font-grotesk text-[#EFF4FF] text-3xl uppercase">
            TRA CỨU CHỨNG CHỈ
          </h2>
          <p className="font-mono text-[#EFF4FF]/50 text-xs mt-1 uppercase">
            Xác thực tính hợp lệ của chứng chỉ học tập (VerifyCode)
          </p>
        </div>

        {/* Search Input Form */}
        {!searched ? (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div className="bg-[#010828]/50 border border-white/5 rounded-[20px] p-5">
              <p className="font-mono text-[11px] text-[#EFF4FF]/60 uppercase mb-3">
                Nhập mã xác thực chứng chỉ của học viên:
              </p>
              
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EFF4FF]/40" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ví dụ: EL-9A28-BF81 hoặc IELTS-PRO-2026"
                  className="w-full bg-white/5 border border-white/10 rounded-[14px] py-4 pl-11 pr-4 text-[#EFF4FF] font-mono text-sm placeholder:text-[#EFF4FF]/30 uppercase focus:outline-none focus:border-[#6FFF00]/50 transition-colors"
                  autoFocus
                />
              </div>
              
              <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-[#EFF4FF]/40">
                <span>Gợi ý mã test:</span>
                <button type="button" onClick={() => setCode('EL-9A28-BF81')} className="text-[#6FFF00] hover:underline">EL-9A28-BF81</button>
                <span>|</span>
                <button type="button" onClick={() => setCode('FREE-COMM-BASIC')} className="text-[#6FFF00] hover:underline">FREE-COMM-BASIC</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!code.trim()}
              className={`w-full py-4 rounded-[14px] font-grotesk text-sm uppercase tracking-wider transition-all duration-200 ${
                code.trim() 
                  ? 'bg-[#6FFF00] text-[#010828] hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-white/5 text-[#EFF4FF]/20 border border-white/5 cursor-not-allowed'
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
              <div className="relative border border-[#6FFF00]/30 bg-gradient-to-br from-[#6FFF00]/5 to-transparent rounded-[24px] p-6 text-center overflow-hidden">
                {/* Certificate Decorative watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none scale-150">
                  <Award size={200} className="text-[#6FFF00]" />
                </div>

                <div className="flex justify-center mb-3">
                  <Award size={48} className="text-[#6FFF00]" />
                </div>

                <p className="font-condiment text-[#6FFF00] text-xl mb-1">Certificate of Completion</p>
                <h4 className="font-grotesk text-[#EFF4FF] text-xs uppercase tracking-widest opacity-60 mb-4">CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC</h4>

                <p className="font-mono text-[#EFF4FF]/50 text-[10px] uppercase">Học viên xuất sắc:</p>
                <p className="font-grotesk text-[#EFF4FF] text-2xl tracking-wide uppercase mt-1 mb-4">{result.studentName}</p>

                <p className="font-mono text-[#EFF4FF]/50 text-[10px] uppercase">Đã hoàn thành xuất sắc:</p>
                <p className="font-grotesk text-[#EFF4FF] text-[15px] uppercase mt-1 mb-5 leading-snug px-4">{result.courseTitle}</p>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 font-mono text-[10px] text-[#EFF4FF]/60">
                  <div className="text-left pl-2">
                    <p className="opacity-50 uppercase text-[9px]">Ngày cấp:</p>
                    <p className="text-[#EFF4FF] mt-0.5 flex items-center gap-1 font-semibold">
                      <Calendar size={10} className="text-[#6FFF00]" />
                      {result.issuedAt}
                    </p>
                  </div>
                  <div className="text-right pr-2">
                    <p className="opacity-50 uppercase text-[9px]">Mã xác thực:</p>
                    <p className="text-[#6FFF00] mt-0.5 font-bold uppercase tracking-wide">
                      {result.verifyCode}
                    </p>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-4 flex items-center justify-center gap-1 text-[9px] font-mono text-emerald-400 uppercase">
                  <ShieldCheck size={11} />
                  Dữ liệu được xác thực bảo mật trực tiếp trên ELearningDB
                </div>
              </div>
            ) : (
              /* Invalid Case */
              <div className="border border-rose-500/20 bg-rose-500/5 rounded-[24px] p-8 text-center">
                <div className="text-rose-500 font-grotesk text-5xl mb-4">⚠️</div>
                <h3 className="font-grotesk text-rose-500 text-lg uppercase mb-2">Mã xác thực không tồn tại!</h3>
                <p className="font-mono text-xs text-[#EFF4FF]/60 max-w-sm mx-auto leading-relaxed">
                  Không tìm thấy chứng chỉ tương ứng với mã <span className="text-[#EFF4FF] font-bold">"{result?.verifyCode}"</span> trong cơ sở dữ liệu. Vui lòng kiểm tra lại.
                </p>
              </div>
            )}

            {/* Bottom buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 py-4 border border-white/10 rounded-[14px] font-grotesk text-xs uppercase tracking-wider text-[#EFF4FF] hover:bg-white/5 transition-colors"
              >
                Tra cứu mã khác
              </button>
              
              {result?.status === 'valid' && (
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-4 rounded-[14px] font-grotesk text-xs uppercase tracking-wider text-[#010828] hover:brightness-110 active:scale-95 transition-all"
                  style={{ background: '#6FFF00' }}
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
