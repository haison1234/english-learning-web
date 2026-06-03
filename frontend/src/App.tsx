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
    <>
      {/* ── Fixed texture overlay ── */}
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          backgroundImage: 'url(/texture.png)',
          backgroundSize: 'cover',
          mixBlendMode: 'lighten',
          opacity: 0.6,
        }}
      />

      {/* ── Page sections ── */}
      {user && currentView === 'dashboard' ? (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          onNavigateLanding={() => setCurrentView('landing')} 
        />
      ) : currentView === 'course-detail' && selectedCourseId ? (
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
          <CTA />
        </>
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
    </>
  )
}


