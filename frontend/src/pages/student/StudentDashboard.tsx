import { useEffect, useMemo, useState } from 'react'
import type { ElementType } from 'react'
import { BarChart3, BookOpen, CheckCircle, ChevronRight, Clock, LogOut, Play, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserProfile } from '../../services/authService'
import { getMyLearningCourses, MyCourseLearningDTO } from '../../services/learningService'

interface StudentDashboardProps {
  user: UserProfile | null
  onLogout: () => void
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const navigate = useNavigate()
  const [myCourses, setMyCourses] = useState<MyCourseLearningDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const courses = await getMyLearningCourses()
        setMyCourses(courses)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Khong the tai tien do hoc tap.')
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border border-grayBorder bg-offWhite1">
              <div className="w-7 h-7 rounded-full bg-actionBlue/10 text-actionBlue flex items-center justify-center font-bold text-xs">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold max-w-[180px] truncate">{user.fullName}</span>
            </div>
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-full border border-grayBorder bg-white hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
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

        <section className="bg-white border border-grayBorder rounded-[16px] shadow-l1">
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
                />
              ))}
            </div>
          )}
        </section>
      </main>
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
}: {
  course: MyCourseLearningDTO
  index: number
  onOpen: () => void
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

      <button
        onClick={onOpen}
        className="md:ml-2 h-11 px-4 rounded-[10px] bg-actionBlue hover:bg-actionBlueHover text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
      >
        Vao hoc
        <ChevronRight size={17} />
      </button>
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
