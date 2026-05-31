import { useState } from 'react'
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { loginWithGoogle, UserProfile } from '../services/authService'

type ModalType = 'login' | 'register' | null

interface AuthModalProps {
  type: ModalType
  onClose: () => void
  onSwitch: (type: ModalType) => void
  onSuccess: (profile: UserProfile) => void
}

declare global {
  interface Window {
    google: any
  }
}

function AuthModal({ type, onClose, onSwitch, onSuccess }: AuthModalProps) {
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = () => {
    setError(null)
    if (typeof window.google === 'undefined') {
      setError('Thư viện đăng nhập Google đang tải. Vui lòng đợi trong giây lát!')
      return
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId || clientId.includes('placeholder')) {
      setError('Google Client ID chưa được cấu hình. Vui lòng kiểm tra file .env!')
      return
    }

    setIsLoading(true)

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: 'email profile openid',
      ux_mode: 'popup',
      callback: async (response: any) => {
        if (response.error) {
          setError(`Google OAuth Error: ${response.error}`)
          setIsLoading(false)
          return
        }

        if (response.code) {
          try {
            const authData = await loginWithGoogle(response.code)
            onSuccess(authData.user)
          } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi xác thực với máy chủ!')
          } finally {
            setIsLoading(false)
          }
        } else {
          setIsLoading(false)
        }
      },
      error_callback: () => {
        setError('Đăng nhập Google bị hủy hoặc gặp sự cố!')
        setIsLoading(false)
      }
    })

    client.requestCode()
  }

  if (!type) return null

  const isLogin = type === 'login'

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(1,8,40,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="liquid-glass rounded-[28px] w-full max-w-md mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X size={18} className="text-[#EFF4FF]" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="font-condiment text-[#6FFF00] text-2xl mb-1">
            {isLogin ? 'Welcome back' : 'Get started'}
          </p>
          <h2 className="font-grotesk text-[#EFF4FF] text-3xl uppercase">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          {/* Name – only on register */}
          {!isLogin && (
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EFF4FF]/40" />
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full bg-white/5 border border-white/10 rounded-[14px] py-3.5 pl-10 pr-4 text-[#EFF4FF] font-mono text-sm placeholder:text-[#EFF4FF]/30 focus:outline-none focus:border-[#6FFF00]/50 transition-colors"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EFF4FF]/40" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white/5 border border-white/10 rounded-[14px] py-3.5 pl-10 pr-4 text-[#EFF4FF] font-mono text-sm placeholder:text-[#EFF4FF]/30 focus:outline-none focus:border-[#6FFF00]/50 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EFF4FF]/40" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Mật khẩu"
              className="w-full bg-white/5 border border-white/10 rounded-[14px] py-3.5 pl-10 pr-11 text-[#EFF4FF] font-mono text-sm placeholder:text-[#EFF4FF]/30 focus:outline-none focus:border-[#6FFF00]/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EFF4FF]/40 hover:text-[#EFF4FF]/70 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm Password – only on register */}
          {!isLogin && (
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EFF4FF]/40" />
              <input
                type={showPw2 ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                className="w-full bg-white/5 border border-white/10 rounded-[14px] py-3.5 pl-10 pr-11 text-[#EFF4FF] font-mono text-sm placeholder:text-[#EFF4FF]/30 focus:outline-none focus:border-[#6FFF00]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw2((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EFF4FF]/40 hover:text-[#EFF4FF]/70 transition-colors"
              >
                {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}

          {/* Forgot password – login only */}
          {isLogin && (
            <div className="text-right -mt-1">
              <button type="button" className="font-mono text-xs text-[#EFF4FF]/40 hover:text-[#6FFF00] transition-colors uppercase">
                Quên mật khẩu?
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-[#EA4335]/15 border border-[#EA4335]/35 rounded-[14px] p-3.5 text-[#EA4335] font-mono text-xs text-center my-1">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-4 rounded-[14px] font-grotesk text-[#010828] text-sm uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#6FFF00' }}
          >
            {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-mono text-[11px] text-[#EFF4FF]/30 uppercase">hoặc</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 rounded-[14px] border border-white/10 font-mono text-sm text-[#EFF4FF]/70 hover:bg-white/5 transition-colors flex items-center justify-center gap-3 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {isLoading ? 'Đang kết nối...' : 'Tiếp tục với Google'}
          </button>
        </form>

        {/* Switch */}
        <p className="mt-6 text-center font-mono text-xs text-[#EFF4FF]/40 uppercase">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button
            onClick={() => onSwitch(isLogin ? 'register' : 'login')}
            className="text-[#6FFF00] hover:underline"
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </div>
  )
}

// ── Export hook + modal component ──
export function useAuthModal() {
  const [modal, setModal] = useState<ModalType>(null)
  return { modal, open: setModal, close: () => setModal(null) }
}

export default AuthModal
