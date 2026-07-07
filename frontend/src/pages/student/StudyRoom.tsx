import { useEffect, useRef, useState } from 'react'
import type { Dispatch, ElementType, MutableRefObject, SetStateAction } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
  ClipboardList,
  FileText,
  History,
  Play,
  Send,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserProfile } from '../../services/authService'
import {
  CourseLearningDTO,
  ExerciseAttemptDTO,
  ExerciseQuestionDTO,
  ExerciseSubmitResponse,
  LearningLessonDTO,
  getCourseLearning,
  getExerciseAttempts,
  getLessonExercises,
  submitLessonExercise,
  updateLessonProgress,
} from '../../services/learningService'

interface StudyRoomProps {
  user: UserProfile | null
}

type StudyTab = 'content' | 'exercise' | 'history'

export default function StudyRoom({ user }: StudyRoomProps) {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null)
  const lastSavedSecondRef = useRef(0)

  const [course, setCourse] = useState<CourseLearningDTO | null>(null)
  const [activeLesson, setActiveLesson] = useState<LearningLessonDTO | null>(null)
  const [activeTab, setActiveTab] = useState<StudyTab>('content')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [exercises, setExercises] = useState<ExerciseQuestionDTO[]>([])
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [submitResult, setSubmitResult] = useState<ExerciseSubmitResponse | null>(null)
  const [attempts, setAttempts] = useState<ExerciseAttemptDTO[]>([])
  const [exerciseLoading, setExerciseLoading] = useState(false)

  useEffect(() => {
    async function loadCourse() {
      if (!courseId) return
      try {
        setLoading(true)
        setError(null)
        const data = await getCourseLearning(courseId)
        setCourse(data)
        setActiveLesson(pickInitialLesson(data.lessons))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Khong the tai phong hoc.')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  useEffect(() => {
    async function loadLessonExercise() {
      if (!courseId || !activeLesson) return

      setAnswers({})
      setSubmitResult(null)
      setExerciseLoading(true)
      lastSavedSecondRef.current = activeLesson.positionSeconds || 0

      try {
        if (activeLesson.progressStatus === 'NOT_STARTED') {
          const progress = await updateLessonProgress(courseId, activeLesson.id, {
            positionSeconds: activeLesson.positionSeconds,
            timeSpentSeconds: activeLesson.timeSpentSeconds,
          })
          applyProgress(progress.lessonId, progress.progressStatus, progress.completed, progress.positionSeconds)
        }

        const [questions, history] = await Promise.all([
          getLessonExercises(courseId, activeLesson.id),
          getExerciseAttempts(courseId, activeLesson.id),
        ])
        setExercises(questions)
        setAttempts(history)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Khong the tai bai tap.')
      } finally {
        setExerciseLoading(false)
      }
    }

    loadLessonExercise()
  }, [courseId, activeLesson?.id])

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-offWhite1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-actionBlue" />
      </div>
    )
  }

  if (error || !course || !activeLesson) {
    return (
      <div className="min-h-screen bg-offWhite1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertCircle className="text-red-500" size={32} />
        <p className="text-sm text-secondaryText">{error || 'Khong tim thay noi dung khoa hoc.'}</p>
        <button
          onClick={() => navigate('/student')}
          className="px-4 py-2 rounded-full bg-actionBlue text-white font-bold text-sm"
        >
          Quay lai dashboard
        </button>
      </div>
    )
  }

  const orderedLessons = [...course.lessons].sort((a, b) => a.orderIndex - b.orderIndex)

  async function refreshCourse(selectedLessonId: string) {
    if (!courseId) return
    const data = await getCourseLearning(courseId)
    setCourse(data)
    const selected = data.lessons.find((lesson) => lesson.id === selectedLessonId) || pickInitialLesson(data.lessons)
    setActiveLesson(selected)
  }

  function applyProgress(lessonId: string, status: LearningLessonDTO['progressStatus'], completed: boolean, position: number) {
    setActiveLesson((current) => current && current.id === lessonId
      ? { ...current, progressStatus: status, completed, positionSeconds: position }
      : current)
    setCourse((current) => current
      ? {
          ...current,
          lessons: current.lessons.map((lesson) => lesson.id === lessonId
            ? { ...lesson, progressStatus: status, completed, positionSeconds: position }
            : lesson),
        }
      : current)
  }

  async function handleMarkCompleted() {
    if (!courseId || !activeLesson) return
    const currentSecond = Math.floor(mediaRef.current?.currentTime || activeLesson.positionSeconds || 0)
    const progress = await updateLessonProgress(courseId, activeLesson.id, {
      positionSeconds: currentSecond,
      timeSpentSeconds: Math.max(activeLesson.timeSpentSeconds || 0, currentSecond),
      completed: true,
    })
    applyProgress(progress.lessonId, progress.progressStatus, progress.completed, progress.positionSeconds)
    await refreshCourse(activeLesson.id)
  }

  async function handleMediaTimeUpdate() {
    if (!courseId || !activeLesson || !mediaRef.current || activeLesson.completed) return
    const currentSecond = Math.floor(mediaRef.current.currentTime)
    if (currentSecond < 1 || currentSecond - lastSavedSecondRef.current < 10) return

    lastSavedSecondRef.current = currentSecond
    const progress = await updateLessonProgress(courseId, activeLesson.id, {
      positionSeconds: currentSecond,
      timeSpentSeconds: Math.max(activeLesson.timeSpentSeconds || 0, currentSecond),
    })
    applyProgress(progress.lessonId, progress.progressStatus, progress.completed, progress.positionSeconds)
  }

  function handleLoadedMetadata() {
    if (!mediaRef.current || !activeLesson || !activeLesson.positionSeconds) return
    mediaRef.current.currentTime = activeLesson.positionSeconds
  }

  async function handleSubmitExercise() {
    if (!courseId || !activeLesson) return
    const result = await submitLessonExercise(courseId, activeLesson.id, answers)
    setSubmitResult(result)
    const history = await getExerciseAttempts(courseId, activeLesson.id)
    setAttempts(history)
    await refreshCourse(activeLesson.id)
    setActiveTab('exercise')
  }

  function handleSelectLesson(lesson: LearningLessonDTO) {
    setActiveLesson(lesson)
    setActiveTab('content')
  }

  return (
    <div className="min-h-screen bg-offWhite1 text-brandDark">
      <nav className="w-full border-b border-grayBorder bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <button
            onClick={() => navigate('/student')}
            className="flex items-center gap-2 text-secondaryText hover:text-actionBlue transition-colors font-semibold text-sm"
          >
            <ArrowLeft size={16} />
            <span>Quay lai Dashboard</span>
          </button>

          <div className="text-center min-w-0 px-4">
            <p className="text-[10px] text-secondaryText uppercase tracking-wider font-bold">Phong hoc</p>
            <h1 className="text-sm font-bold truncate max-w-[260px] sm:max-w-md">{course.title}</h1>
          </div>

          <div className="w-9 h-9 rounded-full bg-actionBlue/10 flex items-center justify-center text-actionBlue font-bold text-sm border border-actionBlue/10">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-grayBorder rounded-[16px] p-5 shadow-l1">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] bg-actionBlue/5 border border-actionBlue/10 px-2 py-0.5 rounded text-actionBlue font-bold uppercase">
                  Bai {activeLesson.orderIndex}
                </span>
                <h2 className="font-poppins text-lg font-bold mt-1">{activeLesson.title}</h2>
                <p className="text-xs text-secondaryText mt-1">
                  Trang thai: {statusLabel(activeLesson.progressStatus)}
                </p>
              </div>
              <button
                onClick={handleMarkCompleted}
                className={`px-4 py-2 rounded-full font-bold text-xs uppercase flex items-center gap-1.5 transition-colors ${
                  activeLesson.completed
                    ? 'bg-successGreenBg text-successGreenText border border-successGreenText/10'
                    : 'bg-actionBlue hover:bg-actionBlueHover text-white'
                }`}
              >
                <CheckCircle size={14} />
                {activeLesson.completed ? 'Da xem' : 'Danh dau da xem'}
              </button>
            </div>

            <LessonContent
              lesson={activeLesson}
              mediaRef={mediaRef}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleMediaTimeUpdate}
              onEnded={handleMarkCompleted}
            />
          </div>

          <div className="bg-white border border-grayBorder rounded-[16px] overflow-hidden shadow-l1">
            <div className="flex border-b border-grayBorder">
              <TabButton active={activeTab === 'content'} icon={BookOpen} label="Noi dung" onClick={() => setActiveTab('content')} />
              <TabButton active={activeTab === 'exercise'} icon={ClipboardList} label="Bai tap" onClick={() => setActiveTab('exercise')} />
              <TabButton active={activeTab === 'history'} icon={History} label={`Lich su (${attempts.length})`} onClick={() => setActiveTab('history')} />
            </div>

            <div className="p-6">
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <h3 className="font-poppins font-bold">Tom tat bai hoc</h3>
                  <p className="text-sm text-secondaryText leading-relaxed whitespace-pre-line">
                    {activeLesson.textContent || 'Hay xem noi dung bai hoc va hoan thanh bai tap de tu danh gia kien thuc.'}
                  </p>
                </div>
              )}

              {activeTab === 'exercise' && (
                <ExercisePanel
                  loading={exerciseLoading}
                  exercises={exercises}
                  answers={answers}
                  setAnswers={setAnswers}
                  submitResult={submitResult}
                  onSubmit={handleSubmitExercise}
                />
              )}

              {activeTab === 'history' && (
                <AttemptHistory attempts={attempts} />
              )}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="bg-white border border-grayBorder rounded-[16px] p-5 shadow-l1 sticky top-[96px]">
            <div className="pb-4 border-b border-grayBorder mb-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-poppins font-bold">Lo trinh bai hoc</h3>
                <span className="text-[11px] text-secondaryText font-semibold">
                  {course.completedLessons}/{course.totalLessons} bai
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-secondaryText font-semibold mb-1.5">
                  <span>Tien do khoa hoc</span>
                  <span>{course.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-offWhite2 rounded-full overflow-hidden border border-grayBorder">
                  <div className="h-full bg-actionBlue rounded-full" style={{ width: `${course.progressPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {orderedLessons.map((lesson) => {
                const selected = activeLesson.id === lesson.id
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full p-4 rounded-xl border text-left flex gap-3 transition-colors ${
                      selected
                        ? 'border-actionBlue bg-actionBlue/5'
                        : 'border-transparent hover:bg-offWhite1'
                    }`}
                  >
                    <StatusIcon status={lesson.progressStatus} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${selected ? 'text-actionBlue' : 'text-brandDark'}`}>
                        Bai {lesson.orderIndex}: {lesson.title}
                      </p>
                      <p className="text-[10px] text-secondaryText mt-1">{statusLabel(lesson.progressStatus)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

function LessonContent({
  lesson,
  mediaRef,
  onLoadedMetadata,
  onTimeUpdate,
  onEnded,
}: {
  lesson: LearningLessonDTO
  mediaRef: MutableRefObject<HTMLVideoElement | HTMLAudioElement | null>
  onLoadedMetadata: () => void
  onTimeUpdate: () => void
  onEnded: () => void
}) {
  const hasMedia = !!lesson.contentUrl && !lesson.contentUrl.includes('cdn.elearning.vn')

  if (lesson.contentType === 0 && hasMedia) {
    return (
      <div className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-brandDark border border-grayBorder">
        <video
          key={lesson.id}
          ref={(node) => { mediaRef.current = node }}
          src={lesson.contentUrl || undefined}
          controls
          playsInline
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  if (lesson.contentType === 1 && hasMedia) {
    return (
      <div className="rounded-[12px] border border-grayBorder bg-offWhite1 p-6">
        <audio
          key={lesson.id}
          ref={(node) => { mediaRef.current = node }}
          src={lesson.contentUrl || undefined}
          controls
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          className="w-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-[260px] rounded-[12px] border border-grayBorder bg-offWhite1 p-6">
      <div className="flex items-center gap-2 text-actionBlue text-xs font-bold uppercase mb-4">
        <FileText size={15} />
        Tai lieu van ban
      </div>
      <p className="text-sm text-secondaryText leading-relaxed whitespace-pre-line">
        {lesson.textContent || 'Noi dung bai hoc dang duoc cap nhat.'}
      </p>
    </div>
  )
}

function ExercisePanel({
  loading,
  exercises,
  answers,
  setAnswers,
  submitResult,
  onSubmit,
}: {
  loading: boolean
  exercises: ExerciseQuestionDTO[]
  answers: Record<string, unknown>
  setAnswers: Dispatch<SetStateAction<Record<string, unknown>>>
  submitResult: ExerciseSubmitResponse | null
  onSubmit: () => void
}) {
  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-actionBlue" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {exercises.map((question, index) => (
        <div key={question.id} className="border border-grayBorder rounded-[12px] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] bg-actionBlue/5 text-actionBlue border border-actionBlue/10 px-2 py-0.5 rounded font-bold uppercase">
              Cau {index + 1} - {questionTypeLabel(question.type)}
            </span>
            {submitResult?.results.find((result) => result.questionId === question.id)?.correct === true && (
              <CheckCircle size={16} className="text-successGreenText" />
            )}
          </div>
          <p className="text-sm font-semibold mt-3 leading-relaxed">{question.prompt}</p>
          <QuestionInput question={question} answers={answers} setAnswers={setAnswers} disabled={!!submitResult} />

          {submitResult && (
            <QuestionResult result={submitResult.results.find((item) => item.questionId === question.id)} />
          )}
        </div>
      ))}

      {submitResult ? (
        <div className="rounded-[12px] border border-grayBorder bg-offWhite1 p-4 flex items-start gap-3">
          <CheckCircle className="text-successGreenText shrink-0 mt-0.5" size={19} />
          <div>
            <p className="font-bold text-sm">Diem so: {submitResult.score}/100</p>
            <p className="text-xs text-secondaryText mt-1">
              Dung {submitResult.correctAnswers}/{submitResult.totalQuestions} cau. Ket qua da duoc luu vao lich su lam bai.
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={onSubmit}
          disabled={Object.keys(answers).length === 0}
          className="px-5 py-3 rounded-full bg-actionBlue hover:bg-actionBlueHover disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2"
        >
          <Send size={15} />
          Nop bai
        </button>
      )}
    </div>
  )
}

function QuestionInput({
  question,
  answers,
  setAnswers,
  disabled,
}: {
  question: ExerciseQuestionDTO
  answers: Record<string, unknown>
  setAnswers: Dispatch<SetStateAction<Record<string, unknown>>>
  disabled: boolean
}) {
  if (question.type === 'MULTIPLE_CHOICE') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {(question.options || []).map((option) => (
          <button
            key={option}
            disabled={disabled}
            onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.split('.')[0].trim() }))}
            className={`p-3 rounded-[10px] border text-left text-xs font-semibold transition-colors ${
              answers[question.id] === option.split('.')[0].trim()
                ? 'border-actionBlue bg-actionBlue/5 text-actionBlue'
                : 'border-grayBorder hover:bg-offWhite1'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    )
  }

  if (question.type === 'FILL_BLANK') {
    return (
      <input
        disabled={disabled}
        value={(answers[question.id] as string) || ''}
        onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
        placeholder="Nhap cau tra loi..."
        className="mt-4 w-full sm:max-w-sm bg-white border border-grayBorder rounded-[10px] py-3 px-4 text-sm focus:outline-none focus:border-actionBlue focus:ring-4 focus:ring-actionBlue/10"
      />
    )
  }

  const current = (answers[question.id] as Record<string, string> | undefined) || {}
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {(question.leftItems || []).map((left) => (
        <label key={left} className="text-xs font-semibold text-brandDark">
          <span>{left}</span>
          <select
            disabled={disabled}
            value={current[left] || ''}
            onChange={(event) => {
              const next = { ...current, [left]: event.target.value }
              setAnswers((allAnswers) => ({ ...allAnswers, [question.id]: next }))
            }}
            className="mt-1 w-full bg-white border border-grayBorder rounded-[10px] py-2.5 px-3 text-xs focus:outline-none focus:border-actionBlue"
          >
            <option value="">Chon nghia</option>
            {(question.rightItems || []).map((right) => (
              <option key={right} value={right}>{right}</option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}

function QuestionResult({ result }: { result?: ExerciseSubmitResponse['results'][number] }) {
  if (!result) return null

  return (
    <div className={`mt-4 rounded-[10px] border p-3 text-xs ${result.correct ? 'bg-successGreenBg/40 border-successGreenText/20' : 'bg-red-50 border-red-100'}`}>
      <p className={`font-bold ${result.correct ? 'text-successGreenText' : 'text-red-600'}`}>
        {result.correct ? 'Dung' : 'Chua dung'}
      </p>
      <p className="text-secondaryText mt-1">Dap an dung: {formatAnswer(result.correctAnswer)}</p>
      <p className="text-secondaryText mt-1">{result.explanation}</p>
    </div>
  )
}

function AttemptHistory({ attempts }: { attempts: ExerciseAttemptDTO[] }) {
  if (attempts.length === 0) {
    return <p className="text-sm text-secondaryText">Chua co lan lam bai nao duoc luu.</p>
  }

  return (
    <div className="space-y-4">
      {attempts.map((attempt) => (
        <div key={attempt.id} className="border border-grayBorder rounded-[12px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-sm">Diem: {attempt.score}/100</p>
            <p className="text-xs text-secondaryText">{formatDateTime(attempt.attemptedAt)}</p>
          </div>
          <p className="text-xs text-secondaryText mt-1">
            Dung {attempt.correctAnswers}/{attempt.totalQuestions} cau
          </p>
          <div className="mt-3 space-y-2">
            {attempt.results.map((result) => (
              <div key={result.questionId} className="text-xs bg-offWhite1 border border-grayBorder rounded-[10px] p-3">
                <p className="font-semibold">{result.prompt}</p>
                <p className={result.correct ? 'text-successGreenText mt-1' : 'text-red-600 mt-1'}>
                  {result.correct ? 'Dung' : 'Sai'} - Dap an dung: {formatAnswer(result.correctAnswer)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ElementType
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-h-[52px] px-3 flex items-center justify-center gap-2 text-xs font-bold uppercase border-b-2 transition-colors ${
        active ? 'text-actionBlue border-actionBlue bg-offWhite3' : 'text-secondaryText border-transparent hover:text-brandDark'
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  )
}

function StatusIcon({ status }: { status: LearningLessonDTO['progressStatus'] }) {
  if (status === 'COMPLETED') return <CheckCircle size={16} className="text-successGreenText shrink-0 mt-0.5" />
  if (status === 'IN_PROGRESS') return <Play size={16} className="text-actionBlue shrink-0 mt-0.5" />
  return <Circle size={16} className="text-darkGrayBorder shrink-0 mt-0.5" />
}

function pickInitialLesson(lessons: LearningLessonDTO[]) {
  const sorted = [...lessons].sort((a, b) => a.orderIndex - b.orderIndex)
  return sorted.find((lesson) => lesson.progressStatus === 'IN_PROGRESS')
    || sorted.find((lesson) => lesson.progressStatus === 'NOT_STARTED')
    || sorted[0]
    || null
}

function statusLabel(status: LearningLessonDTO['progressStatus']) {
  if (status === 'COMPLETED') return 'Da xem'
  if (status === 'IN_PROGRESS') return 'Dang hoc'
  return 'Chua xem'
}

function questionTypeLabel(type: ExerciseQuestionDTO['type']) {
  if (type === 'MULTIPLE_CHOICE') return 'Trac nghiem'
  if (type === 'FILL_BLANK') return 'Dien tu'
  return 'Ghep cap'
}

function formatAnswer(value: unknown): string {
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, string>)
      .map(([key, val]) => `${key}: ${val}`)
      .join('; ')
  }
  return String(value ?? '')
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
