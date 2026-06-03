import { useState, useEffect } from 'react'
import { User, Menu, X, ArrowRight, Award, CheckCircle } from 'lucide-react'
import { UserProfile } from '../services/authService'

interface HeroProps {
  user: UserProfile | null
  onLogout: () => void
  onLogin: () => void
  onRegister: () => void
  onCertificateClick: () => void
  onPricingClick: () => void
  onDashboardClick?: () => void
}

export default function Hero({
  user,
  onLogout,
  onLogin,
  onRegister,
  onCertificateClick,
  onPricingClick,
  onDashboardClick,
}: HeroProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Track window scroll to make header background solid
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (targetId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (targetId === 'certificate') {
      onCertificateClick()
    } else if (targetId === 'pricing') {
      onPricingClick()
    } else {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <section id="home" className="relative w-full bg-offWhite1 overflow-hidden min-h-screen flex flex-col">
      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 h-18 z-50 transition-all duration-300 flex items-center ${
          scrolled ? 'bg-white shadow-l1 border-b border-grayBorder' : 'bg-transparent'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => user ? onDashboardClick?.() : window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-poppins text-brandDark text-xl font-bold tracking-tight hover:opacity-80 active:scale-95 transition-all text-left flex items-center gap-1.5"
          >
            <span className="text-actionBlue">English</span>
            <span className="text-brandDark">.Learn</span>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Trang chủ', id: 'home' },
              { label: 'Khóa học', id: 'courses' },
              { label: 'Tra cứu chứng chỉ', id: 'certificate' },
              { label: 'Bảng giá', id: 'pricing' },
              { label: 'Giới thiệu', id: 'about' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(link.id, e)}
                className="text-brandDark hover:text-actionBlue font-medium text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth & CTAs (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-[999px] bg-white border border-grayBorder hover:bg-offWhite1 hover:border-darkGrayBorder transition-all active:scale-95"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-6 h-6 rounded-full object-cover border border-grayBorder"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-actionBlue/10 flex items-center justify-center text-actionBlue font-semibold text-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-brandDark font-semibold text-sm max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-[16px] bg-white border border-grayBorder p-2 shadow-l3 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-grayBorder">
                        <p className="text-[10px] text-secondaryText uppercase tracking-widest font-bold">Học viên</p>
                        <p className="text-sm font-semibold text-brandDark truncate mt-0.5">{user.fullName}</p>
                        <p className="text-xs text-secondaryText truncate">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          onDashboardClick?.()
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-1 text-sm text-brandDark hover:text-actionBlue hover:bg-offWhite1 rounded-lg transition-colors text-left font-medium"
                      >
                        Vào học ngay
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          onLogout()
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-0.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onLogin}
                  className="px-5 py-2 text-brandDark hover:text-actionBlue font-semibold text-sm transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={onRegister}
                  className="px-5 py-2 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white font-semibold text-sm rounded-[999px] shadow-l1 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Đăng ký miễn phí
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu Icon (Mobile) */}
          <div className="flex lg:hidden items-center gap-4">
            {user && (
              <button
                onClick={onDashboardClick}
                className="px-3.5 py-1.5 bg-actionBlue text-white font-semibold text-xs rounded-[999px] uppercase"
              >
                Học ngay
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brandDark hover:bg-offWhite2 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6 flex flex-col gap-6 animate-in slide-in-from-right duration-200">
          <nav className="flex flex-col gap-5">
            {[
              { label: 'Trang chủ', id: 'home' },
              { label: 'Khóa học', id: 'courses' },
              { label: 'Tra cứu chứng chỉ', id: 'certificate' },
              { label: 'Bảng giá', id: 'pricing' },
              { label: 'Giới thiệu', id: 'about' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(link.id, e)}
                className="text-brandDark font-semibold text-base py-2 border-b border-grayBorder"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onLogout()
                }}
                className="w-full py-3 border border-darkGrayBorder text-red-500 rounded-[999px] font-semibold text-sm text-center"
              >
                Đăng xuất
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onLogin()
                  }}
                  className="w-full py-3 border border-darkGrayBorder text-brandDark rounded-[999px] font-semibold text-sm text-center"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onRegister()
                  }}
                  className="w-full py-3 bg-actionBlue text-white rounded-[999px] font-semibold text-sm text-center shadow-l1"
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── HERO BODY SECTION ── */}
      <div className="flex-1 flex items-center pt-24 pb-16 md:py-32">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Key Benefits */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="text-actionBlue font-poppins text-xs font-bold tracking-widest uppercase mb-3.5 bg-actionBlue/5 px-3 py-1.5 rounded-[999px] flex items-center gap-1.5">
              <CheckCircle size={14} /> HỌC TẬP THÔNG MINH - ĐỘT PHÁ ĐIỂM SỐ
            </span>

            <h1 className="font-poppins text-brandDark text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-tight mb-5">
              Học Tiếng Anh Hiệu Quả Với <span className="text-actionBlue">Phòng Luyện Thi Ảo</span>
            </h1>

            <p className="text-secondaryText text-sm sm:text-base leading-relaxed max-w-xl mb-8">
              Nền tảng E-Learning tiếng Anh chuẩn Prep.vn. Luyện phát âm chuẩn Mỹ, làm đề thi thử không giới hạn và nhận phản hồi chấm chữa lập tức từ AI thông minh.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={user ? onDashboardClick : onRegister}
                className="w-full sm:w-auto px-8 py-4 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white font-bold text-sm rounded-[999px] shadow-l1 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Học thử miễn phí ngay</span>
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => handleNavClick('courses', {} as any)}
                className="w-full sm:w-auto px-8 py-4 text-brandDark hover:text-actionBlue font-semibold text-sm transition-colors border border-transparent hover:border-grayBorder rounded-[999px]"
              >
                Xem danh sách khóa học
              </button>
            </div>

            {/* Micro Stats Banner */}
            <div className="flex items-center gap-8 mt-12 border-t border-grayBorder pt-6 w-full lg:w-auto justify-around sm:justify-start">
              <div>
                <p className="font-poppins text-brandDark text-2xl font-bold">50,000+</p>
                <p className="text-secondaryText text-[11px] font-semibold uppercase tracking-wider">Học viên tin dùng</p>
              </div>
              <div className="border-l border-grayBorder h-8" />
              <div>
                <p className="font-poppins text-brandDark text-2xl font-bold">95.4%</p>
                <p className="text-secondaryText text-[11px] font-semibold uppercase tracking-wider">Đạt mục tiêu đầu ra</p>
              </div>
              <div className="border-l border-grayBorder h-8" />
              <div>
                <p className="font-poppins text-brandDark text-2xl font-bold">24/7</p>
                <p className="text-secondaryText text-[11px] font-semibold uppercase tracking-wider">Phản hồi phòng ảo</p>
              </div>
            </div>
          </div>

          {/* Right Column: Illustration Mockup */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-actionBlue/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Clean Illustration Mocking Study Room */}
            <div className="relative bg-white border border-grayBorder shadow-l2 rounded-[24px] p-6 max-w-lg w-full">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between pb-4 border-b border-grayBorder mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                </div>
                <div className="bg-offWhite1 border border-grayBorder rounded-md px-3 py-1 text-[10px] text-secondaryText font-mono">
                  speaking-room.english-learn.vn
                </div>
              </div>

              {/* Fake UI Body */}
              <div className="space-y-4">
                <div className="bg-actionBlue/5 border border-actionBlue/10 rounded-xl p-4">
                  <p className="text-xs text-actionBlue font-bold uppercase mb-1">Đề bài:</p>
                  <p className="text-xs text-brandDark font-medium leading-relaxed">
                    "Describe a memorable journey you have taken in your life."
                  </p>
                </div>

                <div className="bg-offWhite1 border border-grayBorder rounded-xl p-4 relative overflow-hidden">
                  <p className="text-xs text-secondaryText uppercase tracking-wider font-bold mb-2">Đánh giá phát âm từ AI:</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-successGreenText bg-successGreenBg/40 px-2 py-0.5 rounded font-mono border border-successGreenText/10">I went</span>
                    <span className="text-xs text-successGreenText bg-successGreenBg/40 px-2 py-0.5 rounded font-mono border border-successGreenText/10">to a beautiful</span>
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded font-mono border border-red-500/10 underline decoration-red-500 font-bold" title="Phát âm chưa chuẩn">beach</span>
                    <span className="text-xs text-successGreenText bg-successGreenBg/40 px-2 py-0.5 rounded font-mono border border-successGreenText/10">last summer...</span>
                  </div>
                  <p className="text-[10px] text-red-500 font-medium mt-2">
                    * Từ "beach" phát âm hơi ngắn, dễ nhầm sang từ nhạy cảm. Gợi ý: kéo dài nguyên âm /iː/.
                  </p>
                </div>

                {/* Score badge */}
                <div className="flex items-center justify-between bg-white border border-grayBorder rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-actionBlue" />
                    <span className="text-xs text-brandDark font-semibold">Ước lượng band điểm:</span>
                  </div>
                  <span className="text-sm text-actionBlue font-bold font-poppins">6.5 - 7.0 IELTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
