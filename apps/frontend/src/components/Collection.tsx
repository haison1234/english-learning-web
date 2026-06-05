import { useState, useEffect } from 'react'
import { getCourses, CourseDTO } from '../services/courseService'
import { ArrowRight, BookOpen, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { useCart } from '../stores/cartStore'

import { useNavigate } from 'react-router-dom';

export default function Collection({
  isLoggedIn,
  onLogin,
  onCartOpen,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  onCartOpen?: () => void
}) {
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart()
  const [courses, setCourses] = useState<CourseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all')

  const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<string>>(new Set())

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

  useEffect(() => {
    async function loadUserPayments() {
      if (isLoggedIn) {
        try {
          // Dynamic import to avoid circular dependencies if any, or just import it at top
          const { getMyPayments } = await import('../services/paymentService')
          const payments = await getMyPayments()
          // Support both number and string representations of SUCCESS
          const pIds = new Set(payments.filter(p => p.status === 1 || (p.status as unknown as string) === 'SUCCESS').map(p => p.courseId))
          setPurchasedCourseIds(pIds)
        } catch (err) {
          console.error('Lỗi tải lịch sử thanh toán:', err)
        }
      } else {
        setPurchasedCourseIds(new Set())
      }
    }
    loadUserPayments()
  }, [isLoggedIn])

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

  const displayedCourses = filterLevel === 'all' 
    ? courses 
    : courses.filter(c => c.level === filterLevel)

  return (
    <section id="courses" className="w-full bg-offWhite1 py-20 border-b border-grayBorder">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12">

        {/* ── HEADER ROW ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
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

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button 
            onClick={() => setFilterLevel('all')}
            className={`px-5 py-2.5 rounded-[999px] text-sm font-semibold transition-all ${filterLevel === 'all' ? 'bg-actionBlue text-white shadow-sm' : 'bg-white border border-grayBorder text-secondaryText hover:bg-offWhite1'}`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setFilterLevel(0)}
            className={`px-5 py-2.5 rounded-[999px] text-sm font-semibold transition-all ${filterLevel === 0 ? 'bg-actionBlue text-white shadow-sm' : 'bg-white border border-grayBorder text-secondaryText hover:bg-offWhite1'}`}
          >
            Beginner (Cơ bản)
          </button>
          <button 
            onClick={() => setFilterLevel(1)}
            className={`px-5 py-2.5 rounded-[999px] text-sm font-semibold transition-all ${filterLevel === 1 ? 'bg-actionBlue text-white shadow-sm' : 'bg-white border border-grayBorder text-secondaryText hover:bg-offWhite1'}`}
          >
            Intermediate (Trung cấp)
          </button>
          <button 
            onClick={() => setFilterLevel(2)}
            className={`px-5 py-2.5 rounded-[999px] text-sm font-semibold transition-all ${filterLevel === 2 ? 'bg-actionBlue text-white shadow-sm' : 'bg-white border border-grayBorder text-secondaryText hover:bg-offWhite1'}`}
          >
            Advanced (Nâng cao)
          </button>
        </div>

        {/* ── CARD GRID ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-actionBlue"></div>
          </div>
        ) : displayedCourses.length === 0 ? (
          <div className="text-center py-20 text-secondaryText text-sm font-medium">
            Không tìm thấy khóa học nào phù hợp. Vui lòng chọn cấp độ khác!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCourses.map((course, i) => {
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
                  onClick={() => navigate(`/course/${course.id}`)}
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

                    {/* CTA Buttons */}
                    <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {purchasedCourseIds.has(course.id) ? (
                        <button
                          onClick={() => navigate(`/student`)}
                          className="flex-1 py-2 rounded-[999px] bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 size={13} />
                          Đã thanh toán (Vào học)
                        </button>
                      ) : isFree ? (
                        <button
                          onClick={() => navigate(`/course/${course.id}`)}
                          className="flex-1 py-2 rounded-[999px] bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Đăng ký miễn phí
                        </button>
                      ) : isInCart(course.id) ? (
                        <button
                          onClick={() => onCartOpen?.()}
                          className="flex-1 py-2 rounded-[999px] bg-actionBlue/10 text-actionBlue font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-actionBlue/30"
                        >
                          <CheckCircle2 size={13} />
                          Đã thêm vào giỏ
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (!isLoggedIn) {
                              onLogin();
                              return;
                            }
                            addItem({
                              courseId: course.id,
                              title: course.title,
                              basePrice: course.basePrice,
                              thumbnailUrl: course.thumbnailUrl,
                              courseType: course.courseType,
                            })
                            onCartOpen?.()
                          }}
                          className="flex-1 py-2 rounded-[999px] bg-actionBlue hover:bg-actionBlueHover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ShoppingCart size={13} />
                          Thêm vào giỏ
                        </button>
                      )}
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
