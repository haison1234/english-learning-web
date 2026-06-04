import { useState, useEffect } from 'react'
import { User, Menu, X, ArrowRight, Award, CheckCircle, ShoppingCart } from 'lucide-react'
import { UserProfile } from '../services/authService'
import { useCart } from '../stores/cartStore'
import { useNavigate } from 'react-router-dom'

interface HeroProps {
  user: UserProfile | null
  onLogout: () => void
  onLogin: () => void
  onRegister: () => void
  onCertificateClick: () => void
  onPricingClick: () => void
  onDashboardClick?: () => void
  onCartClick?: () => void
}

export default function Hero({
  user,
  onLogout,
  onLogin,
  onRegister,
  onCertificateClick,
  onPricingClick,
  onCartClick,
}: HeroProps) {
  const navigate = useNavigate()
  const { totalItems } = useCart()
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
        className={`fixed top-0 left-0 right-0 h-[72px] z-50 transition-all duration-300 flex items-center ${
          scrolled ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-grayBorder/50' : 'bg-transparent'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => user ? navigate('/student') : navigate('/')}
            className="font-poppins text-brandDark text-xl font-bold tracking-tight hover:opacity-80 active:scale-95 transition-all text-left flex items-center"
          >
            <span className="text-actionBlue">English.</span>
            <span className="text-brandDark">Learn</span>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { label: 'Home', id: 'home' },
              { label: 'Courses', id: 'courses' },
              { label: 'Certificates', id: 'certificate' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'About', id: 'about' },
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(link.id, e)}
                className="relative text-brandDark hover:text-actionBlue font-semibold text-[15px] transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-actionBlue hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth & CTAs (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-brandDark hover:bg-offWhite1 hover:text-actionBlue transition-colors"
              title="Giỏ hàng"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-actionBlue text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

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
                          navigate('/student')
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-1 text-sm text-brandDark hover:text-actionBlue hover:bg-offWhite1 rounded-lg transition-colors text-left font-medium"
                      >
                        Go to Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          onLogout()
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-0.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-brandDark hover:text-actionBlue font-semibold text-[15px] transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={onRegister}
                  className="px-6 py-2.5 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white font-semibold text-[15px] rounded-[999px] shadow-sm hover:shadow hover:-translate-y-[1px] active:translate-y-0 transition-all"
                >
                  Sign up for free
                </button>
              </div>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-3">
            {/* Cart Icon Mobile */}
            <button
              onClick={onCartClick}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-brandDark hover:bg-offWhite1 hover:text-actionBlue transition-colors"
              title="Giỏ hàng"
            >
              <ShoppingCart size={19} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-actionBlue text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            {user && (
              <button
                onClick={() => navigate('/student')}
                className="px-3.5 py-1.5 bg-actionBlue text-white font-semibold text-xs rounded-[999px] uppercase"
              >
                Learn Now
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
              { label: 'Home', id: 'home' },
              { label: 'Courses', id: 'courses' },
              { label: 'Certificates', id: 'certificate' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'About', id: 'about' },
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
                Log out
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
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onRegister()
                  }}
                  className="w-full py-3 bg-actionBlue text-white rounded-[999px] font-semibold text-sm text-center shadow-l1"
                >
                  Sign up
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
              <CheckCircle size={14} /> SMART LEARNING - BOOST YOUR SCORE
            </span>

            <h1 className="font-poppins text-brandDark text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.2] mb-6">
              Master English With <span className="text-actionBlue">Virtual Practice Rooms</span>
            </h1>

            <p className="text-secondaryText text-base sm:text-lg leading-relaxed max-w-xl mb-10">
              The premier E-Learning platform for English. Practice American pronunciation, take unlimited mock tests, and get instant feedback from our smart AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={user ? () => navigate('/student') : onRegister}
                className="w-full sm:w-auto px-8 py-4 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white font-bold text-base rounded-[999px] shadow-l1 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Start learning for free</span>
                <ArrowRight size={18} />
              </button>
              
              <button
                onClick={() => handleNavClick('courses', {} as any)}
                className="w-full sm:w-auto px-8 py-4 text-brandDark bg-white hover:bg-offWhite1 hover:text-actionBlue font-semibold text-base transition-all border border-grayBorder rounded-[999px] shadow-sm flex items-center justify-center"
              >
                View all courses
              </button>
            </div>

            {/* Micro Stats Banner */}
            <div className="flex items-center gap-8 mt-12 border-t border-grayBorder pt-6 w-full lg:w-auto justify-around sm:justify-start">
              <div>
                <p className="font-poppins text-brandDark text-2xl font-bold">50,000+</p>
                <p className="text-secondaryText text-[11px] font-semibold uppercase tracking-wider">Trusted learners</p>
              </div>
              <div className="border-l border-grayBorder h-8" />
              <div>
                <p className="font-poppins text-brandDark text-2xl font-bold">95.4%</p>
                <p className="text-secondaryText text-[11px] font-semibold uppercase tracking-wider">Target achieved</p>
              </div>
              <div className="border-l border-grayBorder h-8" />
              <div>
                <p className="font-poppins text-brandDark text-2xl font-bold">24/7</p>
                <p className="text-secondaryText text-[11px] font-semibold uppercase tracking-wider">Virtual feedback</p>
              </div>
            </div>
          </div>

          {/* Right Column: Illustration Mockup */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-actionBlue/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Clean Illustration Mocking Study Room */}
            <div className="relative bg-white border border-grayBorder shadow-l2 rounded-[24px] p-8 max-w-lg w-full">
              {/* Fake UI Header */}
              <div className="flex items-center justify-between pb-5 border-b border-grayBorder mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
                </div>
                <div className="bg-offWhite1 border border-grayBorder rounded-md px-3 py-1.5 text-[11px] text-secondaryText font-mono">
                  speaking-room.english-learn.vn
                </div>
              </div>

              {/* Fake UI Body */}
              <div className="space-y-5">
                <div className="bg-actionBlue/5 border border-actionBlue/10 rounded-xl p-5">
                  <p className="text-xs text-actionBlue font-bold uppercase mb-2">Topic:</p>
                  <p className="text-sm text-brandDark font-semibold leading-relaxed">
                    "Describe a memorable journey you have taken in your life."
                  </p>
                </div>

                <div className="bg-offWhite1 border border-grayBorder rounded-xl p-5 relative overflow-hidden">
                  <p className="text-xs text-secondaryText uppercase tracking-wider font-bold mb-3">AI Pronunciation Assessment:</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-sm text-successGreenText bg-successGreenBg/40 px-2.5 py-1 rounded font-mono border border-successGreenText/10">I went</span>
                    <span className="text-sm text-successGreenText bg-successGreenBg/40 px-2.5 py-1 rounded font-mono border border-successGreenText/10">to a beautiful</span>
                    <span className="text-sm text-red-500 bg-red-50 px-2.5 py-1 rounded font-mono border border-red-500/10 underline decoration-red-500 font-bold" title="Incorrect pronunciation">beach</span>
                    <span className="text-sm text-successGreenText bg-successGreenBg/40 px-2.5 py-1 rounded font-mono border border-successGreenText/10">last summer...</span>
                  </div>
                  <p className="text-xs text-red-500 font-medium leading-relaxed">
                    * The word "beach" is pronounced slightly short. Tip: lengthen the /iː/ vowel.
                  </p>
                </div>

                {/* Score badge */}
                <div className="flex items-center justify-between bg-white border border-grayBorder rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Award size={20} className="text-actionBlue" />
                    <span className="text-sm text-brandDark font-bold">Estimated Band Score:</span>
                  </div>
                  <span className="text-base text-actionBlue font-extrabold font-poppins">6.5 - 7.0 IELTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
