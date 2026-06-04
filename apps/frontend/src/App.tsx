import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import AuthModal, { useAuthModal } from './components/AuthModal'
import CertificateModal from './components/CertificateModal'
import PricingModal from './components/PricingModal'
import CartDrawer from './components/CartDrawer'
import PaymentSuccessModal from './components/PaymentSuccessModal'
import { UserProfile, getCurrentUser, logoutUser } from './services/authService'
import { CartProvider, useCart } from './stores/cartStore'

// Pages
import HomePage from './pages/public/HomePage'
import CourseDetailPage from './pages/public/CourseDetailPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import StudentDashboard from './pages/student/StudentDashboard'
import StudyRoom from './pages/student/StudyRoom'
import CheckoutPageWrapper from './pages/student/CheckoutPageWrapper'

import PaymentReturnPage from './pages/student/PaymentReturnPage'

function AppInner() {
  const { modal, open, close } = useAuthModal()
  const [certificateOpen, setCertificateOpen] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [purchasedCount, setPurchasedCount] = useState(0)
  const { items } = useCart()

  // Retrieve user session on startup
  useEffect(() => {
    const sessionUser = getCurrentUser()
    if (sessionUser) {
      setUser(sessionUser)
    }
  }, [])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    window.location.href = '/' // Force reload to clear state and redirect to home
  }

  const handlePaymentSuccess = () => {
    setPurchasedCount(items.length)
    setPaymentSuccess(true)
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-offWhite1 font-sans antialiased text-brandDark">
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <HomePage 
                user={user} 
                onLogout={handleLogout}
                onLogin={() => open('login')}
                onRegister={() => open('register')}
                onCertificateClick={() => setCertificateOpen(true)}
                onPricingClick={() => setPricingOpen(true)}
                onCartClick={() => setCartOpen(true)}
              />
            } 
          />
          <Route 
            path="/course/:id" 
            element={
              <CourseDetailPage 
                user={user} 
                onLogout={handleLogout}
                onLogin={() => open('login')}
                onRegister={() => open('register')}
                onCertificateClick={() => setCertificateOpen(true)}
                onPricingClick={() => setPricingOpen(true)}
                onCartClick={() => setCartOpen(true)}
              />
            } 
          />
          <Route path="/payment/vnpay-return" element={<PaymentReturnPage />} />

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/student" element={<StudentDashboard user={user} onLogout={handleLogout} />} />
            <Route path="/student/study/:courseId" element={<StudyRoom user={user} />} />
            <Route path="/student/checkout" element={<CheckoutPageWrapper onSuccess={handlePaymentSuccess} />} />
          </Route>
        </Routes>

        {/* ── Footer (Chỉ hiện khi ở Public, xử lý ẩn hiện bên trong component nếu cần hoặc dùng hook useLocation. Tạm thời render cố định dưới Routes, các trang full screen như Dashboard/StudyRoom có bg cover) ── */}
        <Routes>
          <Route path="/student/*" element={null} /> {/* Ẩn footer ở luồng student */}
          <Route path="*" element={
            <footer className="bg-white border-t border-grayBorder py-12 mt-auto">
              <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <span className="font-poppins text-brandDark text-lg font-bold tracking-tight">
                    <span className="text-actionBlue">English</span>.Learn
                  </span>
                  <p className="text-secondaryText text-xs leading-relaxed mt-4 max-w-sm">
                    English.Learn is a comprehensive online English learning and exam preparation platform, providing personalized learning paths and a smart virtual testing room system.
                  </p>
                </div>
                <div>
                  <h4 className="font-poppins text-brandDark text-sm font-bold mb-4">Learning Paths</h4>
                  <ul className="space-y-2 text-xs text-secondaryText">
                    <li><a href="#courses" className="hover:text-actionBlue">IELTS Preparation</a></li>
                    <li><a href="#courses" className="hover:text-actionBlue">Communicative English</a></li>
                    <li><a href="#courses" className="hover:text-actionBlue">English for Beginners</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-poppins text-brandDark text-sm font-bold mb-4">Support</h4>
                  <ul className="space-y-2 text-xs text-secondaryText">
                    <li>Email: support@english-learn.vn</li>
                    <li>Hotline: 1900 8198</li>
                    <li><button onClick={() => setCertificateOpen(true)} className="hover:text-actionBlue text-left">Certificate Lookup</button></li>
                    <li><button onClick={() => setPricingOpen(true)} className="hover:text-actionBlue text-left">Pricing</button></li>
                  </ul>
                </div>
              </div>
              <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 mt-8 pt-8 border-t border-grayBorder text-center text-secondaryText text-[11px] font-semibold uppercase">
                © {new Date().getFullYear()} English.Learn Joint Stock Company. All rights reserved.
              </div>
            </footer>
          } />
        </Routes>

        {/* ── Modals ── */}
        <AuthModal
          type={modal}
          onClose={close}
          onSwitch={(type) => open(type)}
          onSuccess={(profile) => {
            setUser(profile)
            close()
            // Sau khi login xong, redirect sang student
            window.location.href = '/student';
          }}
        />
        <CertificateModal isOpen={certificateOpen} onClose={() => setCertificateOpen(false)} />
        <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} onAuth={() => open('register')} />
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false)
            if (user) {
               window.location.href = '/student/checkout';
            } else {
               open('login')
            }
          }}
          onLogin={() => {
            setCartOpen(false)
            open('login')
          }}
          isLoggedIn={!!user}
        />
        <PaymentSuccessModal
          isOpen={paymentSuccess}
          onClose={() => setPaymentSuccess(false)}
          onGoToDashboard={() => {
            setPaymentSuccess(false)
            window.location.href = '/student';
          }}
          courseCount={purchasedCount}
        />
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}
