import { useState, useEffect } from 'react'
import { 
  LogOut, BookOpen, Award, Flame, Clock, 
  CheckCircle, Play, ChevronRight, User, Sparkles, BookMarked, 
  ArrowLeft, Send, Check, AlertCircle, ChevronDown, Lock
} from 'lucide-react'
import { UserProfile } from '../services/authService'
import { getCourses, getCourseDetail, CourseDTO, CourseDetailDTO, LessonDTO } from '../services/courseService'

interface DashboardProps {
  user: UserProfile
  onLogout: () => void
  onNavigateLanding: () => void
}

interface CommentItem {
  id: number
  author: string
  content: string
  time: string
  likes: number
}

export default function Dashboard({ user, onLogout, onNavigateLanding }: DashboardProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'my-courses' | 'all-courses'>('my-courses')
  const [allCourses, setAllCourses] = useState<CourseDTO[]>([])
  const [loadingAll, setLoadingAll] = useState(true)

  // ── Study Room States ──
  const [activeCourse, setActiveCourse] = useState<CourseDetailDTO | null>(null)
  const [activeLesson, setActiveLesson] = useState<LessonDTO | null>(null)
  const [activeStudyTab, setActiveStudyTab] = useState<'lecture' | 'exercise' | 'qa'>('lecture')
  
  // Exercise interactions
  const [selectedMCAnswer, setSelectedMCAnswer] = useState<string | null>(null)
  const [fillBlankAnswer, setFillBlankAnswer] = useState('')
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({})
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [selectedDef, setSelectedDef] = useState<string | null>(null)
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false)
  const [exerciseResult, setExerciseResult] = useState<boolean | null>(null)
  
  // Comments
  const [comments, setComments] = useState<CommentItem[]>([
    { id: 1, author: 'Lê Minh Tâm', content: 'Bài giảng rất hay và trực quan, phần phát âm âm đuôi thầy hướng dẫn rất chi tiết!', time: '10 phút trước', likes: 4 },
    { id: 2, author: 'Hoàng Thùy Dương', content: 'Mọi người cho mình hỏi ở câu trắc nghiệm số 2, tại sao lại dùng hiện tại hoàn thành thay vì quá khứ đơn thế?', time: '1 giờ trước', likes: 1 }
  ])
  const [newCommentText, setNewCommentText] = useState('')

  // Completed lessons tracker
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})

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

  // Chuỗi streak và thông số học tập
  const stats = [
    { label: 'Chuỗi Streak', value: '5 ngày', icon: Flame, color: '#FF9F00' },
    { label: 'Thời gian học', value: '120 phút', icon: Clock, color: '#0060FD' },
    { label: 'Đã hoàn thành', value: `${Object.keys(completedLessons).length} bài học`, icon: CheckCircle, color: '#2E7D32' }
  ]

  // Giả lập khóa học của tôi (Đồng bộ từ danh sách khám phá khóa học)
  const myCoursesMock = allCourses.length > 0 
    ? allCourses.slice(0, 2).map((c, idx) => ({
        ...c,
        completed: idx === 0 ? 3 : 0,
        total: 5,
        image: c.thumbnailUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80'
      }))
    : [
        {
          id: '1',
          title: 'Lộ trình Phát âm tiếng Anh chuẩn Mỹ',
          level: 0,
          courseType: 1,
          basePrice: 450000,
          completed: 2,
          total: 5,
          image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80'
        }
      ]

  const dailyWord = {
    word: 'Breakthrough',
    phonetic: '/ˈbreɪkθruː/',
    type: 'noun',
    definition: 'A sudden, dramatic, and important discovery or development.',
    translation: 'Một bước đột phá, phát kiến quan trọng làm thay đổi cục diện.'
  }

  // Vào phòng học của một khóa học cụ thể
  const handleStartStudy = async (courseId: string) => {
    try {
      setLoadingAll(true)
      const data = await getCourseDetail(courseId)
      setActiveCourse(data)
      if (data.lessons && data.lessons.length > 0) {
        // Sắp xếp bài học theo orderIndex
        const sortedLessons = [...data.lessons].sort((a, b) => a.orderIndex - b.orderIndex)
        setActiveLesson(sortedLessons[0])
      }
      setActiveStudyTab('lecture')
      setExerciseSubmitted(false)
      setExerciseResult(null)
      setSelectedMCAnswer(null)
      setFillBlankAnswer('')
      setMatchedPairs({})
    } catch (err) {
      alert('Không thể mở phòng học: ' + err)
    } finally {
      setLoadingAll(false)
    }
  }

  const handleSelectLesson = (lesson: LessonDTO) => {
    setActiveLesson(lesson)
    setActiveStudyTab('lecture')
    setExerciseSubmitted(false)
    setExerciseResult(null)
    setSelectedMCAnswer(null)
    setFillBlankAnswer('')
    setMatchedPairs({})
  }

  const getLevelLabel = (lvl: number) => {
    if (lvl === 0) return 'Beginner'
    if (lvl === 1) return 'Intermediate'
    return 'Advanced'
  }

  const getContentTypeLabel = (type: number) => {
    switch (type) {
      case 0: return 'Video bài giảng'
      case 1: return 'Tài liệu Audio'
      case 2: return 'Lý thuyết'
      case 3: return 'Tài liệu PDF'
      default: return 'Bài giảng'
    }
  }

  // Nộp bài tập
  const handleSubmitExercise = (type: 'mc' | 'blank' | 'match') => {
    setExerciseSubmitted(true)
    if (type === 'mc') {
      const correct = selectedMCAnswer === 'B'
      setExerciseResult(correct)
      if (correct && activeLesson) {
        setCompletedLessons(prev => ({ ...prev, [activeLesson.id]: true }))
      }
    } else if (type === 'blank') {
      const correct = fillBlankAnswer.trim().toLowerCase() === 'in'
      setExerciseResult(correct)
      if (correct && activeLesson) {
        setCompletedLessons(prev => ({ ...prev, [activeLesson.id]: true }))
      }
    } else if (type === 'match') {
      const correct = Object.keys(matchedPairs).length === 3
      setExerciseResult(correct)
      if (correct && activeLesson) {
        setCompletedLessons(prev => ({ ...prev, [activeLesson.id]: true }))
      }
    }
  }

  const handleWordSelect = (word: string) => {
    setSelectedWord(word)
    if (selectedDef) {
      setMatchedPairs(prev => ({ ...prev, [word]: selectedDef }))
      setSelectedWord(null)
      setSelectedDef(null)
    }
  }

  const handleDefSelect = (def: string) => {
    setSelectedDef(def)
    if (selectedWord) {
      setMatchedPairs(prev => ({ ...prev, [selectedWord]: def }))
      setSelectedWord(null)
      setSelectedDef(null)
    }
  }

  // Viết bình luận
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim()) return
    const newComment: CommentItem = {
      id: comments.length + 1,
      author: user.fullName,
      content: newCommentText.trim(),
      time: 'Vừa xong',
      likes: 0
    }
    setComments([newComment, ...comments])
    setNewCommentText('')
  }

  // Nếu đang mở phòng học (Study Room View)
  if (activeCourse && activeLesson) {
    const backupVideos = [
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4'
    ]
    const charCodeSum = activeLesson.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const videoUrl = activeLesson.contentUrl && !activeLesson.contentUrl.includes('cdn.elearning.vn')
      ? activeLesson.contentUrl
      : backupVideos[charCodeSum % backupVideos.length]

    return (
      <div className="min-h-screen bg-offWhite1 text-brandDark">
        {/* Navigation Header */}
        <nav className="w-full border-b border-grayBorder bg-white sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6 h-18 flex items-center justify-between">
            <button
              onClick={() => setActiveCourse(null)}
              className="flex items-center gap-2 text-secondaryText hover:text-actionBlue transition-colors font-semibold text-sm"
            >
              <ArrowLeft size={16} />
              <span>Quay lại Dashboard</span>
            </button>

            <div className="text-center">
              <p className="text-[10px] text-secondaryText uppercase tracking-wider font-bold">Phòng học ảo</p>
              <h1 className="text-sm font-bold text-brandDark truncate max-w-[250px] sm:max-w-md">
                {activeCourse.title}
              </h1>
            </div>

            <div className="w-9 h-9 rounded-full bg-actionBlue/10 flex items-center justify-center text-actionBlue font-bold text-sm border border-actionBlue/10">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        </nav>

        {/* Study Room Container */}
        <main className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: PLAYER & TABS (8 cột) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Player Container */}
            <div className="bg-white border border-grayBorder rounded-[24px] p-5 shadow-l1">
              <div className="relative w-full aspect-video rounded-[16px] overflow-hidden bg-brandDark border border-grayBorder">
                {activeLesson.contentType === 0 || activeLesson.contentType === 1 ? (
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-offWhite1 p-8 overflow-y-auto flex flex-col justify-between">
                    <div>
                      <span className="px-3 py-1 bg-actionBlue/10 text-actionBlue rounded-[6px] border border-actionBlue/10 text-xs font-bold uppercase tracking-wider">
                        {getContentTypeLabel(activeLesson.contentType)}
                      </span>
                      <h2 className="font-poppins text-brandDark text-xl font-bold mt-4 mb-4">
                        {activeLesson.title}
                      </h2>
                      <div className="text-secondaryText text-sm leading-relaxed whitespace-pre-line">
                        {activeLesson.textContent || 'Nội dung lý thuyết chưa cập nhật tài liệu chi tiết. Vui lòng tham khảo các bài tập đi kèm.'}
                      </div>
                    </div>
                    <div className="mt-8 text-center text-xs text-secondaryText border-t border-grayBorder pt-4">
                      Tài liệu được biên soạn bởi English.Learn Education
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] bg-actionBlue/5 border border-actionBlue/10 px-2 py-0.5 rounded text-actionBlue font-bold uppercase">
                    Bài {activeLesson.orderIndex}
                  </span>
                  <h2 className="font-poppins text-brandDark text-lg font-bold mt-1">
                    {activeLesson.title}
                  </h2>
                </div>

                <button 
                  onClick={() => setCompletedLessons(prev => ({ ...prev, [activeLesson.id]: true }))}
                  className={`px-4 py-2 rounded-[999px] font-semibold text-xs uppercase flex items-center gap-1.5 transition-all ${
                    completedLessons[activeLesson.id]
                      ? 'bg-successGreenBg text-successGreenText border border-successGreenText/10'
                      : 'bg-actionBlue hover:bg-actionBlueHover text-white'
                  }`}
                >
                  <CheckCircle size={14} />
                  {completedLessons[activeLesson.id] ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                </button>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="bg-white border border-grayBorder rounded-[24px] overflow-hidden shadow-l1">
              <div className="flex border-b border-grayBorder">
                <button
                  onClick={() => setActiveStudyTab('lecture')}
                  className={`flex-1 py-4 font-poppins text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeStudyTab === 'lecture'
                      ? 'text-actionBlue border-actionBlue bg-offWhite3'
                      : 'text-secondaryText border-transparent hover:text-brandDark'
                  }`}
                >
                  Nội dung lý thuyết
                </button>
                <button
                  onClick={() => setActiveStudyTab('exercise')}
                  className={`flex-1 py-4 font-poppins text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeStudyTab === 'exercise'
                      ? 'text-actionBlue border-actionBlue bg-offWhite3'
                      : 'text-secondaryText border-transparent hover:text-brandDark'
                  }`}
                >
                  Luyện tập (Quiz Room)
                </button>
                <button
                  onClick={() => setActiveStudyTab('qa')}
                  className={`flex-1 py-4 font-poppins text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeStudyTab === 'qa'
                      ? 'text-actionBlue border-actionBlue bg-offWhite3'
                      : 'text-secondaryText border-transparent hover:text-brandDark'
                  }`}
                >
                  Hỏi đáp ({comments.length})
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="p-6">
                {activeStudyTab === 'lecture' && (
                  <div className="space-y-4">
                    <h3 className="font-poppins text-brandDark text-base font-bold mb-2">Tóm tắt nội dung học tập</h3>
                    <p className="text-secondaryText text-sm leading-relaxed">
                      Bài học này tập trung nghiên cứu cấu trúc ngữ pháp thông dụng và phương pháp phát âm chuẩn xác. Hãy lắng nghe kỹ video hướng dẫn, sau đó làm các câu hỏi trắc nghiệm thực hành để củng cố kỹ năng.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="bg-offWhite1 border border-grayBorder rounded-xl p-4 flex gap-3 items-start">
                        <BookMarked className="text-actionBlue shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-brandDark">Trọng tâm kiến thức</p>
                          <p className="text-xs text-secondaryText leading-relaxed mt-1">Từ vựng giao tiếp thực tiễn, phân tích ngữ cảnh và các cặp từ đồng nghĩa.</p>
                        </div>
                      </div>
                      <div className="bg-offWhite1 border border-grayBorder rounded-xl p-4 flex gap-3 items-start">
                        <Award className="text-actionBlue shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs font-bold text-brandDark">Mục tiêu đầu ra</p>
                          <p className="text-xs text-secondaryText leading-relaxed mt-1">Vận dụng tốt vào giao tiếp hàng ngày, tăng tốc phản xạ từ vựng.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStudyTab === 'exercise' && (
                  <div className="space-y-6">
                    {/* Render quiz dynamic base on order index */}
                    {activeLesson.orderIndex % 3 === 1 ? (
                      /* Trắc nghiệm (Multiple Choice) */
                      <div className="space-y-4">
                        <div className="bg-offWhite1 border border-grayBorder rounded-xl p-4">
                          <span className="text-[10px] bg-actionBlue/10 text-actionBlue font-bold uppercase px-2 py-0.5 rounded border border-actionBlue/10">TRẮC NGHIỆM</span>
                          <p className="text-sm font-semibold text-brandDark mt-3 leading-relaxed">
                            Chọn đáp án đúng nhất hoàn thành câu sau: <br />
                            <strong>"She ______ English since she was a child."</strong>
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { key: 'A', text: 'studies' },
                            { key: 'B', text: 'has studied' },
                            { key: 'C', text: 'studied' },
                            { key: 'D', text: 'is studying' }
                          ].map((opt) => (
                            <button
                              key={opt.key}
                              disabled={exerciseSubmitted}
                              onClick={() => setSelectedMCAnswer(opt.key)}
                              className={`p-4 rounded-xl border text-left font-medium text-xs transition-all flex items-center justify-between ${
                                selectedMCAnswer === opt.key 
                                  ? 'border-actionBlue bg-actionBlue/5 text-actionBlue shadow-sm' 
                                  : 'border-grayBorder hover:bg-offWhite1 text-brandDark'
                              }`}
                            >
                              <span>{opt.key}. {opt.text}</span>
                            </button>
                          ))}
                        </div>

                        {!exerciseSubmitted ? (
                          <button
                            onClick={() => handleSubmitExercise('mc')}
                            disabled={!selectedMCAnswer}
                            className="mt-4 px-6 py-2.5 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive disabled:opacity-50 text-white rounded-[999px] font-semibold text-xs uppercase"
                          >
                            Nộp bài tập
                          </button>
                        ) : (
                          <div className="mt-4 p-4 border rounded-xl flex items-start gap-3 bg-offWhite1">
                            {exerciseResult ? (
                              <CheckCircle className="text-successGreenText shrink-0 mt-0.5" size={18} />
                            ) : (
                              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            )}
                            <div>
                              <p className={`text-xs font-bold ${exerciseResult ? 'text-successGreenText' : 'text-red-500'}`}>
                                {exerciseResult ? 'Chính xác! (+10 Điểm)' : 'Chưa chính xác!'}
                              </p>
                              <p className="text-[11px] text-secondaryText leading-relaxed mt-1">
                                Câu trên dùng thì Hiện tại hoàn thành vì diễn tả một hành động bắt đầu từ quá khứ (since she was a child) kéo dài đến hiện tại. Đáp án là <strong>B. has studied</strong>.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : activeLesson.orderIndex % 3 === 2 ? (
                      /* Điền vào chỗ trống (Fill in the blanks) */
                      <div className="space-y-4">
                        <div className="bg-offWhite1 border border-grayBorder rounded-xl p-4">
                          <span className="text-[10px] bg-actionBlue/10 text-actionBlue font-bold uppercase px-2 py-0.5 rounded border border-actionBlue/10">ĐIỀN TỪ KHUYẾT</span>
                          <p className="text-sm font-semibold text-brandDark mt-3 leading-relaxed">
                            Điền một giới từ thích hợp hoàn thành câu: <br />
                            <strong>"I am highly interested _____ learning American pronunciation."</strong>
                          </p>
                        </div>

                        <div className="max-w-xs">
                          <input
                            type="text"
                            disabled={exerciseSubmitted}
                            value={fillBlankAnswer}
                            onChange={(e) => setFillBlankAnswer(e.target.value)}
                            placeholder="Nhập giới từ..."
                            className="w-full bg-white border border-grayBorder rounded-lg py-3 px-4 text-brandDark font-mono text-sm placeholder:text-darkGrayBorder focus:outline-none focus:border-actionBlue focus:ring-4 focus:ring-actionBlue/10 transition-all uppercase"
                          />
                        </div>

                        {!exerciseSubmitted ? (
                          <button
                            onClick={() => handleSubmitExercise('blank')}
                            disabled={!fillBlankAnswer.trim()}
                            className="px-6 py-2.5 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive disabled:opacity-50 text-white rounded-[999px] font-semibold text-xs uppercase"
                          >
                            Nộp câu trả lời
                          </button>
                        ) : (
                          <div className="p-4 border rounded-xl flex items-start gap-3 bg-offWhite1">
                            {exerciseResult ? (
                              <CheckCircle className="text-successGreenText shrink-0 mt-0.5" size={18} />
                            ) : (
                              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            )}
                            <div>
                              <p className={`text-xs font-bold ${exerciseResult ? 'text-successGreenText' : 'text-red-500'}`}>
                                {exerciseResult ? 'Cực kỳ chính xác! (+10 Điểm)' : 'Chưa đúng rồi!'}
                              </p>
                              <p className="text-[11px] text-secondaryText leading-relaxed mt-1">
                                Cấu trúc tính từ: <strong>be interested + in</strong> (quan tâm, hứng thú về việc gì đó). Đáp án đúng là <strong>in</strong>.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Ghép cặp (Matching) */
                      <div className="space-y-4">
                        <div className="bg-offWhite1 border border-grayBorder rounded-xl p-4">
                          <span className="text-[10px] bg-actionBlue/10 text-actionBlue font-bold uppercase px-2 py-0.5 rounded border border-actionBlue/10">GHÉP CẶP TỪ VỰNG</span>
                          <p className="text-sm font-semibold text-brandDark mt-3 leading-relaxed">
                            Hãy ghép nối từ vựng bên trái với định nghĩa tiếng Việt tương ứng bên phải.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          {/* Từ vựng */}
                          <div className="space-y-2">
                            <p className="text-[10px] text-secondaryText uppercase tracking-wider font-bold">Từ tiếng Anh</p>
                            {['Acquire', 'Fluency', 'Immersive'].map((word) => (
                              <button
                                key={word}
                                disabled={exerciseSubmitted}
                                onClick={() => handleWordSelect(word)}
                                className={`w-full p-3 rounded-lg border text-left text-xs font-bold transition-all ${
                                  matchedPairs[word]
                                    ? 'bg-successGreenBg/20 border-successGreenText/30 text-successGreenText'
                                    : selectedWord === word
                                    ? 'border-actionBlue bg-actionBlue/5 text-actionBlue'
                                    : 'border-grayBorder hover:bg-offWhite1 text-brandDark'
                                }`}
                              >
                                {word} {matchedPairs[word] && `➔ ${matchedPairs[word]}`}
                              </button>
                            ))}
                          </div>

                          {/* Định nghĩa */}
                          <div className="space-y-2">
                            <p className="text-[10px] text-secondaryText uppercase tracking-wider font-bold">Định nghĩa tiếng Việt</p>
                            {['Môi trường đắm chìm', 'Tiếp thu, thu nhận', 'Trôi chảy, lưu loát'].map((def) => {
                              const isMatched = Object.values(matchedPairs).includes(def)
                              return (
                                <button
                                  key={def}
                                  disabled={exerciseSubmitted || isMatched}
                                  onClick={() => handleDefSelect(def)}
                                  className={`w-full p-3 rounded-lg border text-left text-xs font-medium transition-all ${
                                    isMatched
                                      ? 'bg-successGreenBg/20 border-transparent text-successGreenText'
                                      : selectedDef === def
                                      ? 'border-actionBlue bg-actionBlue/5 text-actionBlue'
                                      : 'border-grayBorder hover:bg-offWhite1 text-brandDark'
                                  }`}
                                >
                                  {def}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {!exerciseSubmitted ? (
                          <button
                            onClick={() => handleSubmitExercise('match')}
                            disabled={Object.keys(matchedPairs).length < 3}
                            className="mt-4 px-6 py-2.5 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive disabled:opacity-50 text-white rounded-[999px] font-semibold text-xs uppercase"
                          >
                            Xác nhận kết quả
                          </button>
                        ) : (
                          <div className="p-4 border rounded-xl flex items-start gap-3 bg-offWhite1">
                            <CheckCircle className="text-successGreenText shrink-0 mt-0.5" size={18} />
                            <div>
                              <p className="text-xs font-bold text-successGreenText">Hoàn thành ghép từ! (+10 Điểm)</p>
                              <p className="text-[11px] text-secondaryText leading-relaxed mt-1">
                                Kết quả chính xác: <br />
                                ➔ Acquire: Tiếp thu, thu nhận <br />
                                ➔ Fluency: Trôi chảy, lưu loát <br />
                                ➔ Immersive: Môi trường đắm chìm
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeStudyTab === 'qa' && (
                  <div className="space-y-6">
                    {/* Add Comment form */}
                    <form onSubmit={handleAddComment} className="flex gap-3">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Đặt câu hỏi thảo luận về bài học này..."
                        className="flex-1 bg-white border border-grayBorder rounded-lg py-2.5 px-4 text-brandDark text-sm placeholder:text-darkGrayBorder focus:outline-none focus:border-actionBlue focus:ring-4 focus:ring-actionBlue/10 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className="p-3 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center"
                      >
                        <Send size={16} />
                      </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comm) => (
                        <div key={comm.id} className="p-4 border border-grayBorder rounded-xl flex gap-3.5 items-start">
                          <div className="w-8 h-8 rounded-full bg-actionBlue/5 text-actionBlue border border-actionBlue/10 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {comm.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-bold text-brandDark">{comm.author}</span>
                              <span className="text-[10px] text-secondaryText">{comm.time}</span>
                            </div>
                            <p className="text-xs text-brandDark mt-1 leading-relaxed">
                              {comm.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI: GIÁO TRÌNH LỘ TRÌNH (4 cột) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-grayBorder rounded-[24px] p-5 shadow-l1">
              <h3 className="font-poppins text-brandDark text-base font-bold pb-4 border-b border-grayBorder mb-4 flex justify-between items-center">
                <span>Danh mục bài học</span>
                <span className="text-[11px] text-secondaryText font-medium bg-offWhite1 px-2.5 py-1 rounded-[6px] border border-grayBorder">
                  {activeCourse.lessons.length} bài học
                </span>
              </h3>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {[...activeCourse.lessons]
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((lesson, idx) => {
                    const isSelected = activeLesson.id === lesson.id
                    const isDone = completedLessons[lesson.id]
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? 'border-actionBlue bg-actionBlue/5 shadow-sm'
                            : 'border-transparent hover:bg-offWhite1'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle size={16} className="text-successGreenText" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-darkGrayBorder flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate leading-tight ${isSelected ? 'text-actionBlue' : 'text-brandDark'}`}>
                            Bài {lesson.orderIndex}: {lesson.title}
                          </p>
                          <p className="text-[10px] text-secondaryText mt-1">
                            {getContentTypeLabel(lesson.contentType)}
                          </p>
                        </div>
                      </button>
                    )
                  })}
              </div>
            </div>
          </div>

        </main>
      </div>
    )
  }

  // Dashboard Mặc định (Main Home)
  return (
    <div className="min-h-screen bg-offWhite1 text-brandDark pb-20">
      
      {/* ── HEADER ── */}
      <nav className="w-full border-b border-grayBorder bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={onNavigateLanding}
            className="font-poppins text-brandDark text-xl font-bold tracking-tight hover:opacity-80 transition-all flex items-center gap-1.5"
            title="Quay lại trang chủ"
          >
            <span className="text-actionBlue">English</span>
            <span className="text-brandDark">.Learn</span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <button className="text-actionBlue">Bảng điều khiển</button>
            <button onClick={() => setActiveTab('all-courses')} className="text-secondaryText hover:text-actionBlue transition-colors">Khám phá lộ trình</button>
            <button onClick={() => alert('Thư viện từ vựng ảo đang cập nhật')} className="text-secondaryText hover:text-actionBlue transition-colors">Kho từ vựng</button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
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

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-[16px] bg-white border border-grayBorder p-2 shadow-l3 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-grayBorder">
                    <p className="text-[10px] text-secondaryText uppercase tracking-widest font-bold">Học viên</p>
                    <p className="text-sm font-semibold text-brandDark truncate mt-0.5">{user.fullName}</p>
                    <p className="text-xs text-secondaryText truncate">{user.email}</p>
                  </div>
                  
                  <button 
                    onClick={() => { setProfileDropdownOpen(false); alert('Hồ sơ học tập của bạn đang đồng bộ!') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-1 text-sm text-brandDark hover:text-actionBlue hover:bg-offWhite1 rounded-lg transition-colors text-left font-medium"
                  >
                    Hồ sơ của tôi
                  </button>

                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-0.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
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
              Chào mừng trở lại học viên xuất sắc
            </div>
            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-brandDark tracking-tight">
              {user.fullName}
            </h1>
            <p className="text-sm text-secondaryText mt-3 max-w-xl leading-relaxed">
              Hôm nay là một ngày tuyệt vời để bứt phá giới hạn ngôn ngữ. Hãy duy trì chuỗi streak hàng ngày để đạt kết quả học tập vượt trội!
            </p>
          </div>

          <button 
            onClick={() => {
              if (myCoursesMock.length > 0) {
                handleStartStudy(myCoursesMock[0].id)
              }
            }}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-actionBlue hover:bg-actionBlueHover active:bg-actionBlueActive text-white rounded-[999px] font-bold text-sm tracking-wide shadow-l1 hover:scale-[1.02] active:scale-[0.98] transition-all self-stretch md:self-auto justify-center"
          >
            <Play size={14} fill="currentColor" />
            Học bài tiếp theo
          </button>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
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
          
          {/* 📚 LEFT/CENTER: LIST OF MY COURSES (2/3 width) */}
          <div className="lg:col-span-2">
            
            {/* Tab Header */}
            <div className="flex items-center justify-between border-b border-grayBorder pb-4 mb-6">
              <div className="flex gap-6 font-semibold text-sm">
                <button 
                  onClick={() => setActiveTab('my-courses')}
                  className={`pb-4 -mb-[18px] transition-all relative ${activeTab === 'my-courses' ? 'text-actionBlue' : 'text-secondaryText hover:text-brandDark'}`}
                >
                  Khóa học của tôi ({myCoursesMock.length})
                  {activeTab === 'my-courses' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-actionBlue" />}
                </button>
                <button 
                  onClick={() => setActiveTab('all-courses')}
                  className={`pb-4 -mb-[18px] transition-all relative ${activeTab === 'all-courses' ? 'text-actionBlue' : 'text-secondaryText hover:text-brandDark'}`}
                >
                  Khám phá lộ trình ({allCourses.length})
                  {activeTab === 'all-courses' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-actionBlue" />}
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="flex flex-col gap-5">
              {activeTab === 'my-courses' ? (
                myCoursesMock.map((course) => {
                  const percent = Math.round((course.completed / course.total) * 100)
                  return (
                    <div 
                      key={course.id}
                      className="bg-white border border-grayBorder hover:border-actionBlue/20 rounded-[16px] p-5 flex flex-col sm:flex-row gap-5 items-stretch transition-all shadow-l1 hover:shadow-l2 duration-200"
                    >
                      {/* Course Thumbnail */}
                      <div className="w-full sm:w-36 h-24 rounded-[12px] overflow-hidden border border-grayBorder flex-shrink-0 relative bg-offWhite2">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Course Content */}
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

                        {/* Progress Bar */}
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

                      {/* Actions button */}
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
              ) : loadingAll ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-actionBlue"></div>
                </div>
              ) : allCourses.length === 0 ? (
                <div className="text-center py-10 text-secondaryText text-sm font-medium">
                  Chưa có lộ trình nào được xuất bản.
                </div>
              ) : (
                allCourses.map((course, i) => {
                  const isFree = course.courseType === 0;
                  const priceText = isFree ? 'Miễn phí' : `${course.basePrice.toLocaleString('vi-VN')}đ`;
                  const backupImages = [
                    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80'
                  ];
                  const imageSrc = course.thumbnailUrl && !course.thumbnailUrl.includes('cdn.elearning.vn')
                    ? course.thumbnailUrl
                    : backupImages[i % backupImages.length];

                  return (
                    <div 
                      key={course.id}
                      className="bg-white border border-grayBorder hover:border-actionBlue/20 rounded-[16px] p-5 flex flex-col sm:flex-row gap-5 items-stretch transition-all shadow-l1 hover:shadow-l2 duration-200"
                    >
                      {/* Course Thumbnail */}
                      <div className="w-full sm:w-36 h-24 rounded-[12px] overflow-hidden border border-grayBorder flex-shrink-0 relative bg-offWhite2">
                        <img 
                          src={imageSrc} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Course Content */}
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
                          <p className="text-secondaryText text-xs leading-relaxed mt-1 line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-[9px] px-2 py-0.5 rounded bg-offWhite2 border border-grayBorder text-secondaryText uppercase tracking-wider font-bold">
                            {isFree ? 'FREE' : 'PREMIUM'}
                          </span>
                          <span className="text-xs text-actionBlue font-bold">
                            Học phí: {priceText}
                          </span>
                        </div>
                      </div>

                      {/* Actions button */}
                      <div className="flex items-center justify-end sm:pl-3">
                        <button 
                          onClick={() => handleStartStudy(course.id)}
                          className="px-5 py-2.5 bg-actionBlue hover:bg-actionBlueHover text-white rounded-[999px] text-xs font-bold uppercase shadow-l1 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Học ngay</span>
                          <ChevronRight size={14} />
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
            <div className="rounded-[24px] bg-white border border-grayBorder p-6 shadow-l1 relative overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-28 h-28 bg-actionBlue/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-1.5 text-actionBlue text-xs font-bold uppercase tracking-wider mb-4">
                <BookMarked size={14} />
                Từ vựng vàng hôm nay
              </div>

              <div className="border-b border-grayBorder pb-4 mb-4">
                <div className="flex items-baseline gap-2.5">
                  <h4 className="font-poppins text-xl font-bold tracking-tight text-brandDark">
                    {dailyWord.word}
                  </h4>
                  <span className="text-xs text-actionBlue italic font-semibold">
                    {dailyWord.type}
                  </span>
                </div>
                <p className="text-xs text-secondaryText font-mono mt-1">
                  {dailyWord.phonetic}
                </p>
              </div>

              <div className="flex flex-col gap-3.5">
                <div>
                  <p className="text-[10px] text-secondaryText uppercase tracking-wider font-bold">Định nghĩa Anh-Anh</p>
                  <p className="text-xs text-brandDark leading-relaxed mt-1">
                    {dailyWord.definition}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-secondaryText uppercase tracking-wider font-bold">Nghĩa tiếng Việt</p>
                  <p className="text-xs text-actionBlue leading-relaxed mt-1 font-semibold">
                    {dailyWord.translation}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => alert('Đã đánh dấu thuộc từ vựng này')}
                className="w-full py-2.5 mt-6 border border-actionBlue/30 hover:bg-actionBlue/5 text-actionBlue rounded-[999px] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Đánh dấu đã thuộc từ
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-[24px] bg-white border border-grayBorder p-6 shadow-l1">
              <h4 className="text-[10px] uppercase tracking-wider text-secondaryText font-bold mb-4">Luyện tập nhanh</h4>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => alert('Bắt đầu thử thách 10 từ vựng!')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-offWhite1 hover:bg-offWhite3 border border-grayBorder hover:border-darkGrayBorder transition-all text-left text-xs uppercase font-bold tracking-wider text-brandDark group"
                >
                  <span>🚀 Học 10 từ ngẫu nhiên</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => alert('Đang tải kho nghe tiếng Anh!')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-offWhite1 hover:bg-offWhite3 border border-grayBorder hover:border-darkGrayBorder transition-all text-left text-xs uppercase font-bold tracking-wider text-brandDark group"
                >
                  <span>🎧 Luyện nghe phản xạ</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button 
                  onClick={() => alert('Đang thiết lập phòng Quiz!')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-offWhite1 hover:bg-offWhite3 border border-grayBorder hover:border-darkGrayBorder transition-all text-left text-xs uppercase font-bold tracking-wider text-brandDark group"
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
