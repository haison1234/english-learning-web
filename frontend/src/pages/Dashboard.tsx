import { useState, useEffect } from 'react'
import { 
  LogOut, BookOpen, Award, Flame, Clock, 
  CheckCircle, Play, ChevronRight, User, Sparkles, BookMarked
} from 'lucide-react'
import { UserProfile } from '../services/authService'
import { getCourses, CourseDTO } from '../services/courseService'

interface DashboardProps {
  user: UserProfile
  onLogout: () => void
  onNavigateLanding: () => void
}

export default function Dashboard({ user, onLogout, onNavigateLanding }: DashboardProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'my-courses' | 'all-courses'>('my-courses')
  const [allCourses, setAllCourses] = useState<CourseDTO[]>([])
  const [loadingAll, setLoadingAll] = useState(true)

  useEffect(() => {
    async function loadAllCourses() {
      try {
        const data = await getCourses()
        setAllCourses(data.filter(c => c.status === 1))
      } catch (err) {
        console.error('Lỗi tải danh sách khám phá khóa học:', err)
      } finally {
        setLoadingAll(false)
      }
    }
    loadAllCourses()
  }, [])

  // Dữ liệu mẫu (Mock data) được đồng bộ màu xanh lá Neon sáng (#6FFF00) cực đẹp
  const stats = [
    { label: 'Chuỗi Streak', value: '5 ngày', icon: Flame, color: '#6FFF00' },
    { label: 'Thời gian học', value: '120 phút', icon: Clock, color: '#6FFF00' },
    { label: 'Đã hoàn thành', value: '18 bài học', icon: CheckCircle, color: '#6FFF00' }
  ]

  const myCourses = [
    {
      id: 1,
      title: 'Lộ trình Phát âm tiếng Anh chuẩn Mỹ',
      level: 'Beginner',
      completed: 12,
      total: 20,
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
      color: '#6FFF00'
    },
    {
      id: 2,
      title: 'Học nhanh 3000 Từ vựng tiếng Anh thông dụng',
      level: 'Intermediate',
      completed: 14,
      total: 50,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
      color: '#6FFF00'
    },
    {
      id: 3,
      title: 'Ngữ pháp tiếng Anh toàn diện từ A-Z',
      level: 'All Levels',
      completed: 34,
      total: 40,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
      color: '#6FFF00'
    }
  ]

  const dailyWord = {
    word: 'Breakthrough',
    phonetic: '/ˈbreɪkθruː/',
    type: 'noun',
    definition: 'A sudden, dramatic, and important discovery or development.',
    translation: 'Một bước đột phá, phát kiến quan trọng làm thay đổi cục diện.'
  }

  return (
    <div className="min-h-screen bg-[#010828] text-[#EFF4FF] font-mono pb-20 relative overflow-hidden">
      
      {/* BACKGROUND GLOWS - Tạo các quầng sáng mờ ảo màu xanh sáng Neon cực chất của Landing Page */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6FFF00]/4 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#6FFF00]/3 blur-[180px] pointer-events-none" />

      {/* ── HEADER ── */}
      <nav className="w-full border-b border-white/5 bg-[#010828]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={onNavigateLanding}
            className="font-grotesk text-lg sm:text-xl uppercase tracking-wider hover:opacity-80 transition-all duration-200 active:scale-95 text-left flex items-center gap-1 group"
            title="Quay lại trang chủ"
          >
            <span>English</span><span className="text-[#6FFF00] group-hover:animate-pulse">.Learn</span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <button className="text-[#6FFF00] font-grotesk text-sm uppercase tracking-wide">Bảng điều khiển</button>
            <button className="text-[#EFF4FF]/60 hover:text-[#6FFF00] transition-colors font-grotesk text-sm uppercase tracking-wide">Khóa học</button>
            <button className="text-[#EFF4FF]/60 hover:text-[#6FFF00] transition-colors font-grotesk text-sm uppercase tracking-wide">Luyện từ vựng</button>
            <button className="text-[#EFF4FF]/60 hover:text-[#6FFF00] transition-colors font-grotesk text-sm uppercase tracking-wide">Kho đề thi</button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
            >
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.fullName} 
                  className="w-9 h-9 rounded-full object-cover border border-[#6FFF00]/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#6FFF00]/10 border border-[#6FFF00]/30 flex items-center justify-center text-[#6FFF00]">
                  <User size={18} />
                </div>
              )}
              <span className="hidden sm:inline font-grotesk text-sm pr-3 text-[#EFF4FF]">
                {user.fullName}
              </span>
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                <div className="absolute right-0 mt-3 w-56 rounded-[18px] bg-[#020b35]/95 border border-white/10 p-2 shadow-2xl backdrop-blur-xl z-20 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs text-[#EFF4FF]/40 uppercase tracking-widest">Tài khoản</p>
                    <p className="text-sm font-grotesk text-[#EFF4FF] truncate mt-0.5">{user.fullName}</p>
                    <p className="text-[11px] text-[#EFF4FF]/50 truncate">{user.email}</p>
                  </div>
                  
                  <button 
                    onClick={() => { setProfileDropdownOpen(false); alert('Chức năng cài đặt tài khoản đang được phát triển!') }}
                    className="w-full flex items-center gap-3 px-4 py-3 mt-1.5 text-sm text-[#EFF4FF]/75 hover:text-[#6FFF00] hover:bg-white/5 rounded-[12px] transition-colors text-left"
                  >
                    <User size={16} />
                    Hồ sơ của tôi
                  </button>

                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 mt-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-[12px] transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

        {/* ── WELCOME BANNER ── */}
        <div className="w-full rounded-[28px] liquid-glass border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden mb-8">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#6FFF00]/10 blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 text-[#6FFF00] text-xs sm:text-sm uppercase tracking-widest font-grotesk mb-2">
              <Sparkles size={16} className="animate-pulse" />
              Chào mừng trở lại học viên xuất sắc
            </div>
            <h1 className="font-grotesk text-2xl sm:text-4xl text-[#EFF4FF] uppercase tracking-wider leading-tight">
              {user.fullName}
            </h1>
            <p className="text-sm text-[#EFF4FF]/60 mt-3 font-mono leading-relaxed" style={{ maxWidth: '600px' }}>
              Hôm nay là một ngày tuyệt vời để bứt phá giới hạn ngôn ngữ. Bạn có mục tiêu duy trì chuỗi học tập liên tục để nhận huy hiệu chiến binh tiếng Anh đấy!
            </p>
          </div>

          <button className="flex items-center gap-3 px-6 py-4 rounded-[16px] font-grotesk text-[#010828] text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all self-stretch md:self-auto justify-center" style={{ background: '#6FFF00' }}>
            <Play size={16} fill="#010828" />
            Học tiếp bài học dang dở
          </button>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div 
                key={i} 
                className="p-6 rounded-[24px] liquid-glass border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-[#EFF4FF]/40 uppercase tracking-widest font-mono">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-grotesk text-[#EFF4FF] mt-1.5 uppercase">{stat.value}</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-[16px] flex items-center justify-center bg-white/5 border"
                  style={{ borderColor: `${stat.color}15`, color: stat.color }}
                >
                  <Icon size={22} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 📚 LEFT/CENTER: LIST OF MY COURSES (2/3 width) */}
          <div className="lg:col-span-2">
            
            {/* Tab Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex gap-6">
                <button 
                  onClick={() => setActiveTab('my-courses')}
                  className={`font-grotesk text-sm uppercase pb-4 -mb-[18px] transition-all relative ${activeTab === 'my-courses' ? 'text-[#6FFF00]' : 'text-[#EFF4FF]/40'}`}
                >
                  Khóa học của tôi ({myCourses.length})
                  {activeTab === 'my-courses' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6FFF00]" />}
                </button>
                <button 
                  onClick={() => setActiveTab('all-courses')}
                  className={`font-grotesk text-sm uppercase pb-4 -mb-[18px] transition-all relative ${activeTab === 'all-courses' ? 'text-[#6FFF00]' : 'text-[#EFF4FF]/40'}`}
                >
                  Khám phá lộ trình mới ({allCourses.length})
                  {activeTab === 'all-courses' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6FFF00]" />}
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="flex flex-col gap-6">
              {activeTab === 'my-courses' ? (
                myCourses.map((course) => {
                  const percent = Math.round((course.completed / course.total) * 100)
                  return (
                    <div 
                      key={course.id}
                      className="liquid-glass border border-white/5 hover:border-[#6FFF00]/20 rounded-[24px] p-5 flex flex-col sm:flex-row gap-5 items-stretch transition-all hover:translate-y-[-2px] duration-300"
                    >
                      {/* Course Thumbnail */}
                      <div className="w-full sm:w-36 h-28 rounded-[16px] overflow-hidden border border-white/10 flex-shrink-0 relative">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover filter brightness-90"
                        />
                        <span className="absolute top-2 left-2 bg-[#010828]/80 text-[10px] text-[#EFF4FF] font-mono px-2 py-0.5 rounded border border-white/10 uppercase">
                          {course.level}
                        </span>
                      </div>

                      {/* Course Content */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-grotesk text-base uppercase text-[#EFF4FF] hover:text-[#6FFF00] transition-colors leading-snug">
                            {course.title}
                          </h3>
                          <p className="text-xs text-[#EFF4FF]/40 mt-1">
                            Tiến trình: {course.completed}/{course.total} bài học ({percent}%)
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 sm:mt-0">
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 mb-1">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%`, backgroundColor: course.color }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions button */}
                      <div className="flex items-center justify-end sm:pl-3">
                        <button 
                          onClick={() => alert(`Đang vào khóa học: ${course.title}`)}
                          className="p-3.5 rounded-[16px] bg-white/5 border border-white/10 hover:border-[#6FFF00] hover:text-[#010828] hover:bg-[#6FFF00] transition-all text-[#EFF4FF] group active:scale-95 flex items-center justify-center"
                        >
                          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                    </div>
                  )
                })
              ) : loadingAll ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6FFF00]"></div>
                </div>
              ) : allCourses.length === 0 ? (
                <div className="text-center py-10 text-[#EFF4FF]/40 font-mono">
                  Chưa có khóa học mới nào được ra mắt.
                </div>
              ) : (
                allCourses.map((course, i) => {
                  const isFree = course.courseType === 0;
                  const priceText = isFree ? 'Miễn phí' : `${course.basePrice.toLocaleString('vi-VN')}đ`;
                  const backupImages = [
                    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'
                  ];
                  const imageSrc = course.thumbnailUrl && !course.thumbnailUrl.includes('cdn.elearning.vn')
                    ? course.thumbnailUrl
                    : backupImages[i % backupImages.length];

                  const getLevelText = (lvl: number) => {
                    if (lvl === 0) return 'Beginner';
                    if (lvl === 1) return 'Intermediate';
                    return 'Advanced';
                  };

                  return (
                    <div 
                      key={course.id}
                      className="liquid-glass border border-white/5 hover:border-[#6FFF00]/20 rounded-[24px] p-5 flex flex-col sm:flex-row gap-5 items-stretch transition-all hover:translate-y-[-2px] duration-300"
                    >
                      {/* Course Thumbnail */}
                      <div className="w-full sm:w-36 h-28 rounded-[16px] overflow-hidden border border-white/10 flex-shrink-0 relative">
                        <img 
                          src={imageSrc} 
                          alt={course.title} 
                          className="w-full h-full object-cover filter brightness-90"
                        />
                        <span className="absolute top-2 left-2 bg-[#010828]/80 text-[10px] text-[#EFF4FF] font-mono px-2 py-0.5 rounded border border-white/10 uppercase">
                          {getLevelText(course.level)}
                        </span>
                      </div>

                      {/* Course Content */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-grotesk text-base uppercase text-[#EFF4FF] hover:text-[#6FFF00] transition-colors leading-snug">
                            {course.title}
                          </h3>
                          <p className="text-xs text-[#EFF4FF]/50 mt-2 line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#EFF4FF]/60 font-mono">
                            {isFree ? 'FREE' : 'PREMIUM'}
                          </span>
                          <span className="text-xs text-[#6FFF00] font-grotesk uppercase tracking-wide">
                            Học phí: {priceText}
                          </span>
                        </div>
                      </div>

                      {/* Actions button */}
                      <div className="flex items-center justify-end sm:pl-3">
                        <button 
                          onClick={() => alert(`Đăng ký khóa học: ${course.title}`)}
                          className="px-5 py-3 rounded-[16px] bg-white/5 border border-white/10 hover:border-[#6FFF00] hover:text-[#010828] hover:bg-[#6FFF00] transition-all text-xs font-grotesk uppercase tracking-wider group active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span>Đăng ký</span>
                          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>

                    </div>
                  )
                })
              )}
            </div>

          </div>

          {/* ⚡ RIGHT SIDEBAR: DAILY PRACTICE & WORDS (1/3 width) */}
          <div className="flex flex-col gap-8">
            
            {/* Daily Flashcard Component */}
            <div className="rounded-[28px] liquid-glass border border-[#6FFF00]/10 p-6 relative overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-28 h-28 rounded-full bg-[#6FFF00]/5 blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-[#6FFF00] text-xs uppercase tracking-widest font-grotesk mb-4">
                <BookMarked size={14} />
                Từ vựng vàng hôm nay
              </div>

              <div className="border-b border-white/5 pb-4 mb-4">
                <div className="flex items-baseline gap-2.5">
                  <h4 className="font-grotesk text-2xl uppercase tracking-wider text-[#EFF4FF]">
                    {dailyWord.word}
                  </h4>
                  <span className="text-xs text-[#6FFF00] italic font-serif">
                    {dailyWord.type}
                  </span>
                </div>
                <p className="text-xs text-[#EFF4FF]/40 font-mono mt-1">
                  {dailyWord.phonetic}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[11px] text-[#EFF4FF]/30 uppercase tracking-widest font-mono">Định nghĩa Anh-Anh</p>
                  <p className="text-xs text-[#EFF4FF]/80 font-mono leading-relaxed mt-1">
                    {dailyWord.definition}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#EFF4FF]/30 uppercase tracking-widest font-mono">Nghĩa tiếng Việt</p>
                  <p className="text-xs text-[#6FFF00]/95 font-mono leading-relaxed mt-1">
                    {dailyWord.translation}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => alert('Đã đánh dấu thuộc từ này!')}
                className="w-full py-3.5 mt-6 border border-[#6FFF00]/20 hover:bg-[#6FFF00]/10 hover:border-[#6FFF00]/40 rounded-[14px] text-xs font-grotesk text-[#6FFF00] uppercase tracking-wider transition-colors"
              >
                Đánh dấu đã thuộc từ
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-[28px] liquid-glass border border-white/5 p-6">
              <h4 className="font-grotesk text-xs uppercase tracking-widest text-[#EFF4FF]/40 mb-4">Luyện tập nhanh</h4>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => alert('Bắt đầu thử thách 10 từ vựng!')}
                  className="w-full flex items-center justify-between p-4 rounded-[16px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left text-xs uppercase font-grotesk tracking-wide group"
                >
                  <span>🚀 Học 10 từ ngẫu nhiên</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => alert('Đang tải kho nghe tiếng Anh!')}
                  className="w-full flex items-center justify-between p-4 rounded-[16px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left text-xs uppercase font-grotesk tracking-wide group"
                >
                  <span>🎧 Luyện nghe thụ động</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => alert('Đang thiết lập phòng Quiz!')}
                  className="w-full flex items-center justify-between p-4 rounded-[16px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left text-xs uppercase font-grotesk tracking-wide group"
                >
                  <span>⚡ Thi thử trắc nghiệm</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  )
}
