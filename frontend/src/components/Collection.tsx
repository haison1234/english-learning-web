import { useState, useEffect } from 'react'
import { getCourses, CourseDTO } from '../services/courseService'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'

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

  const getLevelBadgeStyles = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-blue-50 text-blue-600 border-blue-100'
      case 1:
        return 'bg-amber-50 text-amber-600 border-amber-100'
      case 2:
        return 'bg-purple-50 text-purple-600 border-purple-100'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return 'Beginner'
      case 1: return 'Intermediate'
      case 2: return 'Advanced'
      default: return 'All Levels'
    }
  }

  return (
    <section id="courses" className="w-full bg-offWhite1 py-20 border-b border-grayBorder">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12">

        {/* ── HEADER ROW ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-actionBlue font-poppins text-xs font-semibold tracking-widest uppercase bg-actionBlue/5 px-4 py-1.5 rounded-[999px]">
              Lộ trình học tập
            </span>
            <h2 className="font-poppins text-brandDark text-3xl font-bold tracking-tight mt-4">
              Hệ Thống Khóa Học IELTS & Giao Tiếp Chuẩn
            </h2>
            <p className="text-secondaryText text-sm mt-2">
              Các khóa học thiết kế chuyên sâu từ cơ bản đến nâng cao, đi kèm tài liệu và bài tập chấm tự động.
            </p>
          </div>

          <button className="group text-actionBlue hover:text-actionBlueHover font-bold text-sm flex items-center gap-1.5 shrink-0 self-start md:self-auto transition-colors">
            Xem tất cả khóa học
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* ── CARD GRID ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-actionBlue"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-secondaryText text-sm font-medium">
            Không tìm thấy khóa học nào. Vui lòng quay lại sau!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, i) => {
              const isFree = course.courseType === 0;
              const priceText = isFree ? 'Miễn phí' : `${course.basePrice.toLocaleString('vi-VN')}đ`;
              
              // Mảng ảnh minh họa chất lượng cao
              const backupImages = [
                'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
              ];
              const imageSrc = course.thumbnailUrl && !course.thumbnailUrl.includes('cdn.elearning.vn') 
                ? course.thumbnailUrl 
                : backupImages[i % backupImages.length];

              return (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className="bg-white border border-grayBorder rounded-[16px] overflow-hidden shadow-l1 hover:shadow-l2 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
                >
                  {/* Image banner */}
                  <div className="relative w-full aspect-video overflow-hidden bg-offWhite2 border-b border-grayBorder">
                    <img
                      src={imageSrc}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    
                    {/* Course Type Badge */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-[6px] font-poppins text-[10px] font-bold tracking-wider uppercase border"
                      style={{
                        backgroundColor: isFree ? '#E8F5E9' : '#FAFCFE',
                        color: isFree ? '#2E7D32' : '#0060FD',
                        borderColor: isFree ? '#C8E6C9' : '#D1D5DB'
                      }}
                    >
                      {isFree ? 'FREE' : 'PREMIUM'}
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-[4px] border text-[10px] font-bold uppercase tracking-wider ${getLevelBadgeStyles(course.level)}`}>
                          {getLevelLabel(course.level)}
                        </span>
                      </div>
                      <h3 className="font-poppins text-brandDark text-lg font-bold leading-snug group-hover:text-actionBlue transition-colors duration-200 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-secondaryText text-xs leading-relaxed mt-2 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Meta information row */}
                    <div className="mt-6 pt-4 border-t border-grayBorder flex items-center justify-between text-xs text-secondaryText">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-secondaryText/80" />
                        <span>Chương trình học</span>
                      </div>
                      
                      <div className="font-poppins text-brandDark font-bold text-sm">
                        {priceText}
                      </div>
                    </div>
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
