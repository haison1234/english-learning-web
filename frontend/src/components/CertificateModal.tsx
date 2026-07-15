import { useState, useEffect } from 'react'
import { X, Award, ShieldCheck, Search, Calendar, Loader2, ArrowLeft } from 'lucide-react'
import { getMyLearningCourses, MyCourseLearningDTO } from '../services/learningService'

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
  const [loading, setLoading] = useState(false)

  // Personal certificates states
  const [myCertificates, setMyCertificates] = useState<MyCourseLearningDTO[]>([])
  const [loadingCerts, setLoadingCerts] = useState(false)
  const [selectedCert, setSelectedCert] = useState<MyCourseLearningDTO | null>(null)

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  useEffect(() => {
    if (isOpen && user) {
      setLoadingCerts(true)
      setSelectedCert(null) // Reset selection when opening
      getMyLearningCourses()
        .then(courses => {
          const certs = courses.filter(c => c.certificateCode)
          setMyCertificates(certs)
        })
        .catch(err => console.error('Error fetching certs:', err))
        .finally(() => setLoadingCerts(false))
    }
  }, [isOpen])

  // Download logic (vẽ Canvas)
  const downloadCertificate = (courseTitle: string, studentName: string, certCode: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, '#FAFCFE')
    gradient.addColorStop(1, '#F0F4F8')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Draw border
    ctx.strokeStyle = '#0056F8'
    ctx.lineWidth = 10
    ctx.strokeRect(20, 20, 760, 560)
    ctx.strokeStyle = '#B3CFFF'
    ctx.lineWidth = 2
    ctx.strokeRect(30, 30, 740, 540)

    // Text Header
    ctx.fillStyle = '#0056F8'
    ctx.font = 'bold 28px Poppins, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('CERTIFICATE OF COMPLETION', 400, 100)

    ctx.fillStyle = '#666'
    ctx.font = 'bold 12px Poppins, sans-serif'
    ctx.fillText('CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC', 400, 140)

    ctx.fillStyle = '#888'
    ctx.font = '14px sans-serif'
    ctx.fillText('Học viên:', 400, 220)

    // Student Name
    ctx.fillStyle = '#111'
    ctx.font = 'bold 32px Poppins, sans-serif'
    ctx.fillText(studentName.toUpperCase(), 400, 270)

    ctx.fillStyle = '#888'
    ctx.font = '14px sans-serif'
    ctx.fillText('Đã hoàn thành khóa học:', 400, 340)

    // Course Title
    ctx.fillStyle = '#111'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText(courseTitle, 400, 390)

    // Footer Info
    ctx.fillStyle = '#666'
    ctx.font = '12px sans-serif'
    ctx.fillText(`Mã số: ${certCode}`, 400, 480)
    ctx.fillText(`Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}`, 400, 510)

    // Generate link to download
    const link = document.createElement('a')
    link.download = `ChungChi_${courseTitle.replace(/\s+/g, '_')}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  if (!isOpen) return null

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    const cleanCode = code.trim().toUpperCase()
    setLoading(true)
    setSearched(false)

    try {
      const res = await fetch(`http://localhost:8080/api/v1/courses/certificate/verify/${cleanCode}`)
      if (!res.ok) {
        throw new Error('Mã chứng chỉ không tồn tại.')
      }
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({
        studentName: '',
        courseTitle: '',
        verifyCode: cleanCode,
        issuedAt: '',
        status: 'invalid'
      })
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const handleReset = () => {
    setCode('')
    setResult(null)
    setSearched(false)
    setLoading(false)
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
            {user ? 'CHỨNG CHỈ CỦA BẠN' : 'XÁC MINH CHỨNG CHỈ'}
          </h2>
          <p className="text-secondaryText text-sm mt-1">
            {user 
              ? 'Danh sách các chứng chỉ hoàn thành khóa học đã nhận' 
              : 'Xác thực tính pháp lý và thông tin của chứng chỉ học viên (VerifyCode)'}
          </p>
        </div>

        {user ? (
          /* ── TRƯỜNG HỢP A: ĐÃ ĐĂNG NHẬP (Xem ví chứng chỉ cá nhân) ── */
          loadingCerts ? (
            <div className="py-14 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-actionBlue" size={24} />
              <span className="text-xs text-secondaryText font-medium">Đang tải danh sách chứng chỉ...</span>
            </div>
          ) : selectedCert ? (
            /* Chi tiết 1 chứng chỉ */
            <div className="flex flex-col gap-6">
              <div className="relative border-4 border-double border-actionBlue/30 bg-offWhite1/80 rounded-[24px] p-6 text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none scale-150">
                  <Award size={200} className="text-actionBlue" />
                </div>

                <div className="flex justify-center mb-3">
                  <Award size={48} className="text-actionBlue" />
                </div>

                <p className="font-poppins text-actionBlue text-lg font-bold mb-1">CERTIFICATE OF COMPLETION</p>
                <h4 className="text-secondaryText text-[10px] uppercase tracking-widest font-bold mb-4">CHỨNG NHẬN HOÀN THÀNH KHÓA HỌC</h4>

                <p className="text-secondaryText text-[10px] uppercase font-semibold">Học viên:</p>
                <p className="font-poppins text-brandDark text-xl font-bold tracking-wide uppercase mt-1 mb-4">{user.fullName}</p>

                <p className="text-secondaryText text-[10px] uppercase font-semibold">Đã hoàn thành khóa học:</p>
                <p className="font-poppins text-brandDark text-sm font-semibold uppercase mt-1 mb-5 leading-snug px-4 text-center">{selectedCert.title}</p>

                <div className="grid grid-cols-2 gap-4 border-t border-grayBorder pt-4 text-[10px] text-secondaryText">
                  <div className="text-left pl-2">
                    <p className="opacity-75 uppercase text-[9px] font-semibold">Ngày cấp:</p>
                    <p className="text-brandDark mt-0.5 font-bold">
                      {selectedCert.lastUpdatedAt ? new Date(selectedCert.lastUpdatedAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right pr-2">
                    <p className="opacity-75 uppercase text-[9px] font-semibold">Mã xác thực:</p>
                    <p className="text-actionBlue mt-0.5 font-bold uppercase tracking-wide">
                      {selectedCert.certificateCode}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1 text-[9px] text-successGreenText bg-successGreenBg/40 px-3 py-1 rounded-[999px] w-fit mx-auto border border-successGreenText/10 uppercase font-semibold">
                  <ShieldCheck size={11} />
                  Dữ liệu được bảo mật trực tiếp trên hệ thống ELearning
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="flex-1 py-3 border border-darkGrayBorder rounded-[999px] font-semibold text-xs uppercase tracking-wider text-brandDark hover:bg-offWhite1 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} /> Quay lại
                </button>
                <button
                  onClick={() => downloadCertificate(selectedCert.title, user.fullName, selectedCert.certificateCode || '')}
                  className="flex-1 py-3 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white rounded-[999px] font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Tải chứng chỉ (PNG)
                </button>
              </div>
            </div>
          ) : (
            /* Danh sách chứng chỉ */
            <div className="flex flex-col gap-4">
              {myCertificates.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center border border-dashed border-grayBorder rounded-2xl p-6 bg-offWhite1/50">
                  <Award size={40} className="text-grayBorder/80 mb-3" />
                  <p className="text-sm font-semibold text-brandDark">Bạn chưa nhận được chứng chỉ nào</p>
                  <p className="text-xs text-secondaryText mt-1.5 max-w-sm">
                    Hãy hoàn thành 100% số bài học của một khóa học bất kỳ để nhận chứng chỉ số hóa từ chúng tôi nhé!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {myCertificates.map((cert) => (
                    <div 
                      key={cert.courseId} 
                      className="p-4 border border-grayBorder rounded-2xl flex items-center justify-between gap-4 hover:border-actionBlue hover:bg-actionBlue/[0.01] transition-all bg-white"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="text-amber-500" size={18} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-brandDark truncate">{cert.title}</h4>
                          <p className="text-[10px] text-secondaryText mt-1 flex items-center gap-1.5">
                            <span>Mã: <strong className="font-mono text-brandDark uppercase">{cert.certificateCode}</strong></span>
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shrink-0 shadow-sm"
                      >
                        Xem
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={onClose}
                className="w-full py-3.5 border border-darkGrayBorder rounded-[999px] font-semibold text-xs uppercase tracking-wider text-brandDark hover:bg-offWhite1 transition-colors mt-2"
              >
                Đóng
              </button>
            </div>
          )
        ) : (
          /* ── TRƯỜNG HỢP B: CHƯA ĐĂNG NHẬP (Verify code) ── */
          <div className="flex flex-col gap-6">
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
                      placeholder="Ví dụ: EL-9A28-BF81"
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
                  disabled={!code.trim() || loading}
                  className={`w-full py-3.5 rounded-[999px] font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    code.trim() && !loading
                      ? 'bg-actionBlue text-white hover:bg-actionBlueHover active:bg-actionBlueActive hover:scale-[1.01] active:scale-[0.99]' 
                      : 'bg-offWhite2 text-darkGrayBorder border border-grayBorder cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang kiểm tra...</span>
                    </>
                  ) : (
                    <span>Kiểm tra tính hợp lệ</span>
                  )}
                </button>
              </form>
            ) : (
              /* Kết quả tìm kiếm Verify Code */
              <div className="flex flex-col gap-6">
                {result?.status === 'valid' ? (
                  <div className="relative border-4 border-double border-actionBlue/30 bg-offWhite1/80 rounded-[24px] p-6 text-center overflow-hidden">
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
                        <p className="text-brandDark mt-0.5 font-bold flex items-center gap-1">
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

                    <div className="mt-4 flex items-center justify-center gap-1 text-[9px] text-successGreenText bg-successGreenBg/40 px-3 py-1 rounded-[999px] w-fit mx-auto border border-successGreenText/10 uppercase font-semibold">
                      <ShieldCheck size={11} />
                      Dữ liệu được bảo mật trực tiếp trên hệ thống ELearning
                    </div>
                  </div>
                ) : (
                  <div className="border border-red-500/20 bg-[#FFE5E5] rounded-[24px] p-8 text-center">
                    <div className="text-red-500 font-bold text-4xl mb-4">⚠️</div>
                    <h3 className="font-poppins text-red-500 text-lg font-bold uppercase mb-2">Mã xác thực không tồn tại!</h3>
                    <p className="text-secondaryText text-xs max-w-sm mx-auto leading-relaxed">
                      Không tìm thấy chứng chỉ tương ứng với mã <span className="text-brandDark font-bold">"{result?.verifyCode}"</span> trong cơ sở dữ liệu. Vui lòng kiểm tra lại.
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 border border-darkGrayBorder rounded-[999px] font-semibold text-xs uppercase tracking-wider text-brandDark hover:bg-offWhite1 transition-colors"
                  >
                    Tra cứu mã khác
                  </button>
                  {result?.status === 'valid' && (
                    <button
                      onClick={() => downloadCertificate(result.courseTitle, result.studentName, result.verifyCode)}
                      className="flex-1 py-3 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white rounded-[999px] font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Tải chứng chỉ (PNG)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
