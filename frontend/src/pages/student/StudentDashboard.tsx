import { useEffect, useMemo, useState } from 'react'
import type { ElementType } from 'react'
import { BarChart3, Bell, Check, BookOpen, CheckCircle, ChevronRight, Clock, LogOut, Play, User, Key } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserProfile, changePassword, updateProfile, getLeaderboard, LeaderboardEntry } from '../../services/authService'
import { getMyLearningCourses, MyCourseLearningDTO } from '../../services/learningService'
import { getStudentNotifications, markNotificationAsRead, markAllNotificationsAsRead, StudentNotificationDTO } from '../../services/studentService'

interface StudentDashboardProps {
  user: UserProfile | null
  onLogout: () => void
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const navigate = useNavigate()
  const [myCourses, setMyCourses] = useState<MyCourseLearningDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Notifications State
  const [notifications, setNotifications] = useState<StudentNotificationDTO[]>([])
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null)

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length
  }, [notifications])

  const loadNotifications = async () => {
    try {
      const data = await getStudentNotifications()
      setNotifications(data)
    } catch (err) {
      console.error('Lỗi tải thông báo:', err)
    }
  }

  useEffect(() => {
    loadNotifications()
    // Poll every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleNotifClick = async (notif: StudentNotificationDTO) => {
    if (expandedNotifId === notif.id) {
      setExpandedNotifId(null)
    } else {
      setExpandedNotifId(notif.id)
    }

    if (!notif.isRead) {
      try {
        await markNotificationAsRead(notif.id)
        setNotifications(prev =>
          prev.map(n => (n.id === notif.id ? { ...n, isRead: true } : n))
        )
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    // Close notifications dropdown on click outside
    if (!isNotifOpen) return
    const handleOutsideClick = () => setIsNotifOpen(false)
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [isNotifOpen])

  // Change password states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [changePassError, setChangePassError] = useState<string | null>(null)
  const [changePassSuccess, setChangePassSuccess] = useState(false)
  const [changePassLoading, setChangePassLoading] = useState(false)

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangePassError(null)
    setChangePassSuccess(false)

    if (newPass.length < 6) {
      setChangePassError('Mật khẩu mới phải từ 6 ký tự trở lên.')
      return
    }

    if (newPass !== confirmPass) {
      setChangePassError('Xác nhận mật khẩu mới không khớp.')
      return
    }

    try {
      setChangePassLoading(true)
      await changePassword(oldPass, newPass)
      setChangePassSuccess(true)
      setOldPass('')
      setNewPass('')
      setConfirmPass('')
      setTimeout(() => {
        setIsChangePasswordOpen(false)
        setChangePassSuccess(false)
      }, 2000)
    } catch (err) {
      setChangePassError(err instanceof Error ? err.message : 'Lỗi không xác định.')
    } finally {
      setChangePassLoading(false)
    }
  }

  // Edit Profile states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [editProfileError, setEditProfileError] = useState<string | null>(null)
  const [editProfileSuccess, setEditProfileSuccess] = useState(false)
  const [editProfileLoading, setEditProfileLoading] = useState(false)

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditProfileError(null)
    setEditProfileSuccess(false)

    if (!editName.trim()) {
      setEditProfileError('Họ tên không được để trống.')
      return
    }

    try {
      setEditProfileLoading(true)
      await updateProfile(editName.trim(), editAvatar.trim() || null)
      setEditProfileSuccess(true)
      setTimeout(() => {
        setIsEditProfileOpen(false)
        setEditProfileSuccess(false)
        window.location.reload()
      }, 1500)
    } catch (err) {
      setEditProfileError(err instanceof Error ? err.message : 'Lỗi không xác định.')
    } finally {
      setEditProfileLoading(false)
    }
  }

  // Leaderboard states
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  // Certificate states
  const [viewingCertificate, setViewingCertificate] = useState<{ courseTitle: string, certCode: string } | null>(null)

  const downloadCertificate = (courseTitle: string, studentName: string, certCode: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, '#f9fafb')
    gradient.addColorStop(1, '#f3f4f6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Draw borders
    ctx.lineWidth = 15
    ctx.strokeStyle = '#1e3a8a'
    ctx.strokeRect(20, 20, 760, 560)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#d97706'
    ctx.strokeRect(30, 30, 740, 540)

    // Draw Content
    ctx.textAlign = 'center'
    
    // Title
    ctx.font = 'bold 36px Times New Roman'
    ctx.fillStyle = '#1e3a8a'
    ctx.fillText('CHUNG CHI HOAN THANH', 400, 120)

    ctx.font = 'italic 18px Georgia'
    ctx.fillStyle = '#4b5563'
    ctx.fillText('Chung nhan hoc vien', 400, 180)

    // Student Name
    ctx.font = 'bold 32px Georgia'
    ctx.fillStyle = '#111827'
    ctx.fillText(studentName, 400, 230)

    ctx.font = '16px Georgia'
    ctx.fillStyle = '#4b5563'
    ctx.fillText('Da hoan thanh xuat sac khoa hoc', 400, 280)

    // Course Title
    ctx.font = 'bold 26px Georgia'
    ctx.fillStyle = '#1e3a8a'
    ctx.fillText(courseTitle, 400, 330)

    ctx.font = '14px Georgia'
    ctx.fillStyle = '#6b7280'
    ctx.fillText('He thong hoc tieng Anh truc tuyen E-Learning', 400, 380)

    // Golden Seal
    ctx.beginPath()
    ctx.arc(400, 460, 35, 0, 2 * Math.PI)
    ctx.fillStyle = '#fbbf24'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#d97706'
    ctx.stroke()
    
    ctx.font = 'bold 12px Georgia'
    ctx.fillStyle = '#d97706'
    ctx.fillText('VERIFIED', 400, 464)

    // Date & Code
    ctx.font = '12px Courier New'
    ctx.fillStyle = '#6b7280'
    ctx.fillText(`Ma so: ${certCode}`, 400, 520)
    ctx.fillText(`Ngay cap: ${new Date().toLocaleDateString('vi-VN')}`, 400, 540)

    // Trigger download
    const link = document.createElement('a')
    link.download = `ChungChi_${courseTitle.replace(/\s+/g, '_')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const [courses, leaderboardData] = await Promise.all([
          getMyLearningCourses(),
          getLeaderboard()
        ])
        setMyCourses(courses)
        setLeaderboard(leaderboardData)
      } catch (err) {
        console.error('Lỗi tải dữ liệu học viên:', err)
        setError('Không thể tải thông tin học tập của bạn.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const summary = useMemo(() => {
    const totalCourses = myCourses.length
    const totalLessons = myCourses.reduce((sum, course) => sum + course.totalLessons, 0)
    const completedLessons = myCourses.reduce((sum, course) => sum + course.completedLessons, 0)
    const totalSeconds = myCourses.reduce((sum, course) => sum + course.totalTimeSpentSeconds, 0)
    const averageProgress = totalCourses === 0
      ? 0
      : Math.round(myCourses.reduce((sum, course) => sum + course.progressPercent, 0) / totalCourses)

    return {
      totalCourses,
      totalLessons,
      completedLessons,
      totalSeconds,
      averageProgress,
    }
  }, [myCourses])

  if (!user) return null

  const handleStartStudy = (courseId: string) => {
    navigate(`/student/study/${courseId}`)
  }

  return (
    <div className="min-h-screen bg-offWhite1 text-brandDark pb-16">
      <nav className="w-full border-b border-grayBorder bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="font-poppins text-xl font-bold tracking-tight flex items-center gap-1.5 hover:opacity-80"
          >
            <span className="text-actionBlue">English.</span>
            <span>Learn</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-10 h-10 rounded-full border border-grayBorder bg-white hover:bg-offWhite2 transition-colors flex items-center justify-center relative"
                title="Thông báo"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-grayBorder rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-grayBorder bg-offWhite1 flex items-center justify-between">
                    <span className="font-poppins font-bold text-sm">Thông báo ({notifications.length})</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-actionBlue hover:text-actionBlueHover font-semibold flex items-center gap-1"
                      >
                        <Check size={14} />
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="max-h-[360px] overflow-y-auto divide-y divide-grayBorder">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-secondaryText">
                        Bạn chưa có thông báo nào.
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const isExpanded = expandedNotifId === notif.id;
                        return (
                          <div
                            key={notif.id}
                            onClick={() => handleNotifClick(notif)}
                            className={`p-4 hover:bg-offWhite1 cursor-pointer transition-colors ${
                              !notif.isRead ? 'bg-actionBlue/5' : ''
                            }`}
                          >
                            <div className="flex gap-2.5 items-start">
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full bg-actionBlue shrink-0 mt-1.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-poppins font-bold text-sm text-brandDark truncate">
                                  {notif.title}
                                </p>
                                <p className={`text-xs text-secondaryText mt-1 ${isExpanded ? 'whitespace-pre-line' : 'line-clamp-2'}`}>
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-secondaryText/70 mt-2 font-medium">
                                  {new Date(notif.createdAt).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {user.streakCount !== undefined && user.streakCount > 0 && (
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-600 font-bold text-xs shadow-sm hover:scale-105 transition-transform"
                title={`Chuỗi ${user.streakCount} ngày học liên tiếp!`}
              >
                <span>🔥</span>
                <span>{user.streakCount} ngày</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-grayBorder bg-offWhite1">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-grayBorder" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-actionBlue/10 text-actionBlue flex items-center justify-center font-bold text-xs">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-semibold max-w-[180px] truncate">{user.fullName}</span>
            </div>
            <button
              onClick={() => {
                setEditName(user.fullName);
                setEditAvatar(user.avatarUrl || '');
                setIsEditProfileOpen(true);
              }}
              className="w-10 h-10 rounded-full border border-grayBorder bg-white hover:bg-offWhite2 transition-colors flex items-center justify-center text-secondaryText hover:text-brandDark"
              title="Chỉnh sửa hồ sơ"
            >
              <User size={18} />
            </button>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="w-10 h-10 rounded-full border border-grayBorder bg-white hover:bg-offWhite2 transition-colors flex items-center justify-center text-secondaryText hover:text-brandDark"
              title="Đổi mật khẩu"
            >
              <Key size={18} />
            </button>
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-full border border-grayBorder bg-white hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center text-secondaryText hover:text-red-500"
              title="Dang xuat"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 mt-8">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-actionBlue">Dashboard hoc vien</p>
              <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold mt-2">
                Khoa hoc cua toi
              </h1>
              <p className="text-sm text-secondaryText mt-2 max-w-2xl">
                Theo doi tien do tat ca khoa hoc da dang ky va tiep tuc bai hoc dang hoc.
              </p>
            </div>
            <button
              onClick={() => myCourses[0] && handleStartStudy(myCourses[0].courseId)}
              disabled={myCourses.length === 0}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-actionBlue hover:bg-actionBlueHover disabled:opacity-50 disabled:hover:bg-actionBlue text-white rounded-full font-bold text-sm transition-colors"
            >
              <Play size={16} fill="currentColor" />
              Tiep tuc hoc
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryBox label="Khoa hoc" value={summary.totalCourses.toString()} icon={BookOpen} />
          <SummaryBox label="Tien do TB" value={`${summary.averageProgress}%`} icon={BarChart3} />
          <SummaryBox label="Bai da xem" value={`${summary.completedLessons}/${summary.totalLessons}`} icon={CheckCircle} />
          <SummaryBox label="Thoi gian hoc" value={formatDuration(summary.totalSeconds)} icon={Clock} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          {/* Left Column: Courses */}
          <div className="lg:col-span-2 bg-white border border-grayBorder rounded-[16px] shadow-l1">
            <div className="px-5 py-4 border-b border-grayBorder flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={18} className="text-actionBlue" />
                <h2 className="font-poppins font-bold">Danh sach khoa hoc dang hoc</h2>
              </div>
              <span className="text-xs text-secondaryText font-semibold">{myCourses.length} khoa hoc</span>
            </div>

            {loading ? (
              <div className="py-14 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-actionBlue" />
              </div>
            ) : error ? (
              <div className="p-6 text-sm text-red-600">{error}</div>
            ) : myCourses.length === 0 ? (
              <div className="p-8 text-center text-sm text-secondaryText">
                Ban chua co khoa hoc nao da dang ky thanh cong.
              </div>
            ) : (
              <div className="divide-y divide-grayBorder">
                {myCourses.map((course, index) => (
                  <CourseProgressRow
                    key={course.courseId}
                    course={course}
                    index={index}
                    onOpen={() => handleStartStudy(course.courseId)}
                    onViewCertificate={(courseTitle, certCode) => {
                      setViewingCertificate({ courseTitle, certCode })
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Leaderboard */}
          <div className="bg-white border border-grayBorder rounded-[16px] shadow-l1 p-5">
            <div className="flex items-center gap-2 border-b border-grayBorder pb-3 mb-4">
              <span className="text-lg">🏆</span>
              <h2 className="font-poppins font-bold text-brandDark">Bảng xếp hạng</h2>
            </div>
            {leaderboard.length === 0 ? (
              <p className="text-xs text-secondaryText py-4 text-center">Chưa có dữ liệu xếp hạng.</p>
            ) : (
              <div className="space-y-3.5">
                {leaderboard.slice(0, 5).map((entry, index) => {
                  const isCurrentUser = user && entry.fullName === user.fullName;
                  const rankIcons = ['🥇', '🥈', '🥉'];
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${isCurrentUser ? 'bg-actionBlue/5 border border-actionBlue/10' : 'hover:bg-offWhite1'}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-poppins font-bold text-xs w-5 text-center text-secondaryText">
                          {index < 3 ? rankIcons[index] : `${index + 1}`}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isCurrentUser ? 'text-actionBlue' : 'text-brandDark'}`}>
                            {entry.fullName}
                          </p>
                          <p className="text-[10px] text-secondaryText mt-0.5">
                            Đã học: {entry.completedCount} bài
                          </p>
                        </div>
                      </div>
                      
                      {entry.streakCount > 0 && (
                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 shrink-0">
                          <span>🔥</span>
                          <span>{entry.streakCount}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Change Password Modal ── */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-brandDark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-grayBorder shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between border-b border-grayBorder pb-4">
              <h3 className="font-poppins font-bold text-lg text-brandDark">Đổi mật khẩu</h3>
              <button
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setOldPass('');
                  setNewPass('');
                  setConfirmPass('');
                  setChangePassError(null);
                  setChangePassSuccess(false);
                }}
                className="text-secondaryText hover:text-brandDark"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordChangeSubmit} className="mt-4 space-y-4">
              {changePassError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {changePassError}
                </div>
              )}
              {changePassSuccess && (
                <div className="p-3 text-xs bg-green-50 border border-green-200 text-green-600 rounded-lg">
                  Đổi mật khẩu thành công!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider mb-1.5">
                  Mật khẩu cũ
                </label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  required
                  placeholder="Nhập mật khẩu cũ..."
                  className="w-full px-4 py-2.5 bg-offWhite1 border border-grayBorder rounded-xl text-sm focus:outline-none focus:border-actionBlue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider mb-1.5">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-4 py-2.5 bg-offWhite1 border border-grayBorder rounded-xl text-sm focus:outline-none focus:border-actionBlue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-4 py-2.5 bg-offWhite1 border border-grayBorder rounded-xl text-sm focus:outline-none focus:border-actionBlue"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false);
                    setOldPass('');
                    setNewPass('');
                    setConfirmPass('');
                    setChangePassError(null);
                    setChangePassSuccess(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-secondaryText hover:text-brandDark"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={changePassLoading}
                  className="px-5 py-2 rounded-xl bg-actionBlue hover:bg-actionBlueHover text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {changePassLoading ? 'Đang lưu...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-brandDark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-grayBorder shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between border-b border-grayBorder pb-4">
              <h3 className="font-poppins font-bold text-lg text-brandDark">Chỉnh sửa hồ sơ</h3>
              <button
                onClick={() => {
                  setIsEditProfileOpen(false);
                  setEditName('');
                  setEditAvatar('');
                  setEditProfileError(null);
                  setEditProfileSuccess(false);
                }}
                className="text-secondaryText hover:text-brandDark"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProfileSubmit} className="mt-4 space-y-4">
              {editProfileError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {editProfileError}
                </div>
              )}
              {editProfileSuccess && (
                <div className="p-3 text-xs bg-green-50 border border-green-200 text-green-600 rounded-lg">
                  Cập nhật thông tin thành công!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="Nhập họ và tên..."
                  className="w-full px-4 py-2.5 bg-offWhite1 border border-grayBorder rounded-xl text-sm focus:outline-none focus:border-actionBlue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondaryText uppercase tracking-wider mb-1.5">
                  Link ảnh đại diện (Avatar URL)
                </label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Nhập URL ảnh đại diện..."
                  className="w-full px-4 py-2.5 bg-offWhite1 border border-grayBorder rounded-xl text-sm focus:outline-none focus:border-actionBlue"
                />
                <p className="text-[10px] text-secondaryText mt-1">
                  Nhập liên kết hình ảnh trực tiếp (ví dụ: https://images.unsplash.com/...)
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditProfileOpen(false);
                    setEditName('');
                    setEditAvatar('');
                    setEditProfileError(null);
                    setEditProfileSuccess(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-secondaryText hover:text-brandDark"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editProfileLoading}
                  className="px-5 py-2 rounded-xl bg-actionBlue hover:bg-actionBlueHover text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {editProfileLoading ? 'Đang lưu...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Certificate Modal ── */}
      {viewingCertificate && (
        <div className="fixed inset-0 bg-brandDark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-grayBorder shadow-xl max-w-xl w-full p-6">
            <div className="flex items-center justify-between border-b border-grayBorder pb-4">
              <h3 className="font-poppins font-bold text-lg text-brandDark">Chứng chỉ khóa học</h3>
              <button
                onClick={() => setViewingCertificate(null)}
                className="text-secondaryText hover:text-brandDark"
              >
                ✕
              </button>
            </div>

            {/* Certificate Preview Card */}
            <div className="mt-6 border-8 border-brandDark/90 p-8 text-center bg-offWhite1 relative rounded-xl shadow-inner max-w-md mx-auto">
              <div className="border border-amber-600/40 p-4">
                <h4 className="font-poppins font-bold text-lg text-brandDark tracking-wider">CHỨNG CHỈ HOÀN THÀNH</h4>
                <p className="text-xs text-secondaryText italic mt-2">Chứng nhận học viên</p>
                <p className="font-bold text-lg text-brandDark mt-1">{user?.fullName}</p>
                <p className="text-xs text-secondaryText mt-2">Đã hoàn thành xuất sắc khóa học</p>
                <p className="font-bold text-sm text-actionBlue mt-1 uppercase">{viewingCertificate.courseTitle}</p>
                
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 border border-amber-600 mx-auto mt-6 font-bold text-[9px] shadow-sm">
                  SEAL
                </div>

                <div className="text-[10px] text-secondaryText mt-6 space-y-1">
                  <p>Mã số: {viewingCertificate.certCode}</p>
                  <p>Ngày cấp: {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-6 mt-4 border-t border-grayBorder">
              <button
                onClick={() => setViewingCertificate(null)}
                className="px-4 py-2 text-xs font-semibold text-secondaryText hover:text-brandDark"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  if (user) {
                    downloadCertificate(viewingCertificate.courseTitle, user.fullName, viewingCertificate.certCode);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <span>💾</span>
                <span>Tải ảnh (.png)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryBox({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: ElementType
}) {
  return (
    <div className="bg-white border border-grayBorder rounded-[14px] p-5 shadow-l1 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-secondaryText uppercase tracking-wider font-bold">{label}</p>
        <p className="text-2xl font-poppins font-bold mt-1">{value}</p>
      </div>
      <div className="w-11 h-11 rounded-[12px] bg-actionBlue/5 text-actionBlue border border-actionBlue/10 flex items-center justify-center">
        <Icon size={20} />
      </div>
    </div>
  )
}

function CourseProgressRow({
  course,
  index,
  onOpen,
  onViewCertificate,
}: {
  course: MyCourseLearningDTO
  index: number
  onOpen: () => void
  onViewCertificate?: (courseTitle: string, certCode: string) => void
}) {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=500&q=80',
  ]
  const imageSrc = course.thumbnailUrl || fallbackImages[index % fallbackImages.length]

  return (
    <div className="p-5 flex flex-col md:flex-row gap-5 md:items-center">
      <div className="w-full md:w-40 h-24 rounded-[10px] overflow-hidden bg-offWhite2 border border-grayBorder shrink-0">
        <img src={imageSrc} alt={course.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded border border-actionBlue/10 bg-actionBlue/5 text-actionBlue text-[10px] font-bold uppercase">
            {getLevelLabel(course.level)}
          </span>
          <span className="text-[11px] text-secondaryText">
            Cap nhat: {course.lastUpdatedAt ? formatDate(course.lastUpdatedAt) : 'Chua co tien do'}
          </span>
        </div>
        <h3 className="font-poppins font-bold mt-2 truncate">{course.title}</h3>
        <p className="text-sm text-secondaryText mt-1 line-clamp-2">{course.description || 'Khoa hoc tieng Anh truc tuyen.'}</p>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-secondaryText font-semibold mb-1.5">
            <span>Tien do</span>
            <span>{course.completedLessons}/{course.totalLessons} bai ({course.progressPercent}%)</span>
          </div>
          <div className="w-full h-2 bg-offWhite2 rounded-full overflow-hidden border border-grayBorder">
            <div className="h-full bg-actionBlue rounded-full" style={{ width: `${course.progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 shrink-0 self-end md:self-auto">
        {course.certificateCode && onViewCertificate && (
          <button
            onClick={() => onViewCertificate(course.title, course.certificateCode!)}
            className="h-11 px-4 rounded-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>🎓</span>
            <span>Chứng Chỉ</span>
          </button>
        )}
        <button
          onClick={onOpen}
          className="h-11 px-4 rounded-[10px] bg-actionBlue hover:bg-actionBlueHover text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          Vao hoc
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  )
}

function getLevelLabel(level: number) {
  if (level === 0) return 'Beginner'
  if (level === 1) return 'Intermediate'
  return 'Advanced'
}

function formatDuration(seconds: number) {
  if (!seconds) return '0 phut'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} phut`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest > 0 ? `${hours}h ${rest}m` : `${hours}h`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
