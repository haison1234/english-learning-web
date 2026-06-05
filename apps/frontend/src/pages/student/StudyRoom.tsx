import { useState, useEffect } from 'react'
import { ArrowLeft, BookMarked, Award, CheckCircle, AlertCircle, Send } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserProfile } from '../../services/authService'
import { getCourseDetail, CourseDetailDTO, LessonDTO } from '../../services/courseService'

interface StudyRoomProps {
  user: UserProfile | null
}

interface CommentItem {
  id: number
  author: string
  content: string
  time: string
  likes: number
}

export default function StudyRoom({ user }: StudyRoomProps) {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()

  const [activeCourse, setActiveCourse] = useState<CourseDetailDTO | null>(null)
  const [activeLesson, setActiveLesson] = useState<LessonDTO | null>(null)
  const [activeStudyTab, setActiveStudyTab] = useState<'lecture' | 'exercise' | 'qa'>('lecture')
  const [loading, setLoading] = useState(true)

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
    async function loadCourse() {
      if (!courseId) return
      try {
        setLoading(true)
        const data = await getCourseDetail(courseId)
        setActiveCourse(data)
        if (data.lessons && data.lessons.length > 0) {
          const sortedLessons = [...data.lessons].sort((a, b) => a.orderIndex - b.orderIndex)
          setActiveLesson(sortedLessons[0])
        }
      } catch (err) {
        console.error('Không thể mở phòng học:', err)
        alert('Có lỗi xảy ra khi tải nội dung học tập.')
        navigate('/student')
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [courseId, navigate])

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-actionBlue"></div>
      </div>
    )
  }

  if (!activeCourse || !activeLesson) {
    return (
      <div className="min-h-screen bg-offWhite1 flex items-center justify-center">
        <p className="text-secondaryText">Không tìm thấy nội dung bài học.</p>
      </div>
    )
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
    let correct = false
    if (type === 'mc') {
      correct = selectedMCAnswer === 'B'
    } else if (type === 'blank') {
      correct = fillBlankAnswer.trim().toLowerCase() === 'in'
    } else if (type === 'match') {
      correct = Object.keys(matchedPairs).length === 3
    }
    setExerciseResult(correct)
    if (correct && activeLesson) {
      setCompletedLessons(prev => ({ ...prev, [activeLesson.id]: true }))
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
        <div className="max-w-[1440px] mx-auto px-6 h-18 flex items-center justify-between py-4">
          <button
            onClick={() => navigate('/student')}
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
