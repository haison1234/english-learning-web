import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Collection from './components/Collection'
import CTA from './components/CTA'
import AuthModal, { useAuthModal } from './components/AuthModal'
import CertificateModal from './components/CertificateModal'
import PricingModal from './components/PricingModal'
import { UserProfile, getCurrentUser, logoutUser } from './services/authService'
import Dashboard from './pages/Dashboard'
import CourseDetail from './components/CourseDetail'

export default function App() {
  const { modal, open, close } = useAuthModal()
  const [certificateOpen, setCertificateOpen] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'course-detail'>('landing')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  // Retrieve user session on startup
  useEffect(() => {
    const sessionUser = getCurrentUser()
    if (sessionUser) {
      setUser(sessionUser)
      setCurrentView('dashboard')
    }
  }, [])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    setCurrentView('landing')
    setSelectedCourseId(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-offWhite1 font-sans antialiased text-brandDark">
      {/* ── Page sections ── */}
      {user && currentView === 'dashboard' ? (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          onNavigateLanding={() => setCurrentView('landing')} 
        />
      ) : currentView === 'course-detail' && selectedCourseId ? (
        <>
          <Hero 
            user={user}
            onLogout={handleLogout}
            onLogin={() => open('login')} 
            onRegister={() => open('register')}
            onCertificateClick={() => setCertificateOpen(true)}
            onPricingClick={() => setPricingOpen(true)}
            onDashboardClick={() => setCurrentView('dashboard')}
          />
          <CourseDetail
            courseId={selectedCourseId}
            onBack={() => {
              setCurrentView('landing')
              setSelectedCourseId(null)
            }}
            onEnroll={() => {
              if (user) {
                setCurrentView('dashboard')
              } else {
                open('register')
              }
            }}
            isLoggedIn={!!user}
          />
        </>
      ) : (
        <>
          <Hero 
            user={user}
            onLogout={handleLogout}
            onLogin={() => open('login')} 
            onRegister={() => open('register')}
            onCertificateClick={() => setCertificateOpen(true)}
            onPricingClick={() => setPricingOpen(true)}
            onDashboardClick={() => setCurrentView('dashboard')}
          />
          <About />
          <Collection onSelectCourse={(id) => {
            setSelectedCourseId(id)
            setCurrentView('course-detail')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }} />
          <CTA onRegisterClick={() => open('register')} />
        </>
      )}

      {/* ── Footer ── */}
      {currentView !== 'dashboard' && (
        <footer className="bg-white border-t border-grayBorder py-12">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <span className="font-poppins text-brandDark text-lg font-bold tracking-tight">
                <span className="text-actionBlue">English</span>.Learn
              </span>
              <p className="text-secondaryText text-xs leading-relaxed mt-4 max-w-sm">
                English.Learn là nền tảng học và luyện thi tiếng Anh trực tuyến toàn diện, cung cấp lộ trình học cá nhân hóa cùng hệ thống phòng luyện thi ảo thông minh.
              </p>
            </div>
            
            <div>
              <h4 className="font-poppins text-brandDark text-sm font-bold mb-4">Lộ trình học tập</h4>
              <ul className="space-y-2 text-xs text-secondaryText">
                <li><a href="#courses" className="hover:text-actionBlue">Luyện thi IELTS</a></li>
                <li><a href="#courses" className="hover:text-actionBlue">Tiếng Anh Giao Tiếp</a></li>
                <li><a href="#courses" className="hover:text-actionBlue">Tiếng Anh Cho Người Mới</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-poppins text-brandDark text-sm font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-xs text-secondaryText">
                <li>Email: support@english-learn.vn</li>
                <li>Hotline: 1900 8198</li>
                <li><button onClick={() => setCertificateOpen(true)} className="hover:text-actionBlue text-left">Tra cứu chứng chỉ</button></li>
                <li><button onClick={() => setPricingOpen(true)} className="hover:text-actionBlue text-left">Bảng giá khóa học</button></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 mt-8 pt-8 border-t border-grayBorder text-center text-secondaryText text-[11px] font-semibold uppercase">
            © {new Date().getFullYear()} English.Learn Joint Stock Company. All rights reserved.
          </div>
        </footer>
      )}

      {/* ── Auth Modal ── */}
      <AuthModal 
        type={modal} 
        onClose={close} 
        onSwitch={(type) => open(type)} 
        onSuccess={(profile) => {
          setUser(profile)
          setCurrentView('dashboard')
          close()
        }}
      />

      {/* ── Certificate Modal ── */}
      <CertificateModal 
        isOpen={certificateOpen} 
        onClose={() => setCertificateOpen(false)} 
      />

      {/* ── Pricing Modal ── */}
      <PricingModal 
        isOpen={pricingOpen} 
        onClose={() => setPricingOpen(false)} 
        onAuth={() => open('register')} 
      />
    </div>
  )
}
