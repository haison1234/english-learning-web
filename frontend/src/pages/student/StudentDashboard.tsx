import { useState, useEffect } from 'react'
import { 
  LogOut, Clock, CheckCircle, Play, ChevronRight, Sparkles, BookMarked, ChevronDown, Bell
} from 'lucide-react'
import { UserProfile } from '../../services/authService'
import { getCourses, CourseDTO } from '../../services/courseService'
import { getMyPayments } from '../../services/paymentService'
import { useNavigate } from 'react-router-dom'

interface StudentDashboardProps {
  user: UserProfile | null
  onLogout: () => void
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const navigate = useNavigate()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [myCourses, setMyCourses] = useState<(CourseDTO & { completed: number; total: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesData, paymentsData] = await Promise.all([
          getCourses(),
          getMyPayments()
        ])
        
        const publishedCourses = coursesData.filter(c => c.status === 1)
        
        // Find courses that have a SUCCESS payment
        const purchasedCourseIds = new Set(
          paymentsData.filter(p => p.status === 1 || (p.status as unknown as string) === 'SUCCESS').map(p => p.courseId)
        )
        
        const enrolled = publishedCourses
          .filter(c => purchasedCourseIds.has(c.id))
          .map(c => ({
            ...c,
            completed: 0, // Mock progress since no progress API yet
            total: 5      // Mock total lessons
          }))
          
        setMyCourses(enrolled)
      } catch (err) {
        console.error('Lỗi tải dữ liệu dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (!user) return null;

  // Mock stats
  const stats = [
    { label: 'Study Time', value: '120 mins', icon: Clock, color: '#0060FD' },
    { label: 'Completed', value: '5 lessons', icon: CheckCircle, color: '#2E7D32' }
  ]





  const notifications = [
    { id: 1, text: 'Có bài tập mới trong khóa học IELTS Giao tiếp!', time: '1 giờ trước', read: false },
    { id: 2, text: 'Nhắc nhở: Bạn chưa học bài ngày hôm nay.', time: '3 giờ trước', read: false },
    { id: 3, text: 'Chúc mừng bạn đã hoàn thành bài thi trắc nghiệm.', time: '1 ngày trước', read: true }
  ]

  const getLevelLabel = (lvl: number) => {
    if (lvl === 0) return 'Beginner'
    if (lvl === 1) return 'Intermediate'
    return 'Advanced'
  }

  const handleStartStudy = (courseId: string) => {
    navigate(`/student/study/${courseId}`)
  }

  return (
    <div className="min-h-screen bg-offWhite1 text-brandDark pb-20">
      
      {/* ── HEADER ── */}
      <nav className="w-full border-b border-grayBorder/50 bg-white/85 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">
          
          <button 
            onClick={() => navigate('/')}
            className="font-poppins text-brandDark text-xl font-bold tracking-tight hover:opacity-80 transition-all flex items-center gap-1.5"
          >
            <span className="text-actionBlue">English.</span>
            <span className="text-brandDark">Learn</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button className="text-actionBlue font-semibold text-[15px] relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-actionBlue">Dashboard</button>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  setProfileDropdownOpen(false)
                }}
                className="w-10 h-10 rounded-full bg-offWhite1 hover:bg-offWhite3 border border-grayBorder flex items-center justify-center relative transition-all"
              >
                <Bell size={18} className="text-secondaryText" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 rounded-[16px] bg-white border border-grayBorder p-4 shadow-l3 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <h4 className="font-poppins text-brandDark text-sm font-bold mb-3">Thông báo</h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="flex flex-col gap-1">
                          <p className={`text-xs ${n.read ? 'text-secondaryText' : 'text-brandDark font-semibold'}`}>{n.text}</p>
                          <span className="text-[10px] text-secondaryText">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen)
                  setNotificationsOpen(false)
                }}
                className="flex items-center gap-2.5 px-4 py-2 rounded-[999px] bg-white border border-grayBorder hover:bg-offWhite1 transition-all active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-actionBlue/10 flex items-center justify-center text-actionBlue font-semibold text-xs border border-actionBlue/10">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold text-sm text-brandDark pr-1">
                  {user.fullName}
                </span>
                <ChevronDown size={14} className="text-secondaryText" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-[16px] bg-white border border-grayBorder p-2 shadow-l3 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-grayBorder">
                      <p className="text-[10px] text-secondaryText uppercase tracking-widest font-bold">Learner</p>
                      <p className="text-sm font-semibold text-brandDark truncate mt-0.5">{user.fullName}</p>
                      <p className="text-xs text-secondaryText truncate">{user.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); alert('Chứng chỉ của bạn!') }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-1 text-sm text-brandDark hover:text-actionBlue hover:bg-offWhite1 rounded-lg transition-colors text-left font-medium"
                    >
                      Chứng chỉ của tôi
                    </button>

                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-0.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-[1440px] mx-auto px-6 mt-10">

        {/* ── WELCOME BANNER ── */}
        <div className="w-full rounded-[24px] bg-white border border-grayBorder p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-l1 relative overflow-hidden mb-8">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-actionBlue/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-1.5 text-actionBlue text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} className="animate-pulse" />
              Welcome back, excellent learner
            </div>
            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-brandDark tracking-tight">
              {user.fullName}
            </h1>
            <p className="text-sm text-secondaryText mt-3 max-w-xl leading-relaxed">
              Today is a great day to break language barriers. Keep up your daily streak to achieve outstanding results!
            </p>
          </div>

          <button 
            onClick={() => {
              if (myCourses.length > 0) {
                handleStartStudy(myCourses[0].id)
              }
            }}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white rounded-[999px] font-bold text-[15px] tracking-wide shadow-sm hover:shadow hover:-translate-y-[1px] active:translate-y-0 transition-all self-stretch md:self-auto justify-center z-10 relative"
          >
            <Play size={14} fill="currentColor" />
            Continue Learning
          </button>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div 
                key={i} 
                className="p-6 rounded-[16px] bg-white border border-grayBorder shadow-l1 hover:shadow-l2 transition-all flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] text-secondaryText uppercase tracking-wider font-bold">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-poppins font-bold text-brandDark mt-1">{stat.value}</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center border"
                  style={{ borderColor: `${stat.color}15`, color: stat.color, backgroundColor: `${stat.color}08` }}
                >
                  <Icon size={20} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between border-b border-grayBorder pb-4 mb-6">
              <div className="flex gap-6 font-semibold text-sm">
                <button 
                  className="pb-4 -mb-[18px] transition-all relative text-actionBlue"
                >
                  Khóa học của tôi ({myCourses.length})
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-actionBlue" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-actionBlue"></div>
                </div>
              ) : myCourses.length === 0 ? (
                <div className="text-center py-10 text-secondaryText text-sm font-medium">
                  Bạn chưa đăng ký khóa học nào. Hãy quay lại trang chủ để tham khảo lộ trình!
                </div>
              ) : (
                myCourses.map((course, idx) => {
                  const percent = Math.round((course.completed / course.total) * 100)
                  const backupImages = [
                    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80'
                  ];
                  const imageSrc = course.thumbnailUrl && !course.thumbnailUrl.includes('cdn.elearning.vn')
                    ? course.thumbnailUrl
                    : backupImages[idx % backupImages.length];

                  return (
                    <div 
                      key={course.id}
                      className="bg-white border border-grayBorder hover:border-actionBlue/20 rounded-[16px] p-5 flex flex-col sm:flex-row gap-5 items-stretch transition-all shadow-l1 hover:shadow-l2 duration-200"
                    >
                      <div className="w-full sm:w-36 h-24 rounded-[12px] overflow-hidden border border-grayBorder flex-shrink-0 relative bg-offWhite2">
                        <img 
                          src={imageSrc} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-actionBlue/5 text-[9px] text-actionBlue font-bold uppercase rounded border border-actionBlue/10 tracking-wider">
                              {getLevelLabel(course.level)}
                            </span>
                          </div>
                          <h3 className="font-poppins text-base font-bold text-brandDark hover:text-actionBlue transition-colors leading-snug mt-1.5">
                            {course.title}
                          </h3>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] text-secondaryText mb-1.5 font-semibold">
                            <span>Tiến trình</span>
                            <span>{course.completed}/{course.total} bài học ({percent}%)</span>
                          </div>
                          <div className="w-full h-2 bg-offWhite2 rounded-full overflow-hidden border border-grayBorder">
                            <div 
                              className="h-full rounded-full bg-actionBlue transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end sm:pl-3">
                        <button 
                          onClick={() => handleStartStudy(course.id)}
                          className="p-3 bg-actionBlue text-white hover:bg-actionBlueHover rounded-[12px] transition-all shadow-l1 hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>

                    </div>
                  )
                })
              )}
            </div>

          </div>

          <div className="flex flex-col gap-8">
            <div className="rounded-[24px] bg-white border border-grayBorder p-6 shadow-l1 relative overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-28 h-28 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase tracking-wider mb-4">
                <BookMarked size={14} />
                Chứng chỉ của tôi
              </div>

              <div className="flex flex-col gap-4">
                {/* Mock Certificate */}
                <div className="p-4 border border-grayBorder rounded-[12px] bg-offWhite1 hover:bg-green-50/50 hover:border-green-200 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="font-poppins text-sm font-bold text-brandDark group-hover:text-green-700 transition-colors">
                        English for Absolute Beginners
                      </h4>
                      <p className="text-[10px] text-secondaryText uppercase tracking-wider mt-1">
                        Cấp ngày: 15/05/2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-grayBorder rounded-[12px] bg-offWhite1 flex items-center justify-center">
                  <span className="text-xs text-secondaryText font-medium text-center leading-relaxed">
                    Hoàn thành 100% tiến độ khóa học để nhận thêm chứng chỉ mới nhé!
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  )
}
