import { useState, useEffect } from 'react'
import { getCourses, CourseDTO } from '../services/courseService'

const BACKUP_VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4'
]

export default function Collection({ onSelectCourse }: { onSelectCourse: (id: string) => void }) {
  const [courses, setCourses] = useState<CourseDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses()
        // Chỉ hiển thị các khóa học có status là PUBLISHED (status === 1)
        const publishedCourses = data.filter(c => c.status === 1)
        setCourses(publishedCourses)
      } catch (err) {
        console.error('Lỗi tải khóa học:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [])

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return 'Beginner'
      case 1: return 'Intermediate'
      case 2: return 'Advanced'
      default: return 'All Levels'
    }
  }

  const getScoreLabel = (level: number) => {
    switch (level) {
      case 0: return '8.7/10'
      case 1: return '9.0/10'
      case 2: return '9.5/10'
      default: return '9.0/10'
    }
  }

  return (
    <section id="courses" className="w-full bg-[#010828] py-16 sm:py-20 md:py-24">
      <div className="max-w-[1831px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">

        {/* ── HEADER ROW ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 sm:mb-12 md:mb-14">

          {/* Left: Heading */}
          <h2
            className="font-grotesk text-[#EFF4FF] uppercase"
            style={{ fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: 1.05 }}
          >
            Hệ thống
            <br />
            <span className="ml-12 sm:ml-24 lg:ml-32">
              <span className="font-condiment text-[#6FFF00]" style={{ fontSize: '1.2em' }}>
                Khóa học{' '}
              </span>
              Nổi bật
            </span>
          </h2>

          {/* Right: SEE ALL button with neon underbar */}
          <button className="group flex flex-col items-start shrink-0">
            <div className="flex items-baseline gap-3">
              <span
                className="font-grotesk text-[#EFF4FF] uppercase group-hover:text-[#6FFF00] transition-colors duration-200"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
              >
                XEM
              </span>
              <div className="flex flex-col leading-tight">
                <span
                  className="font-grotesk text-[#EFF4FF] uppercase group-hover:text-[#6FFF00] transition-colors duration-200"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}
                >
                  TẤT CẢ
                </span>
                <span
                  className="font-grotesk text-[#EFF4FF] uppercase group-hover:text-[#6FFF00] transition-colors duration-200"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}
                >
                  KHÓA HỌC
                </span>
              </div>
            </div>
            {/* Neon underbar */}
            <div
              className="bg-[#6FFF00] w-full mt-2 rounded-full"
              style={{ height: 'clamp(6px, 0.6vw, 10px)' }}
            />
          </button>
        </div>

        {/* ── CARD GRID ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6FFF00]"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-[#EFF4FF]/40 font-mono">
            Không tìm thấy khóa học nào. Vui lòng quay lại sau!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => {
              const isFree = course.courseType === 0;
              const priceText = isFree ? 'Miễn phí' : `${course.basePrice.toLocaleString('vi-VN')}đ`;
              // Nếu link video của DB là link ảo cdn.elearning.vn, ta dùng video phi hành gia động của anh
              const videoSrc = course.trailerUrl && !course.trailerUrl.includes('cdn.elearning.vn') 
                ? course.trailerUrl 
                : BACKUP_VIDEOS[i % BACKUP_VIDEOS.length];

              return (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors duration-200 flex flex-col cursor-pointer group"
                >
                  {/* Square video with aspect-ratio trick */}
                  <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden">
                    <video
                      src={videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Course Type Badge */}
                    <div
                      className="absolute top-4 left-4 px-3.5 py-1.5 rounded-[12px] font-grotesk text-xs uppercase tracking-wider backdrop-blur-md"
                      style={{
                        backgroundColor: isFree ? 'rgba(111, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        color: isFree ? '#6FFF00' : '#EFF4FF',
                        border: `1px solid ${isFree ? '#6FFF00' : 'rgba(255, 255, 255, 0.2)'}`
                      }}
                    >
                      {isFree ? 'FREE' : 'PREMIUM'}
                    </div>
                  </div>

                  {/* Title & Level */}
                  <div className="mt-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#EFF4FF]/40 uppercase tracking-widest">
                        {getLevelLabel(course.level)}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6FFF00]/40" />
                      <span className="font-mono text-xs text-[#EFF4FF]/40 uppercase tracking-widest">
                        {getScoreLabel(course.level)}
                      </span>
                    </div>
                    <h3 className="font-grotesk text-[#EFF4FF] text-xl uppercase mt-2 leading-snug min-h-[3.6rem] flex items-center group-hover:text-[#6FFF00] transition-colors duration-200">
                      {course.title}
                    </h3>
                  </div>

                  {/* Price / Buy bar */}
                  <div className="liquid-glass rounded-[20px] px-5 py-4 mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-grotesk text-[#EFF4FF]/50 text-[11px] uppercase">
                        HỌC PHÍ
                      </p>
                      <p className="font-grotesk text-[#EFF4FF] text-[18px] uppercase tracking-wide">
                        {priceText}
                      </p>
                    </div>

                    {/* Buy button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Ngừng lan truyền sự kiện click card
                        onSelectCourse(course.id);
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 active:scale-95 transition-all duration-200"
                      style={{
                        background: 'linear-gradient(135deg, #b724ff, #7c3aed)',
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
