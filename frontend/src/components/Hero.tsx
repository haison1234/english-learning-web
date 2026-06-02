import { SocialIconsDesktop, SocialIconsMobile } from './SocialIcons'
import { UserProfile } from '../services/authService'

// ── Props nhận từ App ──
interface HeroProps {
  user: UserProfile | null
  onLogout: () => void
  onLogin: () => void
  onRegister: () => void
  onCertificateClick: () => void
  onPricingClick: () => void
  onDashboardClick?: () => void
}

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4'

export default function Hero({ user, onLogout, onLogin, onRegister, onCertificateClick, onPricingClick, onDashboardClick }: HeroProps) {
  const handleNavClick = (link: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (link === 'Homepage') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (link === 'Courses') {
      document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })
    } else if (link === 'Certificate') {
      onCertificateClick()
    } else if (link === 'Pricing') {
      onPricingClick()
    } else if (link === 'Contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden rounded-b-[32px]">
      {/* ── Full-bleed video background ── */}
      <video
        src={HERO_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── Content container ── */}
      <div className="relative z-10 flex flex-col h-full max-w-[1831px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">

        {/* ── HEADER ── */}
        <header className="flex items-center justify-between pt-8 lg:pt-10">

          {/* Logo */}
          <button 
            onClick={() => user ? onDashboardClick?.() : window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-grotesk text-[#EFF4FF] text-[16px] uppercase tracking-wide hover:opacity-80 active:scale-95 transition-all text-left flex items-center gap-1 group"
            title={user ? "Vào Bảng điều khiển" : "Cuộn lên đầu trang"}
          >
            <span>English</span><span className="text-[#6FFF00] group-hover:animate-pulse">.Learn</span>
          </button>

          {/* Nav + Auth buttons – desktop only */}
          <div className="hidden lg:flex items-center gap-4">
            <nav className="liquid-glass flex items-center gap-8 rounded-[28px] px-[40px] py-[20px]">
              {['Homepage', 'Courses', 'Certificate', 'Pricing', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={(e) => handleNavClick(link, e)}
                  className="font-grotesk text-[#EFF4FF] text-[13px] uppercase hover:text-[#6FFF00] transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* Auth status */}
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onDashboardClick}
                  className="font-grotesk text-[#010828] text-[13px] uppercase px-6 py-[18px] rounded-[28px] hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg shadow-[#6FFF00]/10 font-bold"
                  style={{ background: '#6FFF00' }}
                >
                  Bảng điều khiển
                </button>
                <div className="flex items-center gap-2 rounded-[28px] px-4 py-[14px] liquid-glass border border-[#6FFF00]/20">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.fullName} 
                      className="w-7 h-7 rounded-full border border-[#6FFF00]/30 object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#6FFF00]/10 border border-[#6FFF00]/30 flex items-center justify-center text-[#6FFF00] font-grotesk text-xs uppercase">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                  <span className="font-grotesk text-[#EFF4FF] text-[13px] max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="font-grotesk text-[#EFF4FF]/70 hover:text-[#6FFF00] text-[13px] uppercase px-5 py-[18px] rounded-[28px] hover:bg-white/5 transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLogin}
                  className="liquid-glass font-grotesk text-[#EFF4FF] text-[13px] uppercase px-6 py-[18px] rounded-[28px] hover:bg-white/10 transition-colors duration-200"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={onRegister}
                  className="font-grotesk text-[#010828] text-[13px] uppercase px-6 py-[18px] rounded-[28px] hover:brightness-110 transition-all duration-200"
                  style={{ background: '#6FFF00' }}
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>

          {/* Desktop social icons – top-right */}
          <div className="hidden lg:flex">
            <SocialIconsDesktop />
          </div>

          {/* Mobile: auth status */}
          <div className="flex lg:hidden items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onDashboardClick}
                  className="font-grotesk text-[#010828] text-[11px] uppercase px-3 py-2 rounded-[16px] active:scale-95 transition-all font-bold"
                  style={{ background: '#6FFF00' }}
                >
                  Học ngay
                </button>
                <div className="w-8 h-8 rounded-full border border-[#6FFF00]/30 overflow-hidden flex items-center justify-center bg-white/5">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#6FFF00] font-grotesk text-xs uppercase">{user.fullName.charAt(0)}</span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="liquid-glass font-grotesk text-[#EFF4FF] text-[11px] uppercase px-3 py-2 rounded-[16px]"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="liquid-glass font-grotesk text-[#EFF4FF] text-[11px] uppercase px-4 py-2.5 rounded-[20px] hover:bg-white/10 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={onRegister}
                  className="font-grotesk text-[#010828] text-[11px] uppercase px-4 py-2.5 rounded-[20px]"
                  style={{ background: '#6FFF00' }}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </header>

        {/* ── HERO BODY ── */}
        <div className="flex flex-1 flex-col justify-end pb-12 sm:pb-16 md:pb-20 lg:pb-24">
          <div className="relative lg:ml-32" style={{ maxWidth: 780 }}>

            {/* Main heading */}
            <h1
              className="font-grotesk text-[#EFF4FF] uppercase leading-[1.05] lg:leading-[1]"
              style={{ fontSize: 'clamp(40px, 7vw, 90px)' }}
            >
              Beyond words
              <br />
              and ( its ) familiar
              <br />
              boundaries
            </h1>

            {/* Cursive accent overlay */}
            <span
              className="font-condiment text-[#6FFF00] absolute -rotate-1 opacity-90 pointer-events-none"
              style={{
                fontSize: 'clamp(24px, 3.5vw, 48px)',
                right: '-5%',
                top: '10%',
                mixBlendMode: 'exclusion',
              }}
            >
              English collection
            </span>
          </div>

          {/* Mobile social icons */}
          <SocialIconsMobile />
        </div>
      </div>
    </section>
  )
}
